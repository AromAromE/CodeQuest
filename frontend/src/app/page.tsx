"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { Note } from "@/types/game";
import { CyberParticlesCanvas } from "@/components/game-ui/CyberParticlesCanvas";
import { FloatingFX } from "@/components/game-ui/FloatingFX";
import { LevelUpModal } from "@/components/game-ui/LevelUpModal";
import {
  Zap,
  Flame,
  Trophy,
  CheckCircle2,
  BookOpen,
  Pin,
  Compass,
  Search,
  Tag,
  X,
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
  Terminal,
  RefreshCw,
} from "lucide-react";

type FilterTab = "all" | "pinned" | "discovery";

export default function DashboardPage() {
  const {
    session,
    notes,
    loading,
    completingQuestId,
    error,
    isMuted,
    fetchAll,
    completeQuest,
    toggleSoundMute,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const { user, today_topic, quests } = session;
  const xpPercent = Math.min(
    100,
    Math.round((user.xp / Math.max(1, user.xp_to_next_level)) * 100)
  );
  const completedCount = quests.filter((q) => q.completed).length;

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (activeTab !== "all" && n.type !== activeTab) return false;
      if (selectedTag && !(n.tags || []).includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = n.title.toLowerCase().includes(q);
        const inSummary = (n.summary || "").toLowerCase().includes(q);
        const inContent = (n.content || "").toLowerCase().includes(q);
        const inTags = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSummary && !inContent && !inTags) return false;
      }
      return true;
    });
  }, [notes, activeTab, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberParticlesCanvas />
      <FloatingFX />
      <LevelUpModal />

      {/* 1. Top Status Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Brand + User */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-[0_0_20px_rgba(0,240,255,0.35)]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white text-glow-cyan">
                  CODE<span className="text-cyan-400">QUEST</span>
                </span>
                <span className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-300 ring-1 ring-cyan-500/30">
                  {user.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Deliberate Learning RPG</p>
            </div>
          </div>

          {/* Animated XP Bar & Level Badge */}
          <div className="flex flex-1 items-center gap-3 max-w-md min-w-[220px]">
            <div className="flex h-10 px-3 items-center justify-center rounded-xl bg-cyan-950/90 font-mono text-xs font-black text-cyan-300 ring-1 ring-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              LVL {user.level}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-300">Experience</span>
                <span className="font-mono text-cyan-400">
                  {user.xp} / {user.xp_to_next_level} XP
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                />
              </div>
            </div>
          </div>

          {/* Streak, Combo, Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-xl bg-purple-950/70 px-3 py-1.5 text-xs font-black text-purple-300 ring-1 ring-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>{user.combo_multiplier.toFixed(1)}x COMBO</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-black text-amber-400 ring-1 ring-amber-500/30">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-400" />
              <span>{user.streak_days}d Streak</span>
            </div>

            <button
              onClick={() => fetchAll()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:text-cyan-400 transition"
              title="Sync with Backend"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            <button
              onClick={toggleSoundMute}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:text-white transition"
              title={isMuted ? "Unmute SFX" : "Mute SFX"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {/* Error Banner */}
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-3 text-xs font-medium text-rose-200 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchAll()}
              className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-rose-200 hover:bg-rose-500/30 font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Today's Topic Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3.5">
            <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400 ring-1 ring-cyan-500/30">
              <Terminal className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Today&apos;s Focus Topic
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {today_topic}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center rounded-xl bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-slate-300 ring-1 ring-slate-800">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>
              {completedCount} / {quests.length} Quests Cleared
            </span>
          </div>
        </motion.div>

        {/* Main Two-Column Grid: Quests + Knowledge Vault */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 2. Today's Quests Panel */}
          <section className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Today&apos;s Quests</h3>
                    <p className="text-xs text-slate-400">Complete objectives to earn XP</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-amber-400 ring-1 ring-slate-800">
                  {completedCount}/{quests.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {quests.length === 0 && !loading && (
                  <p className="py-8 text-center text-xs text-slate-500">
                    No active quests in session.
                  </p>
                )}

                {quests.map((quest) => {
                  const isCompleting = completingQuestId === quest.id;
                  return (
                    <motion.div
                      key={quest.id}
                      layout
                      className={`rounded-xl p-4 transition-all ${
                        quest.completed
                          ? "bg-emerald-950/20 ring-1 ring-emerald-500/30 opacity-80"
                          : "bg-slate-900/75 ring-1 ring-slate-800 hover:ring-cyan-500/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              quest.completed
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-cyan-400 ring-1 ring-slate-700"
                            }`}
                          >
                            {quest.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              "!"
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-sm font-bold ${
                                quest.completed ? "line-through text-slate-400" : "text-white"
                              }`}
                            >
                              {quest.title}
                            </h4>
                            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                              {quest.description}
                            </p>
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-500/30">
                                +{quest.xp_reward} XP
                              </span>
                              {quest.completed && quest.completed_at && (
                                <span className="text-[10px] text-emerald-400/80 font-mono">
                                  Cleared {new Date(quest.completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {quest.completed ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Done
                            </span>
                          ) : (
                            <button
                              disabled={isCompleting}
                              onClick={(e) =>
                                completeQuest(quest.id, { x: e.clientX, y: e.clientY })
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.35)] transition hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                              {isCompleting ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  <span>Completing</span>
                                </>
                              ) : (
                                <>
                                  <Zap className="h-3.5 w-3.5 fill-slate-950" />
                                  <span>Complete</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Knowledge Vault (Notes Panel) */}
          <section className="lg:col-span-7 space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Knowledge Vault</h3>
                    <p className="text-xs text-slate-400">
                      Pinned Playbooks &amp; Daily Discoveries
                    </p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 ring-1 ring-slate-800">
                  {(
                    [
                      { id: "all", label: "All", count: notes.length },
                      {
                        id: "pinned",
                        label: "Pinned",
                        count: notes.filter((n) => n.type === "pinned").length,
                      },
                      {
                        id: "discovery",
                        label: "Discoveries",
                        count: notes.filter((n) => n.type === "discovery").length,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        activeTab === tab.id
                          ? "bg-cyan-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}{" "}
                      <span className="ml-0.5 opacity-75 font-mono text-[10px]">
                        ({tab.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Input & Tag Pills */}
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes by title, summary, tag, or content..."
                    className="w-full rounded-xl bg-slate-900/90 py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-500 ring-1 ring-slate-800 focus:outline-none focus:ring-cyan-500/60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {allTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-1">
                      <Tag className="h-3 w-3" /> Tags:
                    </span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                        selectedTag === null
                          ? "bg-purple-500 text-slate-950"
                          : "bg-slate-900 text-slate-400 ring-1 ring-slate-800 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTag(selectedTag === tag ? null : tag)
                        }
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                          selectedTag === tag
                            ? "bg-purple-500 text-slate-950"
                            : "bg-slate-900 text-slate-400 ring-1 ring-slate-800 hover:text-white"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Note Cards Grid */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-full rounded-xl border border-dashed border-slate-800 py-12 text-center text-xs text-slate-500">
                    No matching notes found in the Knowledge Vault.
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <motion.button
                      key={note.id}
                      layout
                      onClick={() => setSelectedNote(note)}
                      className="group flex flex-col justify-between rounded-xl bg-slate-900/75 p-4 text-left ring-1 ring-slate-800 transition hover:bg-slate-900 hover:ring-cyan-500/50"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              note.type === "pinned"
                                ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                                : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                            }`}
                          >
                            {note.type === "pinned" ? (
                              <Pin className="h-3 w-3" />
                            ) : (
                              <Compass className="h-3 w-3" />
                            )}
                            {note.type}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 group-hover:text-cyan-400 transition">
                            Read →
                          </span>
                        </div>

                        <h4 className="mt-2.5 text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {note.title}
                        </h4>

                        {note.summary && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                            {note.summary}
                          </p>
                        )}
                      </div>

                      {(note.tags || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1 pt-2 border-t border-slate-800/60">
                          {note.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-slate-800/90 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Note Markdown Reader Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-glow relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-cyan-500/30 bg-slate-950/95 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        selectedNote.type === "pinned"
                          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
                          : "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40"
                      }`}
                    >
                      {selectedNote.type}
                    </span>
                    {(selectedNote.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 text-xl font-black text-white">
                    {selectedNote.title}
                  </h3>
                  {selectedNote.summary && (
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedNote.summary}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="rounded-xl bg-slate-900 p-2 text-slate-400 ring-1 ring-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body — Markdown Renderer */}
              <div className="overflow-y-auto p-6 space-y-3 text-sm leading-relaxed text-slate-200 select-text">
                <MarkdownView content={selectedNote.content} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ponytail: lightweight dependency-free markdown block renderer; add react-markdown when complex tables/footnotes needed.
function MarkdownView({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, lines[lines.length - 1]?.startsWith("```") ? -1 : undefined).join("\n");
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-xl bg-slate-900/95 p-4 font-mono text-xs text-cyan-200 ring-1 ring-slate-800"
            >
              <code>{code}</code>
            </pre>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-lg font-black text-white pt-2">
              {trimmed.slice(2)}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-base font-bold text-cyan-300 pt-2">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-sm font-bold text-slate-100 pt-1">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.split("\n").every((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1 text-slate-300">
              {trimmed.split("\n").map((item, j) => (
                <li key={j}>{item.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="whitespace-pre-wrap text-slate-300">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
