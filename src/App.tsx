/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Monitor, Zap, LayoutGrid } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-black selection:bg-neon-cyan">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6"
      >
        <div className="flex flex-col gap-1 items-center md:items-start">
          <div className="flex items-center gap-2 text-neon-cyan animate-pulse">
            <Zap className="w-5 h-5 fill-current" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Neural Interface v2.04</span>
          </div>
          <div className="glitch-wrapper">
            <h1 
              data-text="NEONSNAKE & BEATS"
              className="glitch font-digital text-6xl md:text-8xl font-bold tracking-tighter"
            >
              <span className="text-white">NEON</span>
              <span className="text-neon-magenta">SNAKE</span>
              <span className="text-white/20 ml-2">&</span>
              <span className="ml-2 font-light text-white">BEATS</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex gap-8">
          <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">System Status</span>
             <span className="text-sm font-bold text-neon-lime">OPERATIONAL</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Connection</span>
             <span className="text-sm font-bold text-neon-cyan">ENCRYPTED</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center max-w-7xl w-full">
        {/* Left Side Info / Decor */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden xl:flex flex-col gap-6 w-48 mt-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/40">
              <Monitor className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Display: OLED</span>
            </div>
            <div className="flex items-center gap-3 text-white/40">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Mode: Classic</span>
            </div>
          </div>
          
          <div className="h-40 w-px bg-gradient-to-b from-neon-cyan to-transparent ml-2 opacity-30" />
          
          <div className="text-[10px] text-white/20 font-mono rotate-90 origin-left translate-x-3 translate-y-12 whitespace-nowrap tracking-widest uppercase">
            Protocol: Synth-Ethernet-09
          </div>
        </motion.div>

        {/* Center: Snake Game */}
        <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="z-10 w-full md:w-auto"
        >
          <SnakeGame />
        </motion.div>

        {/* Right: Music Player */}
        <motion.div
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="z-10 w-full md:w-auto flex justify-center"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer / Decorative Rail */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="mt-20 flex flex-col items-center gap-4 py-8 border-t border-white/5 w-full max-w-4xl"
      >
        <div className="flex gap-12 text-[10px] font-mono tracking-[0.4em] uppercase text-center flex-wrap justify-center">
          <span>Vector.OS</span>
          <span>Buffer: 1024kb</span>
          <span>Async_Render</span>
        </div>
        <p className="text-[8px] text-white/20 font-mono">
          &copy; 2026 DIGITAL_VOID_RECORDS // ALL RIGHTS RESERVED
        </p>
      </motion.footer>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-magenta/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-neon-lime/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
