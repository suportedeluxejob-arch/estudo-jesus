import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useStore } from '../store'
import { AnimatedFolder } from '../components/AnimatedFolder'
import { NeuralBrain } from '../components/NeuralBrain'
import { DynamicConnections } from '../components/DynamicConnections'
import { motion } from 'framer-motion'

export function Home() {
  const navigate = useNavigate()
  const folders = useStore(state => state.folders)
  const notes = useStore(state => state.notes)
  const addFolder = useStore(state => state.addFolder)

  const handleCreateFolder = () => {
    const title = window.prompt("Nome do novo livro ou tema:")
    if (!title) return
    const goalStr = window.prompt(`Quantos capítulos ou estudos no total tem o livro "${title}"? (Ex: 21)`)
    const goal = parseInt(goalStr || '21') || 21
    addFolder(title, goal)
  }

  return (
    <div id="home-page-container" className="relative min-h-[calc(100vh-80px)]">
      {/* Background dynamic SVG connecting folders to the brain */}
      <DynamicConnections />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <NeuralBrain />

        <div className="mb-12 mt-8 text-center space-y-4 relative z-30">
        <h2 className="text-5xl font-extrabold tracking-tight">Meus Estudos</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Organize e guarde suas reflexões. Seu crescimento espiritual documentado para os próximos anos.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-12 items-center">
        {folders.map(folder => {
          const folderNotes = notes.filter(n => n.folderId === folder.id).map(n => ({
            id: n.id,
            title: n.title,
            image: ''
          }))

          return (
            <AnimatedFolder
              key={folder.id}
              folderId={folder.id}
              title={folder.title}
              projects={folderNotes}
              onFolderClick={() => navigate(`/folder/${folder.id}`)}
            />
          )
        })}
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateFolder}
          className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all w-[280px] h-[320px] group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-accent/20 flex items-center justify-center mb-4 transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
          </div>
          <span className="font-semibold text-lg text-muted-foreground group-hover:text-foreground transition-colors">Novo Livro/Tema</span>
        </motion.button>
      </div>
      </motion.div>
    </div>
  )
}
