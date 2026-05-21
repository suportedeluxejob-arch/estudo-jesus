import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookOpen, Settings, X } from 'lucide-react'
import { Home } from './pages/Home'
import { FolderView } from './pages/FolderView'
import { Editor } from './pages/Editor'
import { useStore } from './store'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const apiKey = useStore(state => state.apiKey)
  const setApiKey = useStore(state => state.setApiKey)
  const [tempKey, setTempKey] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="border-b border-border/50 p-4 flex justify-between items-center bg-card/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="text-accent w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Diário Espiritual</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors border border-border cursor-pointer flex items-center gap-2"
              title="Configurações de IA"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors border border-border cursor-pointer"
            >
              {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
            </button>
          </div>
        </header>

        {isSettingsOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  Configurações de IA
                </h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para o Assistente Espiritual funcionar (gerar resumos automáticos), você precisa inserir sua Chave de API do Gemini. 
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-accent hover:underline ml-1">
                    Crie uma gratuitamente aqui.
                  </a>
                </p>
                <input 
                  type="password"
                  placeholder="Cole sua API Key aqui..."
                  defaultValue={apiKey || ''}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-2 rounded-lg focus:outline-none focus:border-accent font-mono text-sm"
                />
                <button 
                  onClick={() => {
                    if (tempKey) setApiKey(tempKey);
                    setIsSettingsOpen(false);
                  }}
                  className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-bold hover:bg-accent/90"
                >
                  Salvar Chave
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/folder/:folderId" element={<FolderView />} />
            <Route path="/editor/:folderId" element={<Editor />} />
            <Route path="/editor/:folderId/:noteId" element={<Editor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
