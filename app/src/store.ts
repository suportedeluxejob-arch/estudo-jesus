import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Folder {
  id: string
  title: string
  color: string
  goal: number
  createdAt: number
}

export interface Note {
  id: string
  folderId: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

interface AppState {
  folders: Folder[]
  notes: Note[]
  spiritualXP: number
  level: number
  apiKey: string | null
  setApiKey: (key: string) => void
  addFolder: (title: string, goal: number, color?: string) => void
  deleteFolder: (id: string) => void
  addNote: (folderId: string, title: string, content: string) => string
  updateNote: (id: string, title: string, content: string) => void
  deleteNote: (id: string) => void
  gainXP: (amount: number) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      folders: [
        {
          id: '1',
          title: 'Evangelho de João',
          color: 'var(--color-folder-back)',
          goal: 21,
          createdAt: Date.now(),
        }
      ],
      notes: [
        {
          id: '1',
          folderId: '1',
          title: 'João 1:1-14 (O Verbo)',
          content: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus...',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      ],
      spiritualXP: 10,
      level: 1,
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      gainXP: (amount) => set((state) => {
        const newXP = state.spiritualXP + amount;
        const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
        return { spiritualXP: newXP, level: newLevel };
      }),
      addFolder: (title, goal, color) => set((state) => ({
        folders: [...state.folders, {
          id: crypto.randomUUID(),
          title,
          goal,
          color: color || 'var(--color-folder-back)',
          createdAt: Date.now()
        }]
      })),
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        notes: state.notes.filter(n => n.folderId !== id)
      })),
      addNote: (folderId, title, content) => {
        const id = crypto.randomUUID()
        set((state) => ({
          notes: [...state.notes, {
            id,
            folderId,
            title,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }]
        }))
        get().gainXP(50) // 50 XP for a new note
        return id
      },
      updateNote: (id, title, content) => {
        set((state) => ({
          notes: state.notes.map(n => n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n)
        }))
        get().gainXP(10) // 10 XP for editing
      },
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'diario-espiritual-storage'
    }
  )
)
