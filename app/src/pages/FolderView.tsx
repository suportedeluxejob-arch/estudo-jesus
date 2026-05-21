import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { FileText, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function FolderView() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  
  const folders = useStore(state => state.folders)
  const notesList = useStore(state => state.notes)
  const deleteNote = useStore(state => state.deleteNote)
  const deleteFolder = useStore(state => state.deleteFolder)

  const folder = folders?.find(f => f.id === folderId)
  const notes = notesList?.filter(n => n.folderId === folderId) || []

  if (!folder) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-[50vh]">
        <p className="text-xl text-muted-foreground mb-4">Pasta não encontrada ou excluída.</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-accent text-background rounded-lg font-medium">Voltar ao Início</button>
      </div>
    )
  }

  const handleDeleteFolder = () => {
    if (confirm("Tem certeza que deseja excluir esta pasta e TODAS as suas anotações?")) {
      deleteFolder(folder.id)
      navigate('/')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: folder.color }}></div>
              {folder.title}
            </h2>
            <span className="text-muted-foreground ml-9">{notes.length} estudos guardados</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDeleteFolder}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Excluir Pasta</span>
          </button>
          <button 
            onClick={() => navigate(`/editor/${folder.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Novo Arquivo .txt</span>
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/50">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Nenhum texto ainda</h3>
          <p className="text-muted-foreground mb-6">Comece criando sua primeira anotação sobre {folder.title}.</p>
          <button 
            onClick={() => navigate(`/editor/${folder.id}`)}
            className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Criar Primeiro Estudo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notes.map((note, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              key={note.id}
              onClick={() => navigate(`/editor/${folder.id}/${note.id}`)}
              className="group relative flex flex-col p-6 rounded-lg border-2 border-border bg-card hover:border-accent hover:shadow-2xl hover:shadow-accent/10 transition-all cursor-pointer h-[260px] overflow-hidden"
            >
              {/* Folded corner effect representing a TXT file */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-background border-l-2 border-b-2 border-border group-hover:border-accent transition-colors rounded-bl-lg"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 rounded bg-muted group-hover:bg-accent/10 transition-colors font-mono text-xs font-bold text-muted-foreground group-hover:text-accent">
                  .TXT
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm("Excluir esta anotação permanentemente?")) deleteNote(note.id)
                  }}
                  className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive rounded z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-3 font-mono line-clamp-2 group-hover:text-accent transition-colors">{note.title}</h3>
              
              <div className="flex-1 space-y-2 opacity-60">
                <p className="text-sm text-muted-foreground line-clamp-3 font-mono leading-relaxed whitespace-pre-line">
                  {note.content || "..."}
                </p>
              </div>

              <div className="mt-4 text-xs font-mono text-muted-foreground/60 border-t border-border pt-4">
                Modificado: {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
