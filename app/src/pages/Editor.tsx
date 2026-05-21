import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { ArrowLeft, Save, Terminal, Sparkles, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { generateBibleSummary } from '../lib/ai'

export function Editor() {
  const { folderId, noteId } = useParams()
  const navigate = useNavigate()
  
  const folder = useStore(state => state.folders.find(f => f.id === folderId))
  const existingNote = useStore(state => state.notes.find(n => n.id === noteId))
  const addNote = useStore(state => state.addNote)
  const updateNote = useStore(state => state.updateNote)
  const apiKey = useStore(state => state.apiKey)

  const [title, setTitle] = useState(existingNote?.title || '')
  const [content, setContent] = useState(existingNote?.content || '')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title)
      setContent(existingNote.content)
    }
  }, [existingNote])

  if (!folder) return <div>Pasta não encontrada</div>

  const handleSave = () => {
    if (!title.trim()) {
      alert("Por favor, dê um título para o estudo.")
      return
    }
    
    if (existingNote) {
      updateNote(existingNote.id, title, content)
    } else {
      addNote(folder.id, title, content)
    }
    navigate(`/folder/${folder.id}`)
  }

  const handleGenerateAI = async () => {
    if (!apiKey) {
      alert("Por favor, configure sua Chave de API do Gemini nas Configurações (ícone de engrenagem no topo superior direito) antes de usar a IA.")
      return
    }
    if (!title.trim()) {
      alert("Por favor, digite o nome do livro e capítulo no título (Ex: João 1) para a IA saber o que resumir.")
      return
    }

    setIsGenerating(true)
    try {
      const summary = await generateBibleSummary(apiKey, title)
      setContent(summary)
    } catch (error: any) {
      alert(error.message || "Ocorreu um erro ao gerar o resumo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/folder/${folder.id}`)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="bg-muted px-2 py-1 rounded-md">{folder.title}</span>
            <span>/</span>
            <span>{existingNote ? 'Editar .TXT' : 'Novo .TXT'}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors font-semibold border border-indigo-500/20 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Pensando...' : 'Resumo IA'}</span>
          </button>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold shadow-lg shadow-accent/20"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Arquivo</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-card border-2 border-border rounded-xl overflow-hidden shadow-2xl relative">
        {/* Editor TXT Header styling */}
        <div className="h-10 bg-muted border-b border-border flex items-center px-4 gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           <div className="ml-4 flex items-center gap-2 text-muted-foreground">
             <Terminal className="w-4 h-4" />
             <span className="font-mono text-xs font-medium">{title ? `${title}.txt` : 'novo_arquivo.txt'}</span>
           </div>
        </div>
        <input 
          type="text"
          placeholder="Nome do Arquivo (ex: Joao_1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-b border-border px-8 py-6 text-2xl font-mono font-bold focus:outline-none placeholder:text-muted-foreground/30 text-foreground"
        />
        <textarea 
          placeholder="Comece a escrever suas anotações aqui..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 bg-transparent px-8 py-6 text-lg font-mono leading-relaxed focus:outline-none resize-none placeholder:text-muted-foreground/30 text-foreground"
        />
      </div>
    </motion.div>
  )
}
