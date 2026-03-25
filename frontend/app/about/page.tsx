"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Target,
  FlaskConical,
  Database
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#0F051D] overflow-x-hidden font-sans pb-32">
      <Header />
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [-50, 50, -50],
            y: [-50, 50, -50]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-naturals-purple/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            x: [50, -50, 50],
            y: [50, -50, 50]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-naturals-orange/20 rounded-full blur-[100px]"
        />
      </div>

      {/* 1. Hero Section */}
      <section className="relative pt-48 pb-24 px-6 md:px-12 lg:px-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-naturals-purple text-[10px] font-black tracking-[0.4em] uppercase mb-8">
            Our Foundation
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight uppercase mb-12">
            The Science of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">
              Precision Beauty.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-2xl mx-auto italic">
            "Omorfia was built to standardize beauty diagnostics. By merging Computer Vision with Naturals Salon’s decades of expertise, we’ve created a data-driven path to skin and hair health."
          </p>
        </motion.div>
      </section>

      {/* 2. Tech Pillars Grid */}
      <section className="relative px-6 md:px-12 lg:px-24 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Computer Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="prestige-glass p-12 group hover:border-naturals-purple/40 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} className="text-naturals-purple" />
            </div>
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6">Computer Vision</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-8">
              Utilizing <span className="text-white">CLAHE</span> (Contrast Limited Adaptive Histogram Equalization) to normalize low-light laptop sensor data, and <span className="text-white">Laplacian Variance</span> for pixel-perfect texture and blur analysis.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-naturals-purple uppercase">
              Clinical Heuristics <ArrowRight size={12} />
            </div>
          </motion.div>

          {/* Pillar 2: Diagnostic Heuristics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prestige-glass p-12 group hover:border-naturals-orange/40 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FlaskConical size={32} className="text-black" />
            </div>
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6">Diagnostic Heuristics</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-8">
              A complex <span className="text-white">15-point diagnostic engine</span> that maps real-time physiological markers to Naturals&apos; specialized professional treatments and high-performance products.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-naturals-orange uppercase">
              Mapping DNA <ArrowRight size={12} />
            </div>
          </motion.div>

          {/* Pillar 3: Data Continuity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="prestige-glass p-12 group hover:border-white/40 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Database size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6">Data Continuity</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-8">
              Your personalized <span className="text-white">Beauty Passport</span> enables longitudinal trend tracking, allowing you to visualize skin and hair evolution across your entire salon journey.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white uppercase opacity-40 group-hover:opacity-100 transition-opacity">
              Evolution Tracking <ArrowRight size={12} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="relative py-32 px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-2xl"
        >
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-naturals-purple mb-12" />
          <h2 className="text-4xl md:text-5xl font-serif text-white uppercase mb-8">Ready to Decode Your Beauty DNA?</h2>
          <Link 
            href="/"
            className="group relative px-12 py-6 bg-white text-black rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-sm font-black tracking-[0.4em] uppercase">Experience the Analysis</span>
            <div className="absolute inset-0 bg-naturals-purple translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-black tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              Start Your Scan
            </span>
          </Link>
        </motion.div>
      </section>

      {/* Styles (matching the prestige system) */}
      <style jsx global>{`
        .prestige-glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
        }
      `}</style>
    </main>
  );
}
