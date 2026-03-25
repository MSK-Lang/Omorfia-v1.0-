"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Camera, Activity, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import Header from "@/components/Header";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects for glowing orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main ref={containerRef} className="relative min-h-screen w-full flex flex-col bg-prestige-gradient overflow-hidden">
      {/* Sephora Black Top Strip */}
      <div className="h-1.5 w-full bg-black z-[110] shrink-0" />

      {/* Sephora-Style Header Component */}
      <Header />

      {/* Editorial Fluid Grid Hero - Pushed down to avoid header overlap */}
      <section className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-8 md:px-16 pt-32 lg:pt-0 pb-12 gap-12 relative z-10">
        
        {/* Parallax Glowing Orbs */}
        <motion.div 
          style={{ y: orb1Y }}
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-naturals-purple/20 rounded-full blur-[120px] pointer-events-none -z-10" 
        />
        <motion.div 
          style={{ y: orb2Y }}
          className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-naturals-orange/10 rounded-full blur-[150px] pointer-events-none -z-10" 
        />

        {/* Left Side: Massive High-Fashion Typography & CTA (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-12"
          >
            <Activity size={14} className="text-naturals-purple" />
            Next-Gen Beauty Intelligence
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-[7rem] font-serif font-bold tracking-tighter text-white mb-10 leading-[0.9] uppercase"
          >
            Precision <br />
            AI Skin & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 italic">
              Hair Analysis.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-16 max-w-xl"
          >
            Clinical-grade diagnostic suite powered by advanced computer vision. <br className="hidden md:block" />
            Professional insights tailored for precision results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              href="/scan" 
              className="group relative inline-flex items-center justify-center gap-6 bg-white text-black px-14 py-7 rounded-full font-black text-lg tracking-tight uppercase transition-all duration-300 hover:bg-white/90 active:scale-95"
            >
              Start Diagnostic Scan
              <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-2" />
              
              {/* Refined Border */}
              <div className="absolute -inset-[1px] rounded-full border border-white/10 -z-10" />
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Visual Accent (5 Columns) */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="prestige-glass w-full max-w-[480px] aspect-[4/5] p-10 flex flex-col relative group shadow-2xl"
          >
            {/* Scanner Preview Mockup */}
            <div className="flex-1 bg-black/60 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center group-hover:border-naturals-purple/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-naturals-purple/10 to-transparent animate-scan" />
              <Camera size={80} className="text-white/5 mb-6 group-hover:text-white/10 transition-colors" />
              <div className="text-white/10 text-xs font-bold tracking-[0.5em] uppercase">Ready for Scan</div>
              
              {/* Corner Accents */}
              <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
              <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-white/10 rounded-tr-xl" />
              <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />
              <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
            </div>

            <div className="mt-10 flex items-end justify-between">
              <div>
                <h3 className="text-white font-black text-2xl tracking-tight uppercase italic leading-none">AI Scanner</h3>
                <p className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase mt-3">Professional Grade</p>
              </div>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                <div className="w-8 h-8 rounded-full bg-naturals-purple animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Footer Ticker */}
      <footer className="w-full bg-black/60 border-t border-white/5 py-8 backdrop-blur-2xl z-50 shrink-0">
        <div className="flex whitespace-nowrap overflow-hidden items-center opacity-20">
          <div className="flex gap-20 animate-[marquee_30s_linear_infinite] items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                <Activity size={14} className="text-naturals-purple" />
                <span className="text-[10px] font-black tracking-[0.6em] text-white uppercase italic">15-Point AI Analysis Active</span>
                <ShieldCheck size={14} className="text-naturals-orange" />
                <span className="text-[10px] font-black tracking-[0.6em] text-white uppercase">Naturals Pro Certified</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
