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

const SPIRITUAL_GRADIENTS = [
  'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', // Violeta/Índigo (Intuição)
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Rosa Profundo (Amor)
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Azul Safira (Sabedoria)
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Esmeralda (Cura)
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Ouro Âmbar (Iluminação)
  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', // Ciano Celeste (Clareza)
  'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'  // Rubi (Devoção)
]

const calculateXPAndLevel = (folders: Folder[], notes: Note[]) => {
  // Base XP: 100 per folder + 50 per note
  let xp = folders.length * 100 + notes.length * 50

  // 1 XP for every 10 characters written in the notes (up to 150 XP per note to prevent extreme values)
  notes.forEach(note => {
    const contentLength = note.content ? note.content.trim().length : 0
    const contentXP = Math.min(150, Math.floor(contentLength / 10))
    xp += contentXP
  })

  // Level: 100 XP per level, starting at level 1
  const level = Math.floor(xp / 100) + 1
  return { spiritualXP: xp, level }
}

export const useStore = create<AppState>()(
  persist(
    (set) => {
      // Helper to calculate XP with current state
      const updateXP = (folders: Folder[], notes: Note[]) => {
        return calculateXPAndLevel(folders, notes)
      }

      // Initial state folders and notes
      const initialFolders = [
        {
          id: '1',
          title: 'Evangelho de João',
          color: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
          goal: 21,
          createdAt: Date.now(),
        }
      ]

      const initialNotes = [
        {
          id: '1',
          folderId: '1',
          title: 'João 1:1-14 (O Verbo)',
          content: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus...',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      ]

      const initialXPStats = calculateXPAndLevel(initialFolders, initialNotes)

      return {
        folders: initialFolders,
        notes: initialNotes,
        spiritualXP: initialXPStats.spiritualXP,
        level: initialXPStats.level,
        apiKey: null,
        setApiKey: (key) => set({ apiKey: key }),
        gainXP: () => {
          // No-op since XP is computed dynamically on state changes
        },
        addFolder: (title, goal, color) => set((state) => {
          const folderColor = color || SPIRITUAL_GRADIENTS[state.folders.length % SPIRITUAL_GRADIENTS.length]
          const newFolders = [...state.folders, {
            id: crypto.randomUUID(),
            title,
            goal,
            color: folderColor,
            createdAt: Date.now()
          }]
          const stats = updateXP(newFolders, state.notes)
          return {
            folders: newFolders,
            spiritualXP: stats.spiritualXP,
            level: stats.level
          }
        }),
        deleteFolder: (id) => set((state) => {
          const newFolders = state.folders.filter(f => f.id !== id)
          const newNotes = state.notes.filter(n => n.folderId !== id)
          const stats = updateXP(newFolders, newNotes)
          return {
            folders: newFolders,
            notes: newNotes,
            spiritualXP: stats.spiritualXP,
            level: stats.level
          }
        }),
        addNote: (folderId, title, content) => {
          const id = crypto.randomUUID()
          set((state) => {
            const newNotes = [...state.notes, {
              id,
              folderId,
              title,
              content,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }]
            const stats = updateXP(state.folders, newNotes)
            return {
              notes: newNotes,
              spiritualXP: stats.spiritualXP,
              level: stats.level
            }
          })
          return id
        },
        updateNote: (id, title, content) => {
          set((state) => {
            const newNotes = state.notes.map(n => n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n)
            const stats = updateXP(state.folders, newNotes)
            return {
              notes: newNotes,
              spiritualXP: stats.spiritualXP,
              level: stats.level
            }
          })
        },
        deleteNote: (id) => set((state) => {
          const newNotes = state.notes.filter(n => n.id !== id)
          const stats = updateXP(state.folders, newNotes)
          return {
            notes: newNotes,
            spiritualXP: stats.spiritualXP,
            level: stats.level
          }
        })
      }
    },
    {
      name: 'diario-espiritual-storage',
      // Migrate storage if needed, but since keys remain identical, it is transparent!
    }
  )
)
