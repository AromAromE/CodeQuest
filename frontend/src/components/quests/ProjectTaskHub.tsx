"use client";

import { useGameStore } from "@/lib/store";
import { CheckCircle2, Flame, Coins, Sparkles, Plus, Code2, Layers } from "lucide-react";
import { Difficulty } from "@/types/game";
import { useState } from "react";

export function ProjectTaskHub() {
  const projects = useGameStore((state) => state.projects);
  const completeTask = useGameStore((state) => state.completeTask);
  const addTask = useGameStore((state) => state.addTask);
  const addProject = useGameStore((state) => state.addProject);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDiff, setTaskDiff] = useState<Difficulty>("medium");

  // New project form state
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projLang, setProjLang] = useState("TypeScript");
  const [projFrame, setProjFrame] = useState("Next.js");

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleTaskCheck = (taskId: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    completeTask(taskId, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentProject) return;

    const diffMap = {
      easy: { xp: 25, coins: 10 },
      medium: { xp: 75, coins: 35 },
      hard: { xp: 200, coins: 100 },
      boss: { xp: 500, coins: 300 },
    };

    addTask(currentProject.id, {
      title: taskTitle,
      description: taskDesc,
      difficulty: taskDiff,
      xpReward: diffMap[taskDiff].xp,
      coinReward: diffMap[taskDiff].coins,
      tags: ["frontend", "backend"],
    });

    setTaskTitle("");
    setTaskDesc("");
    setShowNewTaskModal(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    addProject({
      title: projTitle,
      description: projDesc,
      language: projLang,
      framework: projFrame,
      color: "from-cyan-500 to-blue-600",
      icon: "Code2",
    });

    setProjTitle("");
    setProjDesc("");
    setShowNewProjectModal(false);
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case "easy":
        return <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-400">Easy (+25 XP)</span>;
      case "medium":
        return <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-cyan-400">Med (+75 XP)</span>;
      case "hard":
        return <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-purple-400">Hard (+200 XP)</span>;
      case "boss":
        return <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-rose-400">Boss (+500 XP)</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      {/* Hub Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Project Quest Hub</h3>
            <p className="text-xs text-slate-400">Level up your repositories with every commit & milestone</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" /> New Project
          </button>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              proj.id === currentProject?.id
                ? "bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-white ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-4 w-4 text-cyan-400" />
            <span>{proj.title}</span>
            <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] text-amber-400">
              Lv {proj.level}
            </span>
          </button>
        ))}
      </div>

      {/* Active Project Card */}
      {currentProject && (
        <div className="mt-4 rounded-xl bg-slate-900/90 p-5 ring-1 ring-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-white">{currentProject.title}</h4>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-300">
                  {currentProject.tierName}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{currentProject.description}</p>
              <div className="mt-2 flex gap-2 text-[11px] text-cyan-400">
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono">{currentProject.language}</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono">{currentProject.framework}</span>
              </div>
            </div>

            {/* Project Progress Gauge */}
            <div className="w-full md:w-56 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Milestone Progress</span>
                <span className="text-cyan-400">{currentProject.progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-950 ring-1 ring-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${currentProject.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>XP: {currentProject.xp} / {currentProject.xpToNextLevel}</span>
                <span>Project Lv {currentProject.level}</span>
              </div>
            </div>
          </div>

          {/* Project Tasks List */}
          <div className="mt-4 space-y-2.5">
            {currentProject.tasks.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">No tasks yet. Add one above to start gaining XP!</p>
            ) : (
              currentProject.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between rounded-xl p-3.5 transition-all ${
                    task.completed
                      ? "bg-slate-950/40 opacity-50 line-through"
                      : "bg-slate-800/60 hover:bg-slate-800 ring-1 ring-slate-700/50 hover:ring-cyan-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => !task.completed && handleTaskCheck(task.id, e)}
                      disabled={task.completed}
                      className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                        task.completed
                          ? "bg-emerald-500 text-slate-950"
                          : "border-2 border-slate-600 hover:border-cyan-400 hover:scale-110"
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{task.title}</h5>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getDifficultyBadge(task.difficulty)}
                    <span className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                      <Coins className="h-3 w-3" /> +{task.coinReward}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-cyan-500/40">
            <h4 className="text-base font-black text-white">Create New Quest Task</h4>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth2 login flow"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Short quest requirements..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Difficulty Tier</label>
                <select
                  value={taskDiff}
                  onChange={(e) => setTaskDiff(e.target.value as Difficulty)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="easy">Easy (+25 XP, +10 Coins)</option>
                  <option value="medium">Medium (+75 XP, +35 Coins)</option>
                  <option value="hard">Hard (+200 XP, +100 Coins)</option>
                  <option value="boss">Boss (+500 XP, +300 Coins)</option>
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyan-400"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-cyan-500/40">
            <h4 className="text-base font-black text-white">Create New CodeQuest Project</h4>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microservices Auth Server"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed token verification service"
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400">Primary Language</label>
                  <input
                    type="text"
                    value={projLang}
                    onChange={(e) => setProjLang(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400">Framework</label>
                  <input
                    type="text"
                    value={projFrame}
                    onChange={(e) => setProjFrame(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyan-400"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
