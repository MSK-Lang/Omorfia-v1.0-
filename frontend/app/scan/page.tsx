"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentMetric, setCurrentMetric] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const logs = [
    "Calibrating...",
    "Detecting Surface Texture...",
    "Scanning 15 Concern Points...",
    "Mapping Skin Topology...",
    "Analyzing Pore Density...",
    "Measuring Hydration Levels...",
    "Evaluating Scalp Health...",
    "Finalizing Beauty DNA...",
  ];

  const metrics = [
    "Pore Density", "Wrinkle Severity", "Dark Spots", "Eye Circles", "Skin Tone",
    "Scalp Health", "Hair Texture", "Frizz Index", "Hair Density", "Split Ends",
    "Skin Age", "UV Damage", "Hydration", "Sebum", "Barrier Health"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      let i = 0;
      interval = setInterval(() => {
        if (i < logs.length) {
          setDiagnosticLogs(prev => [...prev.slice(-4), logs[i]]);
          i++;
        }
      }, 800);
      
      // Progress & Metric cycling
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          const next = prev + 1;
          // Change metric every ~7%
          const metricIndex = Math.floor((next / 100) * metrics.length);
          if (metrics[metricIndex]) setCurrentMetric(metrics[metricIndex]);
          return next;
        });
      }, 50);

      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    }
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert("Failed to capture image. Please check camera permissions.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setDiagnosticLogs(["Initializing AI Scanner..."]);

    try {
      // 3. Prepare Base64 Data for Pydantic Model
      const payload = {
        image: imageSrc,
        phone: "Guest-User",
        full_name: "Omorfia Guest"
      };

      // 4. Send to Backend
      const response = await fetch("process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Analysis failed");
      }
      
      const data = await response.json();
      
      // Check for low quality flag
      if (data.analysis?.is_low_quality) {
        setDiagnosticLogs(prev => [...prev, "Low light sensor detected. Applying AI correction..."]);
      }
      
      // Create a unique ID for this scan session to prevent duplicates on refresh in the dashboard
      const scanId = Date.now().toString();
      localStorage.setItem("omorfia_scan_id", scanId);
      
      // Save entire JSON (scores + recommendations) to localStorage
      localStorage.setItem("omorfia_analysis", JSON.stringify(data));
      
      // Artificial delay to let the beautiful "Mapping" animation play out
      setTimeout(() => {
        router.push("/dashboard");
      }, 5500);

    } catch (error: any) {
      console.error("Error during analysis:", error);
      setErrorMessage(error.message);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setDiagnosticLogs(prev => [...prev, `Diagnostic Alert: ${error.message}`]);
    }
  };

  return (
    <main className="relative h-screen w-full bg-black overflow-hidden flex flex-col font-sans">
      {/* 1. Viewfinder / Processing Background */}
      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div 
            key="webcam"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover grayscale-[0.2]"
              videoConstraints={{
                facingMode: "user",
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        ) : (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-0 bg-[#0F051D] flex items-center justify-center"
          >
            {/* Animated Deep Purple/Orange Orbs for Processing */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [-20, 20, -20]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-naturals-purple/30 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
                x: [20, -20, 20]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-naturals-orange/20 rounded-full blur-[100px]"
            />
            
            {/* DNA Mapping Animation */}
            <div className="relative z-10 flex flex-col items-center gap-12">
              <div className="relative w-64 h-64">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 1, 0.2]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.15,
                      ease: "easeInOut" 
                    }}
                    className="absolute inset-0 border-t border-naturals-purple/40 rounded-full"
                    style={{ transform: `rotate(${i * 18}deg)` }}
                  />
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles size={48} className="text-white/80" />
                  </motion.div>
                  <span className="mt-4 text-[10px] font-black tracking-[0.5em] text-white/40 uppercase italic">
                    Mapping DNA
                  </span>
                </div>
              </div>

              {/* Progress HUD */}
              <div className="w-80 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-naturals-purple uppercase">Analyzing</span>
                    <span className="text-xl font-serif text-white">{currentMetric}</span>
                  </div>
                  <span className="text-2xl font-black text-white/20">{analysisProgress}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    className="h-full bg-gradient-to-r from-naturals-purple via-white to-naturals-orange"
                  />
                </div>
                
                <p className="text-[9px] font-medium text-white/30 tracking-widest uppercase text-center">
                  Matching your profile with Naturals&apos; specialized treatments...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Flash Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-white"
          />
        )}
      </AnimatePresence>

      {/* Error Toast Overlay */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-6"
          >
            <div className="bg-black/80 backdrop-blur-xl border border-naturals-orange/50 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(232,97,26,0.2)]">
              <div className="w-10 h-10 rounded-full bg-naturals-orange/20 flex items-center justify-center shrink-0">
                <Activity size={20} className="text-naturals-orange" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black tracking-widest text-naturals-orange uppercase mb-1">Diagnostic Alert</p>
                <p className="text-white text-xs font-medium leading-relaxed">{errorMessage}. Please adjust and retry.</p>
              </div>
              <button 
                onClick={() => setErrorMessage(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={16} className="text-white/40" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HUD - Top Left Close */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="group flex items-center gap-3 text-white/60 hover:text-white transition-all duration-300">
          <div className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:border-white/30">
            <X size={20} />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Exit Suite</span>
        </Link>
      </div>

      {/* 4. Augmentation Overlay (Target Zone) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          
          {/* Target Circle */}
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-2 rounded-full border border-white/5" />
          
          {/* Corner Brackets */}
          {[
            "top-0 left-0 border-t-2 border-l-2",
            "top-0 right-0 border-t-2 border-r-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2"
          ].map((pos, idx) => (
            <motion.div 
              key={idx}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
              className={`absolute w-12 h-12 border-white/40 ${pos}`}
            />
          ))}

          {/* Laser Scan Line */}
          <motion.div 
            animate={{ 
              top: ["10%", "90%", "10%"],
              opacity: [0.3, 1, 1, 1, 0.3] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-white/40 z-20"
          />

          {/* AI Focus Points (Visual Flair) */}
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute w-1 h-1 rounded-full bg-white/20 border border-white/40"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. HUD - Bottom Right Logs */}
      <div className="absolute bottom-12 right-12 z-40 hidden md:block w-72">
        <div className="prestige-glass p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-naturals-purple animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">System Diagnostics</span>
          </div>
          <div className="h-32 flex flex-col justify-end gap-2">
            <AnimatePresence mode="popLayout">
              {diagnosticLogs.map((log, idx) => (
                <motion.div
                  key={log + idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-[11px] font-medium text-white/70 flex items-center gap-2"
                >
                  <span className="text-naturals-purple opacity-40">❯</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 6. The Trigger - Bottom Center */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-full px-8 flex flex-col items-center gap-6">
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Loader2 className="w-4 h-4 text-naturals-purple animate-spin" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white/60 uppercase italic">
                Analyzing Beauty DNA...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`
            group relative px-12 py-5 rounded-full overflow-hidden transition-all duration-500 border border-white/10
            ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95'}
          `}
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl group-hover:bg-white/10 transition-colors" />
          
          {/* Inner Text */}
          <span className="relative z-10 text-sm font-black tracking-[0.4em] text-white uppercase flex items-center gap-3">
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-white/40" />
                Start Scan
              </>
            )}
          </span>
        </button>
        
        <p className="text-[10px] font-medium text-white/30 tracking-widest uppercase text-center max-w-[280px]">
          Position your face within the target zone for optimal precision.
        </p>
      </div>

      <style jsx global>{`
        .prestige-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
      `}</style>
    </main>
  );
}
