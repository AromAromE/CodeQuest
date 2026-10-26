import { Session, Note, CompleteQuestResponse } from "@/types/game";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    throw new Error(errBody?.error || `API Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getSession: () => fetchApi<Session>("/session"),
  completeQuest: (id: string) =>
    fetchApi<CompleteQuestResponse>(`/quests/${encodeURIComponent(id)}/complete`, {
      method: "POST",
    }),
  getNotes: () => fetchApi<Note[]>("/notes"),
  getNoteById: (id: string) => fetchApi<Note>(`/notes/${encodeURIComponent(id)}`),
};
