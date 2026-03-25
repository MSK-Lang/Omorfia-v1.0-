"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Sparkles, 
  Target,
  ArrowRight,
  Share2,
  Activity,
  Zap,
  Droplets,
  ShieldCheck,
  ChevronLeft,
  Scissors,
  ShoppingBag,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface HistoryEntry {
  id: string; // Unique ID to prevent duplicates (timestamp)
  date: string;
  total_score: number;
}

interface ActionableItem {
  concern: string;
  score: number;
  recommended_service: string;
  recommended_product: string;
}

interface AnalysisResult {
  status: string;
  customer: {
    full_name: string;
    phone: string;
  };
  analysis: {
    total_beauty_score: number;
    confidence_score: number;
    is_low_quality?: boolean;
    metrics: {
      skin: Record<string, number>;
      hair: Record<string, number>;
      lifestyle: Record<string, number>;
    };
    actionable_items: ActionableItem[];
    home_care_journey_30_day: string;
  };
}

const Accordion = ({ title, metrics }: { title: string, metrics: Record<string, number> }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-black">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-black px-6 py-5 text-white transition-colors hover:bg-white/5"
      >
        <span className="text-[11px] font-black tracking-[0.3em] uppercase">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 pt-2"
          >
            {Object.entries(metrics).map(([key, score]) => (
              <div key={key} className="mb-5 last:mb-0">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] font-black text-white">{score}%</span>
                </div>
                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full transition-all duration-1000 ${
                      score > 70 ? 'bg-naturals-purple' : 
                      score < 50 ? 'bg-naturals-orange shadow-[0_0_8px_rgba(232,97,26,0.5)]' : 
                      'bg-white/40'
                    }`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DashboardPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [scoreChange, setScoreChange] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("omorfia_analysis");
    if (data) {
      const parsedResult: AnalysisResult = JSON.parse(data);
      setResult(parsedResult);

      // --- History Tracking Logic ---
      const storedHistory = localStorage.getItem("omorfia_history");
      let historyArray: HistoryEntry[] = storedHistory ? JSON.parse(storedHistory) : [];
      
      // We use a unique ID for the current scan session from localStorage if available,
      // or just use a timestamp if it's the first time we're seeing this scan result.
      const scanId = localStorage.getItem("omorfia_scan_id") || Date.now().toString();
      
      const newEntry: HistoryEntry = {
        id: scanId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total_score: parsedResult.analysis.total_beauty_score
      };

      // Check if this specific scan is already in history
      const isDuplicate = historyArray.some(h => h.id === scanId);

      if (!isDuplicate) {
        // Calculate score change before pushing the new entry
        if (historyArray.length > 0) {
          const previousScore = historyArray[historyArray.length - 1].total_score;
          const change = ((newEntry.total_score - previousScore) / previousScore) * 100;
          setScoreChange(Number(change.toFixed(1)));
        }
        
        // Append and limit to last 10 entries
        historyArray = [...historyArray, newEntry].slice(-10);
        localStorage.setItem("omorfia_history", JSON.stringify(historyArray));
        // Ensure we save the scanId so refresh doesn't duplicate
        localStorage.setItem("omorfia_scan_id", scanId);
      } else {
        // If it is a duplicate (refresh), calculate change based on the entry BEFORE this one in history
        const currentIndex = historyArray.findIndex(h => h.id === scanId);
        if (currentIndex > 0) {
          const previousScore = historyArray[currentIndex - 1].total_score;
          const change = ((newEntry.total_score - previousScore) / previousScore) * 100;
          setScoreChange(Number(change.toFixed(1)));
        }
      }
      
      setHistory(historyArray);
    }
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-[#0F051D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-naturals-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Retrieving Beauty DNA...</p>
        </div>
      </main>
    );
  }

  const { customer, analysis } = result;
  const { total_beauty_score, metrics, actionable_items } = analysis;

  // Prepare data for Radar Chart
  const radarData = [
    ...Object.entries(metrics.skin).map(([key, value]) => ({ subject: key.replace(/_/g, ' ').toUpperCase(), value, fullMark: 100, category: 'SKIN' })),
    ...Object.entries(metrics.hair).map(([key, value]) => ({ subject: key.replace(/_/g, ' ').toUpperCase(), value, fullMark: 100, category: 'HAIR' })),
    ...Object.entries(metrics.lifestyle).map(([key, value]) => ({ subject: key.replace(/_/g, ' ').toUpperCase(), value, fullMark: 100, category: 'LIFESTYLE' })),
  ];

  return (
    <main className="relative min-h-screen w-full bg-[#0F051D] pb-32 overflow-x-hidden font-sans">
      <Header />
      
      {/* 1. Hero Summary Section */}
      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center flex-wrap gap-4 mb-6"
            >
              <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">
                Analysis Complete
              </span>
              <span className="text-white/20 text-[10px] font-medium tracking-widest uppercase">
                ID: {customer.phone.slice(-4)}XXXX
              </span>
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-naturals-purple/10 border border-naturals-purple/20">
                <ShieldCheck size={10} className="text-naturals-purple" />
                <span className="text-naturals-purple text-[10px] font-black tracking-widest uppercase">
                  AI Confidence: {analysis.confidence_score}%
                </span>
              </div>
              {analysis.is_low_quality && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-4 py-1 rounded-full bg-naturals-orange/10 border border-naturals-orange/20 flex items-center gap-2"
                >
                  <Activity size={10} className="text-naturals-orange" />
                  <span className="text-naturals-orange text-[10px] font-black tracking-widest uppercase">
                    Low Quality Sensor Alert: AI Enhanced Analysis
                  </span>
                </motion.div>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight uppercase"
            >
              Consultation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">
                Summary.
              </span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* 2. Hero Score Section - Massive Circular Gauge */}
      <section className="relative py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center"
        >
          {/* Static Deep Background Orb */}
          <div className="absolute inset-0 bg-naturals-orange/5 rounded-full blur-[120px]" />
          
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#E8611A"
              strokeWidth="4"
              strokeDasharray="100 100"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - total_beauty_score }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12px] md:text-[14px] font-black tracking-[0.6em] text-white/40 uppercase mb-4"
            >
              Diagnostic Score
            </motion.span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-baseline"
            >
              <span className="text-8xl md:text-[160px] font-serif text-white leading-none tracking-tighter">
                {Math.round(total_beauty_score)}
              </span>
              <span className="text-2xl md:text-4xl font-light text-white/20 ml-2">/100</span>
              
              {/* Score Change Badge */}
              {scoreChange !== null && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`ml-6 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 ${
                    scoreChange >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-naturals-orange/10 text-naturals-orange'
                  }`}
                >
                  {scoreChange >= 0 ? `+${scoreChange}%` : `${scoreChange}%`} 
                  <span className="opacity-50 lowercase italic">from last scan</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. Scientific Spider Chart & Deep Dive Section */}
      <section className="px-6 md:px-12 lg:px-24 mb-32">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase mb-4">Diagnostic Visualization</h2>
          <h3 className="text-3xl md:text-5xl font-serif text-white uppercase">15-Point Neural Analysis</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          {/* Left: Radar Chart (Summary) */}
          <div className="h-[500px] md:h-[600px] w-full prestige-glass p-8 md:p-12 flex flex-col items-center justify-center overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5B2D8E" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#E8611A" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 900, letterSpacing: '0.1em' }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff', fontWeight: 900 }}
                  cursor={{ stroke: '#5B2D8E', strokeWidth: 1 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#5B2D8E"
                  strokeWidth={2}
                  fill="url(#radarGradient)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Deep Dive Accordions */}
          <div className="flex flex-col gap-4">
            <div className="mb-6">
              <h4 className="text-[11px] font-black tracking-[0.4em] text-white/20 uppercase mb-2">Detailed Breakdown</h4>
              <p className="text-white/60 text-sm italic">Click to expand metrics</p>
            </div>
            <Accordion title="Skin Intelligence" metrics={metrics.skin} />
            <Accordion title="Hair Analysis" metrics={metrics.hair} />
            <Accordion title="Lifestyle Factors" metrics={metrics.lifestyle} />
          </div>
        </div>

        {/* --- Diagnostic Trend (Line Chart) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full prestige-glass p-8 md:p-12"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] text-naturals-orange uppercase mb-2">Historical Insights</span>
              <h4 className="text-2xl md:text-3xl font-serif text-white uppercase italic">Diagnostic Trend - Last 30 Days</h4>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-naturals-orange animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live DNA Tracking</span>
            </div>
          </div>

          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff', fontWeight: 900 }}
                  cursor={{ stroke: '#E8611A', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_score" 
                  stroke="#E8611A" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#E8611A', strokeWidth: 2, stroke: '#0F051D' }} 
                  activeDot={{ r: 6, fill: '#fff', stroke: '#E8611A', strokeWidth: 2 }}
                  filter="url(#glow)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 4. The Prescription Cards - Recommended Treatment Plan */}
      <section className="px-6 md:px-12 lg:px-24 mb-32">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-[1px] flex-grow bg-white/10" />
          <h2 className="text-[10px] font-black tracking-[0.5em] text-white/60 uppercase whitespace-nowrap">
            Recommended Treatment Plan
          </h2>
          <div className="h-[1px] flex-grow bg-white/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="prestige-glass p-10 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Scissors size={120} className="text-naturals-purple" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-black text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-widest uppercase">Pro Services</h4>
                  <p className="text-[10px] text-white/40 font-medium">Expert Salon Interventions</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {actionable_items?.map((item: any, idx: number) => (
                  <Link
                    href={`/book?service=${encodeURIComponent(item.recommended_service)}&concern=${encodeURIComponent(item.concern)}`}
                    key={idx}
                    className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 hover:bg-white/5 transition-colors p-2 rounded-lg group"
                  >
                    <div className="flex flex-col">
                      <span className="text-white font-medium group-hover:text-naturals-orange transition-colors">
                        {item.recommended_service}
                      </span>
                      <span className="text-white/50 text-xs italic">For: {item.concern}</span>
                    </div>
                    <div className="text-naturals-orange">→</div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Products Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="prestige-glass p-10 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag size={120} className="text-naturals-orange" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-white text-black">
                  <Droplets size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-widest uppercase">Curated Care</h4>
                  <p className="text-[10px] text-white/40 font-medium">Precision Home Formulations</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {actionable_items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                    <div>
                      <span className="text-[9px] font-black text-naturals-purple tracking-widest uppercase block mb-1">
                        Daily Defense
                      </span>
                      <span className="text-xl font-bold text-white tracking-tight">{item.recommended_product}</span>
                    </div>
                    <ArrowRight size={20} className="text-white/20 group-hover:text-naturals-orange transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
