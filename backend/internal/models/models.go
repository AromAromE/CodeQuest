package models

import "time"

type Difficulty string

const (
	DifficultyEasy   Difficulty = "easy"
	DifficultyMedium Difficulty = "medium"
	DifficultyHard   Difficulty = "hard"
	DifficultyBoss   Difficulty = "boss"
)

type Rarity string

const (
	RarityCommon    Rarity = "common"
	RarityRare      Rarity = "rare"
	RarityEpic      Rarity = "epic"
	RarityLegendary Rarity = "legendary"
	RarityMythic    Rarity = "mythic"
)

type User struct {
	ID             string    `json:"id" bson:"_id,omitempty"`
	Username       string    `json:"username" bson:"username"`
	Email          string    `json:"email" bson:"email"`
	PasswordHash   string    `json:"-" bson:"password_hash"`
	Level          int       `json:"level" bson:"level"`
	XP             int       `json:"xp" bson:"xp"`
	XPToNextLevel  int       `json:"xpToNextLevel" bson:"xp_to_next_level"`
	Coins          int       `json:"coins" bson:"coins"`
	StreakDays     int       `json:"streakDays" bson:"streak_days"`
	LastActiveDate time.Time `json:"lastActiveDate" bson:"last_active_date"`
	CreatedAt      time.Time `json:"createdAt" bson:"created_at"`
}

type Task struct {
	ID          string     `json:"id" bson:"_id,omitempty"`
	ProjectID   string     `json:"projectId" bson:"project_id"`
	Title       string     `json:"title" bson:"title"`
	Description string     `json:"description" bson:"description"`
	Difficulty  Difficulty `json:"difficulty" bson:"difficulty"`
	XPReward    int        `json:"xpReward" bson:"xp_reward"`
	CoinReward  int        `json:"coinReward" bson:"coin_reward"`
	Completed   bool       `json:"completed" bson:"completed"`
	CompletedAt *time.Time `json:"completedAt,omitempty" bson:"completed_at,omitempty"`
	Tags        []string   `json:"tags" bson:"tags"`
}

type Project struct {
	ID            string    `json:"id" bson:"_id,omitempty"`
	UserID        string    `json:"userId" bson:"user_id"`
	Title         string    `json:"title" bson:"title"`
	Description   string    `json:"description" bson:"description"`
	Language      string    `json:"language" bson:"language"`
	Framework     string    `json:"framework" bson:"framework"`
	Level         int       `json:"level" bson:"level"`
	XP            int       `json:"xp" bson:"xp"`
	XPToNextLevel int       `json:"xpToNextLevel" bson:"xp_to_next_level"`
	TierName      string    `json:"tierName" bson:"tier_name"`
	Progress      int       `json:"progress" bson:"progress"`
	Tasks         []Task    `json:"tasks" bson:"tasks"`
	CreatedAt     time.Time `json:"createdAt" bson:"created_at"`
}

type Boss struct {
	ID             string `json:"id" bson:"_id,omitempty"`
	Name           string `json:"name" bson:"name"`
	Title          string `json:"title" bson:"title"`
	Description    string `json:"description" bson:"description"`
	MaxHP          int    `json:"maxHp" bson:"max_hp"`
	CurrentHP      int    `json:"currentHp" bson:"current_hp"`
	AvatarSvgType  string `json:"avatarSvgType" bson:"avatar_svg_type"`
	Weakness       string `json:"weakness" bson:"weakness"`
	WeeklyDeadline string `json:"weeklyDeadline" bson:"weekly_deadline"`
	IsDefeated     bool   `json:"isDefeated" bson:"is_defeated"`
}

type GitHubWebhookPayload struct {
	Ref        string `json:"ref"`
	Repository struct {
		Name     string `json:"name"`
		FullName string `json:"full_name"`
	} `json:"repository"`
	Commits []struct {
		ID      string `json:"id"`
		Message string `json:"message"`
		Author  struct {
			Name     string `json:"name"`
			Username string `json:"username"`
		} `json:"author"`
	} `json:"commits"`
}
