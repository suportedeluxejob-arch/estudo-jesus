import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'

interface Connection {
  folderId: string
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number // 0 to 1
}

export function DynamicConnections() {
  const folders = useStore(state => state.folders)
  const notes = useStore(state => state.notes)
  const [connections, setConnections] = useState<Connection[]>([])

  useEffect(() => {
    const updateConnections = () => {
      const containerEl = document.getElementById('home-page-container')
      const brainEl = document.getElementById('neural-brain-heart')
      if (!containerEl || !brainEl) return

      const containerRect = containerEl.getBoundingClientRect()
      const brainRect = brainEl.getBoundingClientRect()
      
      // Exact center of the glassmorphic brain orb relative to the parent container
      const endX = (brainRect.left - containerRect.left) + brainRect.width / 2
      const endY = (brainRect.top - containerRect.top) + brainRect.height / 2

      const newConnections: Connection[] = []

      folders.forEach(folder => {
        const folderEl = document.getElementById(`folder-${folder.id}`)
        if (!folderEl) return

        const folderRect = folderEl.getBoundingClientRect()
        // Originates directly from inside the physical folder graphic relative to the parent container
        const startX = (folderRect.left - containerRect.left) + folderRect.width / 2
        const startY = (folderRect.top - containerRect.top) + 110

        const folderNotesCount = notes.filter(n => n.folderId === folder.id).length
        const goal = folder.goal || 21
        const progress = Math.min(1, folderNotesCount / goal)

        newConnections.push({
          folderId: folder.id,
          startX,
          startY,
          endX,
          endY,
          progress
        })
      })

      setConnections(newConnections)
    }

    // Initial measurement
    // A small timeout ensures the DOM has fully laid out before measuring
    const timeout = setTimeout(updateConnections, 100)
    
    window.addEventListener('resize', updateConnections)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', updateConnections)
    }
  }, [folders, notes]) // Recalculate if folders or notes change

  // Calculate an SVG path curve from start to end (vertical S-curve for clean mind-map connections)
  const generatePath = (startX: number, startY: number, endX: number, endY: number) => {
    const diffY = Math.abs(endY - startY)
    const controlOffsetY = diffY * 0.5
    return `M ${startX} ${startY} C ${startX} ${startY - controlOffsetY}, ${endX} ${endY + controlOffsetY}, ${endX} ${endY}`
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="dynamicLineGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
          </linearGradient>
          <filter id="glow-dynamic">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn) => {
          // Calculate visual metrics based on progress
          const numLines = Math.max(1, Math.ceil(conn.progress * 4))
          const baseStrokeWidth = 2 + conn.progress * 2.5 // slightly thicker
          const glowOpacity = 0.45 + conn.progress * 0.55 // much brighter
          
          // Fast pulse duration: faster as progress increases
          const flowDuration = Math.max(1.0, 3.0 - conn.progress * 2.0)

          const lines = []
          for (let i = 0; i < numLines; i++) {
            // Slight horizontal offset for multiple lines when progress is high
            const offsetX = (i - (numLines - 1) / 2) * 10
            const pathDCustom = generatePath(conn.startX + offsetX, conn.startY, conn.endX, conn.endY)
            
            lines.push(
              <g key={`${conn.folderId}-line-${i}`}>
                {/* 1. Faint baseline connection (always highly visible, solid) */}
                <path 
                  d={pathDCustom} 
                  fill="none" 
                  stroke="var(--color-accent)" 
                  strokeWidth={baseStrokeWidth} 
                  opacity={0.28} 
                />
                
                {/* 2. Glow overlay */}
                <path 
                  d={pathDCustom} 
                  fill="none" 
                  stroke="var(--color-accent)" 
                  strokeWidth={baseStrokeWidth + 3} 
                  opacity={glowOpacity * 0.45}
                  filter="url(#glow-dynamic)"
                />

                {/* 3. Flowing stream of light (motion) */}
                <motion.path 
                  d={pathDCustom} 
                  fill="none" 
                  stroke="url(#dynamicLineGradient)" 
                  strokeWidth={baseStrokeWidth + 1} 
                  strokeDasharray="16 28"
                  animate={{ strokeDashoffset: [0, -44] }}
                  transition={{ 
                    duration: flowDuration + (i * 0.25), // slightly offset parallel lines
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  opacity={glowOpacity}
                  filter="url(#glow-dynamic)"
                />
              </g>
            )
          }

          return (
            <g key={conn.folderId}>
              {lines}
              
              {/* 4. Glowing Anchor node directly inside the folder card */}
              <circle 
                cx={conn.startX} 
                cy={conn.startY} 
                r={5 + conn.progress * 3} 
                fill="var(--color-accent)" 
                opacity={0.3}
              />
              <motion.circle 
                cx={conn.startX} 
                cy={conn.startY} 
                r={3 + conn.progress * 2} 
                fill="var(--color-accent)" 
                filter="url(#glow-dynamic)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle 
                cx={conn.startX} 
                cy={conn.startY} 
                r={1.5 + conn.progress * 1} 
                fill="white" 
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
