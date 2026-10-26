---
id: "backend-foundation-learning"
title: "Go Backend Foundation & Deliberate Learning"
type: "discovery"
tags: ["go", "json", "filesystem", "gin", "deliberate-learning"]
summary: "Learned Go struct tags, file I/O, frontmatter parsing, and gamified state loops."
created_at: "2026-10-26T09:00:00Z"
---

# Go Backend Foundation: What You Learned

## 1. Go Structs & JSON Serialization
- **Struct Tags (`json:"..."`)**: Bridge Go PascalCase to JSON snake_case.
- **Nullable Fields (`*time.Time`)**: Pointer allows `nil` in Go, serializing cleanly to `null` in JSON instead of zero-time (`0001-01-01T00:00:00Z`).
- **Data Modeling**: Separated domain into `User`, `Session`, `Quest`, and `Note`.

## 2. File I/O & Filesystem State (No Heavy DB)
- **Reading files**: `os.ReadFile(path)` fetches raw byte slice (`[]byte`).
- **Decoding JSON**: `json.Unmarshal(data, &struct)` binds bytes into memory.
- **Writing files**: `json.MarshalIndent(struct, "", "  ")` produces readable indented JSON. `os.WriteFile(path, bytes, 0644)` saves atomically.
- **Dynamic path resolution**: Checked file existence with `os.Stat` to support running from root or `backend/`.

## 3. Stdlib String Manipulation & Frontmatter Parsing
- **Directory listing**: Used `os.ReadDir` for flat listing without recursive overhead.
- **Frontmatter delimiter**: `strings.SplitN(content, "---", 3)` extracts YAML header vs markdown body.
- **Key-Value parsing**: `strings.SplitN(line, ":", 2)` with `strings.Trim(val, "[]\" ")` parses lists and strings without external YAML dependencies.

## 4. Game Loop & State Mechanics
- **Combo Multiplier**: Consecutive quest completion increments multiplier (`+0.2`) to reward streaks.
- **Level Up Loop**:
  ```go
  for user.XP >= user.XPToNextLevel {
      user.Level++
      user.XP -= user.XPToNextLevel
      user.XPToNextLevel = int(float64(user.XPToNextLevel) * 1.5)
      leveledUp = true
  }
  ```
- **Dopamine Response Payload**: Server returns `xp_gained`, `leveled_up`, and updated session so frontend can trigger sound and particles.

## 5. Deliberate Learning Habits (Manware Toolkit)
- Committing to hypothesis first before writing code.
- Choosing stdlib over third-party dependencies when simple.
