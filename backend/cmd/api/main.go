package main

import (
	"net/http"
	"os"

	"codequest-backend/internal/storage"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS middleware for localhost frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		// 1. Session state
		api.GET("/session", func(c *gin.Context) {
			session, err := storage.GetSession()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, session)
		})

		// 2. Complete quest
		api.POST("/quests/:id/complete", func(c *gin.Context) {
			questID := c.Param("id")
			res, err := storage.CompleteQuest(questID)
			if err != nil {
				if err.Error() == "quest not found" {
					c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
					return
				}
				if err.Error() == "quest already completed" {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, res)
		})

		// 3. Notes list
		api.GET("/notes", func(c *gin.Context) {
			notes, err := storage.GetNotes()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, notes)
		})

		// 4. Single note
		api.GET("/notes/:id", func(c *gin.Context) {
			id := c.Param("id")
			note, err := storage.GetNoteByID(id)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, note)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
