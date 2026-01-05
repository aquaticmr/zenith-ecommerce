"use client";
import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white pointer-events-none">
      {/* 1. Subtle Technical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* 2. Soft Moving Orbs (Auras) */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] opacity-60"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-50"
      />

      {/* 3. The "Grain" Overlay (This makes it feel like premium paper) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
      />

      {/* 4. Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
    </div>
  );
}