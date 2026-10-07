package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"

	"codequest-backend/internal/models"
)

// getPaths dynamically finds whether we are running from root or backend/
func getPaths() (string, string) {
	if _, err := os.Stat("learning"); err == nil {
		return "learning/session.json", "learning"
	}
	return "../learning/session.json", "../learning"
}

// GetDefaultSession returns the starting state for a new learner
func GetDefaultSession() models.Session {
	return models.Session{
		User: models.User{
			Name:            "Learner",
			Level:           1,
			XP:              0,
			XPToNextLevel:   300,
			StreakDays:      1,
			ComboMultiplier: 1.0,
		},
		TodayTopic: "Introduction to CodeQuest & Deliberate Learning",
		Quests: []models.Quest{
			{
				ID:          "quest-1",
				Title:       "Setup Backend & Models",
				Description: "Define Go structs and file storage for session and notes.",
				XPReward:    150,
				Completed:   false,
				CompletedAt: nil,
			},
			{
				ID:          "quest-2",
				Title:       "Test Quest Completion API",
				Description: "Trigger quest completion endpoint and verify XP gain and level up.",
				XPReward:    200,
				Completed:   false,
				CompletedAt: nil,
			},
		},
	}
}

// GetSession reads session.json or initializes a default one if missing
func GetSession() (models.Session, error) {
	sessionPath, learningDir := getPaths()

	data, err := os.ReadFile(sessionPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Ensure learning directory exists
			if mkErr := os.MkdirAll(learningDir, 0755); mkErr != nil {
				return models.Session{}, fmt.Errorf("failed to create directory: %w", mkErr)
			}
			defaultSession := GetDefaultSession()
			if saveErr := SaveSession(defaultSession); saveErr != nil {
				return models.Session{}, fmt.Errorf("failed to save default session: %w", saveErr)
			}
			return defaultSession, nil
		}
		return models.Session{}, fmt.Errorf("failed to read session file: %w", err)
	}

	var session models.Session
	if err := json.Unmarshal(data, &session); err != nil {
		return models.Session{}, fmt.Errorf("failed to parse session JSON: %w", err)
	}

	return session, nil
}

// SaveSession writes the session struct to session.json with pretty formatting
func SaveSession(session models.Session) error {
	sessionPath, learningDir := getPaths()

	// Ensure directory exists
	if err := os.MkdirAll(learningDir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	data, err := json.MarshalIndent(session, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to serialize session JSON: %w", err)
	}

	if err := os.WriteFile(sessionPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write session file: %w", err)
	}

	return nil
}

// CompleteQuest marks a quest as done, awards XP with combo multiplier, and handles Level Up
func CompleteQuest(questID string) (models.CompleteQuestResponse, error) {
	session, err := GetSession()
	if err != nil {
		return models.CompleteQuestResponse{}, err
	}

	var targetQuest *models.Quest
	for i := range session.Quests {
		if session.Quests[i].ID == questID {
			targetQuest = &session.Quests[i]
			break
		}
	}

	if targetQuest == nil {
		return models.CompleteQuestResponse{}, errors.New("quest not found")
	}

	if targetQuest.Completed {
		return models.CompleteQuestResponse{}, errors.New("quest already completed")
	}

	// 1. Mark complete
	now := time.Now()
	targetQuest.Completed = true
	targetQuest.CompletedAt = &now

	// 2. Calculate XP with combo multiplier
	multiplier := session.User.ComboMultiplier
	if multiplier <= 0 {
		multiplier = 1.0
	}
	xpGained := int(float64(targetQuest.XPReward) * multiplier)
	session.User.XP += xpGained

	// Increase combo streak multiplier slightly for consecutive completions
	session.User.ComboMultiplier = multiplier + 0.2

	// 3. Level Up Logic
	leveledUp := false
	for session.User.XP >= session.User.XPToNextLevel {
		session.User.Level++
		session.User.XP -= session.User.XPToNextLevel
		session.User.XPToNextLevel = int(float64(session.User.XPToNextLevel) * 1.5)
		leveledUp = true
	}

	// 4. Save updated session
	if err := SaveSession(session); err != nil {
		return models.CompleteQuestResponse{}, err
	}

	return models.CompleteQuestResponse{
		Message:   fmt.Sprintf("Quest '%s' completed! +%d XP", targetQuest.Title, xpGained),
		XPGained:  xpGained,
		LeveledUp: leveledUp,
		Session:   session,
	}, nil
}
