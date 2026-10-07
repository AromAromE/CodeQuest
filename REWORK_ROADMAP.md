# 🎮 CodeQuest — The Deliberate AI Learning RPG

> A live visual learning companion that transforms learning with Claude into a dopamine-fueled RPG quest experience.

---

## 🌟 The Core Vision

Instead of passive code generation, **CodeQuest** is a **Deliberate Learning Hub** driven by **Claude Chat** and structured by **Manware's AI Learning Toolkit**:

1. **Learning with Claude Chat**:
   - Claude acts as your Socratic tutor, examiner, and game master (using workflows like `/hint`, `/debug`, `/arch`, and `/explain`).
   - Claude generates your **Daily Quests** and records **Key Learnings / Discoveries** as Markdown files.
2. **Real-Time Visual Experience**:
   - The web app acts as a live dashboard showing today's learning goals, RPG level, XP bar, and combo streaks.
   - When you master a concept or complete a coding task in chat, an API call triggers instant **dopamine feedback** (retro arcade SFX, floating XP numbers, particles, confetti, and level-ups).
3. **Markdown Knowledge Deck**:
   - **📌 Quick Access / Pinned Deck**: High-impact cheat sheets, core mental models, and syntax references.
   - **⚡ Just Learned / Discoveries Feed**: Live timeline of breakthrough concepts unlocked during chat sessions.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 💬 Claude Chat (Learner + AI Tutor)                         │
│  • Discusses architecture, debugs with hypotheses           │
│  • Writes/Updates learning/session.json & *.md notes        │
└──────────────────────────────┬──────────────────────────────┘
                               │ File System / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ Go Backend Engine (Gin API)                              │
│  • Storage Layer: Reads/Writes learning/ filesystem         │
│  • /api/session: Returns user level, XP, today's quests     │
│  • /api/quests/:id/complete: Awards XP, calculates combos,  │
│    triggers Level Up, updates session.json                  │
│  • /api/notes: Scans & serves Pinned & Discovery .md files  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / SSE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 🖥️ Next.js Visual Hub                                       │
│  • Active Daily Quests & Progress Bars                      │
│  • Retro Web Audio Synthesizer & Dopamine FX                │
│  • Beautiful Markdown Viewer for Pinned & Discovery Cards   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File System Structure

```
CodeQuest/
├── backend/                  # Go Gin REST API & Storage Engine
│   ├── cmd/api/main.go
│   └── internal/
│       ├── models/models.go  # User, Session, Quest, Note structs
│       └── storage/storage.go # File-backed JSON & Markdown reader
├── frontend/                 # Next.js 15 Visual Hub & FX Engine
├── learning/                 # Active Markdown & Session Data
│   ├── session.json          # Daily stats, XP, level, quests
│   ├── pinned/               # Quick access cheat sheets (.md)
│   └── discoveries/          # "Just Learned" timeline notes (.md)
└── manware-toolkit/          # Socratic prompt templates & skills
```

---

## 📊 Data Models

### 1. `session.json`
```json
{
  "user": {
    "name": "Learner",
    "level": 1,
    "xp": 0,
    "xp_to_next_level": 300,
    "streak_days": 1,
    "combo_multiplier": 1.0
  },
  "today_topic": "Introduction to CodeQuest & Deliberate Learning",
  "quests": [
    {
      "id": "quest-1",
      "title": "Setup Backend & Models",
      "description": "Define Go structs and file storage for session and notes.",
      "xp_reward": 150,
      "completed": true,
      "completed_at": "2026-10-07T10:30:00Z"
    }
  ]
}
```

### 2. Markdown Note Frontmatter Schema
```markdown
---
id: "go-goroutines-channels"
title: "Channels & Goroutines Mental Model"
type: "pinned" # or "discovery"
tags: ["go", "concurrency", "backend"]
summary: "Channels are typed conduits; goroutines are lightweight threads."
created_at: "2026-10-07T10:00:00Z"
---

# Channels & Goroutines

Main explanation and takeaways...
```

---

## 🚀 Progress & Next Milestones

- [x] **Cloned Manware AI Learning Toolkit** and mapped cognitive skills.
- [x] **Defined new CodeQuest concept**: Web visual companion + Claude Chat + Markdown knowledge deck.
- [x] **Built Go Models** (`models.go`): `User`, `Session`, `Quest`, `Note`, `CompleteQuestResponse`.
- [x] **Built Go Storage Engine** (`storage.go`): File reading/writing for `session.json`, combo multipliers, and level-up logic.
- [ ] **Next**: Implement Markdown file parser for `learning/pinned/` and `learning/discoveries/`.
- [ ] **Next**: Wire up Gin API routes in `backend/cmd/api/main.go`.
- [ ] **Next**: Reconstruct the Next.js frontend to display daily quests, dopamine effects, and markdown cards.
