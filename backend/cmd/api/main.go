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

	

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
