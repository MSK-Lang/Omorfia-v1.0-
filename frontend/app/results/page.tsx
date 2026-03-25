"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Target,
  ArrowRight,
  Share2
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

interface AnalysisResult {
  status: string;
  customer: {
    full_name: string;
    phone: string;
  };
  analysis: {
    total_beauty_score: number;
    metrics: {
      skin: Record<string, number>;
      hair: Record<string, number>;
      lifestyle: Record<string, number>;
    };
    home_care_journey_30_day: string;
  };
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("omorfia_analysis");
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-prestige-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-naturals-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Retrieving Beauty DNA...</p>
        </div>
      </main>
    );
  }

  const { customer, analysis } = result;
  const { total_beauty_score, metrics, home_care_journey_30_day } = analysis;

  // Flatten metrics for the grid display
  const allMetrics = {
    ...metrics.skin,
    ...metrics.hair,
    ...metrics.lifestyle
  };
    <main className="relative min-h-screen w-full bg-prestige-gradient pb-20 overflow-x-hidden">
      <Header />
      
      {/* 1. Hero Summary */}
      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="px-4 py-1 rounded-full bg-naturals-purple/20 border border-naturals-purple/30 text-naturals-purple text-[10px] font-black tracking-[0.2em] uppercase">
                Analysis Complete
              </span>
              <span className="text-white/20 text-[10px] font-medium tracking-widest uppercase">
                ID: {customer.phone.slice(-4)}XXXX
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight"
            >
              Your Beauty <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-naturals-purple to-naturals-orange">
                Passport.
              </span>
            </motion.h1>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
            >
              {/* Score Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - total_beauty_score }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5B2D8E" />
                    <stop offset="100%" stopColor="#E8611A" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  {Math.round(total_beauty_score)}
                </span>
                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                  Beauty Index
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. 15-Point Diagnostic Grid */}
      <section className="px-6 md:px-12 lg:px-24 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black tracking-[0.4em] text-white/60 uppercase flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/20" />
            15-Point AI Diagnostic
          </h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-naturals-purple" />
            <div className="w-2 h-2 rounded-full bg-naturals-orange" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(allMetrics).map(([key, score], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="prestige-glass p-6 group hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-naturals-purple transition-colors">
                  {key.replace(/_/g, " ")}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-black text-white">{score}</span>
                <span className="text-[10px] font-bold text-white/20 mb-1">/100</span>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-[2px] w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.05 + 0.5 }}
                  className="h-full bg-gradient-to-r from-naturals-purple to-naturals-orange"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Claude's 30-Day Journey */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Journey Content */}
          <div className="lg:col-span-7">
            <div className="prestige-glass p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={120} className="text-naturals-purple" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-serif text-white mb-8">
                  Your 30-Day <br />
                  <span className="italic text-naturals-orange">Home-Care Journey.</span>
                </h3>
                
                <div className="prose prose-invert max-w-none prose-sm md:prose-base text-white/70 leading-relaxed whitespace-pre-wrap">
                  {home_care_journey_30_day}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions & High-End visual */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* CTA Card */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] flex flex-col gap-8 shadow-[0_20px_50px_rgba(91,45,142,0.3)]">
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-black tracking-tight">Lock In Your Glow.</h4>
                <p className="text-black/60 text-sm font-medium leading-relaxed">
                  Download your encrypted Beauty Passport and present it at any Naturals Salon for a 15% discount on your first recommended treatment.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button className="w-full py-5 bg-black text-white rounded-full font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-naturals-purple transition-colors duration-500">
                  <Download size={18} />
                  Export Passport
                </button>
                <button className="w-full py-5 border border-black/10 text-black rounded-full font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-black/5 transition-colors duration-500">
                  <Share2 size={18} />
                  Share Profile
                </button>
              </div>
            </div>

            {/* Salon Locator / Next Step */}
            <div className="prestige-glass p-8 flex items-center justify-between group cursor-pointer">
              <div>
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase block mb-1">Nearest Pro Station</span>
                <span className="text-white font-bold">Naturals Signature, Chennai</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Footer Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10">
        <Link href="/scan" className="p-4 rounded-full bg-white text-black hover:scale-110 transition-transform">
          <Target size={20} />
        </Link>
        <button className="px-6 py-4 text-[10px] font-black tracking-widest text-white uppercase hover:text-naturals-purple transition-colors">
          About AI
        </button>
        <button className="px-6 py-4 text-[10px] font-black tracking-widest text-white uppercase hover:text-naturals-purple transition-colors">
          Ingredients
        </button>
      </div>
    </main>
  );
}
