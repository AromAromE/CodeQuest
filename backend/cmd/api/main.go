package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"codequest-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// In-Memory Database Store for Instant Local Playability & High Performance
type DBStore struct {
	User     models.User
	Projects []models.Project
	Boss     models.Boss
}

var store = DBStore{
	User: models.User{
		ID:            "user-1",
		Username:      "NeoCoder",
		Email:         "neocoder@codequest.dev",
		Level:         4,
		XP:            320,
		XPToNextLevel: 750,
		Coins:         450,
		StreakDays:    5,
		LastActiveDate: time.Now(),
		CreatedAt:     time.Now().Add(-120 * time.Hour),
	},
	Projects: []models.Project{
		{
			ID:            "proj-1",
			UserID:        "user-1",
			Title:         "CodeQuest RPG Engine",
			Description:   "Full-stack gamified coding platform with real-time dopamine triggers.",
			Language:      "TypeScript / Go",
			Framework:     "Next.js & Gin",
			Level:         4,
			XP:            260,
			XPToNextLevel: 400,
			TierName:      "Growing API",
			Progress:      45,
			Tasks: []models.Task{
				{
					ID:          "t-1",
					ProjectID:   "proj-1",
					Title:       "Implement Web Audio SFX Engine",
					Description: "Zero-latency arcade synthesizer for XP & Coin pickups",
					Difficulty:  models.DifficultyMedium,
					XPReward:    75,
					CoinReward:  35,
					Completed:   true,
					Tags:        []string{"frontend"},
				},
				{
					ID:          "t-2",
					ProjectID:   "proj-1",
					Title:       "Build Developer Evolution Avatar",
					Description: "Visual SVG transformations for Lv 1 -> 100+ stages",
					Difficulty:  models.DifficultyHard,
					XPReward:    200,
					CoinReward:  100,
					Completed:   false,
					Tags:        []string{"frontend", "system_design"},
				},
			},
		},
	},
	Boss: models.Boss{
		ID:             "boss-1",
		Name:           "The Monolith Dragon",
		Title:          "Ancient Kraken of Legacy Spaghetti Code",
		Description:    "A terrifying colossal dragon woven from 1,000,000 lines of unrefactored legacy code.",
		MaxHP:          2500,
		CurrentHP:      1850,
		AvatarSvgType:  "dragon",
		Weakness:       "system_design",
		WeeklyDeadline: "3 days 14 hours remaining",
		IsDefeated:     false,
	},
}

func main() {
	r := gin.Default()

	// Lightweight zero-dependency CORS middleware compatible with all Go runtime versions
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "online", "game": "CodeQuest RPG Backend"})
		})

		// User & Profile
		api.GET("/user/profile", func(c *gin.Context) {
			c.JSON(http.StatusOK, store.User)
		})

		// Projects
		api.GET("/projects", func(c *gin.Context) {
			c.JSON(http.StatusOK, store.Projects)
		})

		api.POST("/projects", func(c *gin.Context) {
			var newProj models.Project
			if err := c.ShouldBindJSON(&newProj); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			newProj.ID = fmt.Sprintf("proj-%d", time.Now().UnixNano())
			newProj.Level = 1
			newProj.XP = 0
			newProj.XPToNextLevel = 100
			newProj.TierName = "Baby API"
			newProj.Progress = 0
			newProj.Tasks = []models.Task{}
			newProj.CreatedAt = time.Now()

			store.Projects = append(store.Projects, newProj)
			c.JSON(http.StatusCreated, newProj)
		})

		// Tasks
		api.POST("/tasks/complete/:id", func(c *gin.Context) {
			taskID := c.Param("id")
			for i, p := range store.Projects {
				for j, t := range p.Tasks {
					if t.ID == taskID && !t.Completed {
						now := time.Now()
						store.Projects[i].Tasks[j].Completed = true
						store.Projects[i].Tasks[j].CompletedAt = &now

						// Award XP
						store.User.XP += t.XPReward
						store.User.Coins += t.CoinReward

						// Damage Boss
						if store.Boss.CurrentHP > 0 {
							store.Boss.CurrentHP -= t.XPReward
							if store.Boss.CurrentHP <= 0 {
								store.Boss.CurrentHP = 0
								store.Boss.IsDefeated = true
							}
						}

						c.JSON(http.StatusOK, gin.H{
							"message":  "Task completed! XP and coins awarded.",
							"xpGained": t.XPReward,
							"coins":    t.CoinReward,
							"user":     store.User,
							"boss":     store.Boss,
						})
						return
					}
				}
			}
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found or already completed"})
		})

		// Boss
		api.GET("/boss", func(c *gin.Context) {
			c.JSON(http.StatusOK, store.Boss)
		})

		// GitHub Webhook for automatic commit XP rewards
		api.POST("/webhooks/github", func(c *gin.Context) {
			var payload models.GitHubWebhookPayload
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			commitCount := len(payload.Commits)
			xpEarned := commitCount * 50
			coinsEarned := commitCount * 20

			store.User.XP += xpEarned
			store.User.Coins += coinsEarned

			c.JSON(http.StatusOK, gin.H{
				"message":     fmt.Sprintf("Processed %d commits from %s!", commitCount, payload.Repository.FullName),
				"xpEarned":    xpEarned,
				"coinsEarned": coinsEarned,
			})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
