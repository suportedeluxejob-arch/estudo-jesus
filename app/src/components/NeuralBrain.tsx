import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Brain } from 'lucide-react'
import { useStore } from '../store'

export function NeuralBrain() {
  const spiritualXP = useStore(state => state.spiritualXP)
  const level = useStore(state => state.level)
  const [prevXP, setPrevXP] = useState(spiritualXP)
  const controls = useAnimation()

  const progress = (spiritualXP % 100)

  useEffect(() => {
    if (spiritualXP > prevXP) {
      // Trigger a glorious spiritual energy burst animation
      controls.start({
        scale: [1, 1.1, 0.98, 1.02, 1],
        filter: [
          'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))',
          'drop-shadow(0 0 35px rgba(168, 85, 247, 0.9))',
          'drop-shadow(0 0 15px rgba(168, 85, 247, 0.5))'
        ],
        transition: { duration: 1.2, ease: "easeInOut" }
      })
      setPrevXP(spiritualXP)
    }
  }, [spiritualXP, prevXP, controls])

  return (
    <div id="neural-brain-core" className="flex flex-col items-center justify-center py-12 relative w-full mb-10 select-none">
      
      {/* 1. Large, soft background glowing energy sphere */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.28, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-accent/20 rounded-full blur-[90px] -z-20 pointer-events-none"
      />

      <div className="relative flex items-center justify-center w-72 h-72">
        {/* 2. Outer Revolving Orbit Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[260px] h-[260px] border border-dashed border-accent/20 rounded-full flex items-center justify-center pointer-events-none"
        >
          {/* Orbital glowing satellite */}
          <div className="absolute top-0 w-2 h-2 rounded-full bg-accent/80 shadow-[0_0_8px_var(--color-accent)]" />
        </motion.div>

        {/* 3. Inner Revolving Orbit Ring (counter-rotating) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-[220px] h-[220px] border border-dashed border-accent/10 rounded-full flex items-center justify-center pointer-events-none"
        >
          {/* Second orbital satellite */}
          <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-accent/60 shadow-[0_0_6px_var(--color-accent)]" />
        </motion.div>

        {/* 4. Elegant Concentric Circular SVG Progress Rings */}
        <svg width="240" height="240" className="absolute -rotate-90 pointer-events-none">
          {/* Track ring */}
          <circle 
            cx="120" 
            cy="120" 
            r="105" 
            className="stroke-muted/30 fill-none" 
            strokeWidth="2.5" 
          />
          {/* Dynamic Progress ring */}
          <motion.circle 
            cx="120" 
            cy="120" 
            r="105" 
            className="stroke-accent fill-none drop-shadow-[0_0_6px_var(--color-accent)]" 
            strokeWidth="4" 
            strokeLinecap="round"
            initial={{ strokeDasharray: "659.7", strokeDashoffset: "659.7" }}
            animate={{ strokeDashoffset: 659.7 - (659.7 * progress) / 100 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* 5. Center Glassmorphic Breathing Brain Sphere */}
        <motion.div 
          id="neural-brain-heart"
          animate={controls}
          className="w-44 h-44 rounded-full bg-card/65 backdrop-blur-xl border border-border/80 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden group cursor-pointer"
          whileHover={{ 
            scale: 1.04, 
            borderColor: "rgba(168, 85, 247, 0.4)",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.15)"
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)"
          }}
        >
          {/* Brain breathing overlay */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center w-full h-full"
          >
            <Brain 
              className="w-20 h-20 text-accent drop-shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-colors duration-500 group-hover:text-accent/90" 
              strokeWidth={1.2} 
            />
          </motion.div>

          {/* Internal pulse flash */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </motion.div>
      </div>

      {/* 6. Premium typography for sync status and levels */}
      <div className="mt-6 text-center space-y-1.5 relative z-30">
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-[0.25em] opacity-90">
            Mente Conectada
          </h3>
        </div>
        
        <p className="text-4xl font-extrabold tracking-tight text-foreground flex items-baseline justify-center gap-1">
          NÍVEL <span className="text-accent text-5xl font-black drop-shadow-[0_0_10px_rgba(168,85,247,0.2)] ml-1">{level}</span>
        </p>
        
        <p className="text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1 rounded-full border border-border/40 inline-block">
          Sincronização Espiritual: <span className="text-foreground font-bold font-mono">{progress}%</span> para evoluir
        </p>
      </div>
    </div>
  )
}
