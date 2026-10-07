package models

import "time"

type User struct {
	Name string `json:"name"`
	Level int `json:"level"`
	XP int `json:"xp"`
	XPToNextLevel int `json:"xp_to_next_level"`
	StreakDays int `json:"streak_days"`
	ComboMultiplier float64 `json:"combo_multiplier"`
}

type Session struct {
	User User `json:"user"`
	TodayTopic string `json:"today_topic"`
	Quests []Quest `json:"quests"`
}

type Quest struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
	XPReward int `json:"xp_reward"`
	Completed bool `json:"completed"`
	CompletedAt *time.Time `json:"completed_at"`
}

type Note struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Type string `json:"type"`
	Tags []string `json:"tags"`
	Summary string `json:"summary"`
	Content string `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type CompleteQuestResponse struct {
	Message string `json:"message"`
	XPGained int `json:"xp_gained"`
	LeveledUp bool `json:"leveled_up"`
	Session Session `json:"session"`
}
