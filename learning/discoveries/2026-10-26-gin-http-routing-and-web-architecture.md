---
id: "gin-http-routing-and-web-architecture"
title: "Gin HTTP Routing, CORS & Go Web Architecture"
type: "discovery"
tags: ["go", "gin", "rest-api", "cors", "http", "state-machine", "manware"]
summary: "Full breakdown of Gin routing, CORS preflights, nil slice JSON traps, and state-driven game APIs."
created_at: "2026-10-26T09:30:00Z"
---

# Gin HTTP Routing, CORS & Go Web Architecture

## 1. Gin Routing & REST API Architecture
- **Route Grouping (`r.Group("/api")`)**:
  - Eliminates path duplication.
  - Applies scoped middleware to entire subtrees cleanly.
- **REST Semantics & HTTP Verbs**:
  - `GET`: Safe, idempotent, read-only (`/api/session`, `/api/notes`, `/api/notes/:id`).
  - `POST`: State mutation with side effects (`/api/quests/:id/complete`).
- **Path Parameters**:
  - Path wildcard `:id` extracted via `c.Param("id")`.
- **Status Code Precision**:
  - `200 OK`: Successful read or mutation.
  - `204 No Content`: Preflight OPTIONS success without payload.
  - `400 Bad Request`: Client broke business invariants (e.g. quest already completed).
  - `404 Not Found`: Target entity does not exist on disk or in memory.
  - `500 Internal Server Error`: Disk write failure, JSON marshal error, or unrecoverable filesystem fault.

## 2. CORS & Browser Preflight (`OPTIONS`)
- **Same-Origin Policy**: Browser enforces Origin = Scheme + Domain + Port. `http://localhost:3000` calling `http://localhost:8080` is Cross-Origin.
- **Preflight Check**:
  - Non-simple requests trigger browser `OPTIONS` preflight before real request.
  - Server must answer with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.
  - Gin handler intercepts `OPTIONS` and immediately calls `c.AbortWithStatus(http.StatusNoContent)`.

## 3. The Go `nil` Slice vs `[]` JSON Serialization Trap
- **The Trap**:
  - `var notes []models.Note` sets pointer to `nil`.
  - `json.Marshal(nil)` outputs JSON `null`.
  - Frontend calling `notes.map(...)` throws unhandled runtime `TypeError`.
- **The Solution**:
  - Initialize empty slice: `notes := make([]models.Note, 0)` or `[]models.Note{}`.
  - Serializes cleanly to `[]`, preserving frontend array contracts.

## 4. Frontmatter & File-as-Database Storage
- **Atomic File Operations**:
  - `os.ReadFile(path)` loads raw bytes into memory.
  - `json.Unmarshal` maps bytes to domain structs.
  - `json.MarshalIndent` + `os.WriteFile(path, data, 0644)` guarantees readable JSON on disk.
- **Stdlib Frontmatter Parsing**:
  - `strings.SplitN(content, "---", 3)` splits markdown into prefix, YAML header, and markdown body.
  - Line-by-line `strings.SplitN(line, ":", 2)` extracts metadata without external YAML dependencies.

## 5. Gamified State Machine & Deliberate Learning
- **Combo Scaling**:
  - Success increments combo multiplier (`session.User.ComboMultiplier += 0.2`).
  - `xpGained = int(float64(targetQuest.XPReward) * multiplier)`.
- **Level Up Loop**:
  - Handles multi-level progression when large XP spikes occur.
  - Dynamic threshold scaling: `XPToNextLevel = int(float64(XPToNextLevel) * 1.5)`.
- **Manware Tutoring Principles Applied**:
  - Predict behavior and HTTP response status before executing curl.
  - Use graduated hint ladders rather than copying answers.
