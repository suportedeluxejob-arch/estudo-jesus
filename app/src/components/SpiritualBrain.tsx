import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'
import { useStore } from '../store'

export function SpiritualBrain() {
  const spiritualXP = useStore(state => state.spiritualXP)
  const level = useStore(state => state.level)
  const [prevXP, setPrevXP] = useState(spiritualXP)
  const controls = useAnimation()

  const progress = (spiritualXP % 100)

  useEffect(() => {
    if (spiritualXP > prevXP) {
      // XP gained! Animate a pulse and energy line
      controls.start({
        scale: [1, 1.15, 1],
        filter: [
          'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
          'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))',
          'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))'
        ],
        transition: { duration: 1.5, ease: "easeInOut" }
      })
      setPrevXP(spiritualXP)
    }
  }, [spiritualXP, prevXP, controls])

  return (
    <div className="flex flex-col items-center justify-center py-12 relative w-full mb-12">
      
      {/* Background glowing orb */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-80 h-80 bg-accent/30 rounded-full blur-[80px] -z-10"
      />

      {/* Energy lines feeding the brain */}
      <div className="absolute bottom-0 w-full flex justify-center -z-10 opacity-50">
        <svg width="400" height="200" viewBox="0 0 400 200" className="overflow-visible">
          {/* Left line */}
          <path d="M 0 200 Q 150 200 200 50" fill="none" stroke="var(--color-border)" strokeWidth="2" />
          {/* Center line */}
          <path d="M 200 200 L 200 50" fill="none" stroke="var(--color-border)" strokeWidth="2" />
          {/* Right line */}
          <path d="M 400 200 Q 250 200 200 50" fill="none" stroke="var(--color-border)" strokeWidth="2" />

          {/* Animated pulses along the paths */}
          <motion.circle r="3" fill="var(--color-accent)"
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0 }}
            style={{ offsetPath: "path('M 0 200 Q 150 200 200 50')" }}
          />
          <motion.circle r="3" fill="var(--color-accent)"
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
            style={{ offsetPath: "path('M 200 200 L 200 50')" }}
          />
          <motion.circle r="3" fill="var(--color-accent)"
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: 0.5 }}
            style={{ offsetPath: "path('M 400 200 Q 250 200 200 50')" }}
          />
        </svg>
      </div>

      <div className="relative flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg width="220" height="220" className="absolute -rotate-90">
          <circle 
            cx="110" cy="110" r="100" 
            className="stroke-muted fill-none" 
            strokeWidth="4" 
          />
          <motion.circle 
            cx="110" cy="110" r="100" 
            className="stroke-accent fill-none" 
            strokeWidth="6" 
            strokeLinecap="round"
            initial={{ strokeDasharray: "628", strokeDashoffset: "628" }}
            animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Brain Icon inside */}
        <motion.div 
          animate={controls}
          className="w-40 h-40 rounded-full bg-card border-4 border-border/50 flex items-center justify-center shadow-2xl shadow-background z-10"
        >
          <BrainCircuit className="w-20 h-20 text-accent drop-shadow-lg" strokeWidth={1.5} />
        </motion.div>
      </div>

      <div className="mt-10 text-center space-y-1 z-10 bg-card/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-border shadow-xl">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Mente Treinada
        </h3>
        <p className="text-3xl font-bold font-mono text-foreground flex items-baseline justify-center gap-2">
          Lvl <span className="text-accent text-5xl">{level}</span>
        </p>
        <p className="text-sm text-muted-foreground font-medium pt-2">
          Progresso: <span className="text-foreground">{progress}%</span> para o próximo nível
        </p>
      </div>
    </div>
  )
}
