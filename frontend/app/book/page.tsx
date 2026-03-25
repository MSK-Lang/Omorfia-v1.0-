"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  MapPin,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function BookingContent() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "Deep Cleansing Facial";
  const concern = searchParams.get("concern") || "Skin Optimization";

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(0);
  const [isBooked, setIsBooked] = useState(false);

  const dates = [
    { day: "WED", date: "25" },
    { day: "THU", date: "26" },
    { day: "FRI", date: "27" },
    { day: "SAT", date: "28" },
    { day: "SUN", date: "29" },
    { day: "MON", date: "30" },
  ];

  const times = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

  const experts = [
    { name: "Priya S.", role: "Skin Specialist", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { name: "Anita K.", role: "Hair Expert", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita" },
    { name: "Rahul M.", role: "Dermal Pro", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  ];

  const handleBooking = () => {
    if (!selectedTime) return;
    setIsBooked(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0F051D] pb-20 overflow-x-hidden font-sans">
      <Header />

      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black tracking-widest uppercase">Back to Summary</span>
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 uppercase">
            Schedule <br />
            <span className="text-white/40 italic">Your Appointment.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Selection */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Selected Service Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="prestige-glass p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={80} className="text-naturals-purple" />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-black tracking-widest text-naturals-orange uppercase block mb-2">
                  Recommended for {concern}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{service}</h2>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold tracking-widest uppercase">
                  <span className="flex items-center gap-2"><Clock size={14} /> 60 Minutes</span>
                  <span className="flex items-center gap-2"><MapPin size={14} /> Naturals Signature</span>
                </div>
              </div>
            </motion.div>

            {/* Scheduler: Dates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-[11px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-4">
                <Calendar size={14} /> Select Date
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(idx)}
                    className={`
                      flex-shrink-0 w-20 py-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2
                      ${selectedDate === idx 
                        ? 'bg-naturals-purple border-naturals-purple shadow-[0_0_20px_rgba(91,45,142,0.4)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'}
                    `}
                  >
                    <span className={`text-[10px] font-black tracking-widest ${selectedDate === idx ? 'text-white' : 'text-white/40'}`}>
                      {d.day}
                    </span>
                    <span className="text-2xl font-bold text-white">{d.date}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Scheduler: Time Slots */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-[11px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-4">
                <Clock size={14} /> Preferred Time
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {times.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(t)}
                    className={`
                      py-4 rounded-xl border text-[12px] font-black tracking-widest transition-all duration-300
                      ${selectedTime === t 
                        ? 'bg-naturals-orange border-naturals-orange text-white shadow-[0_0_20px_rgba(232,97,26,0.4)]' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Expert & Confirmation */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Expert Selection */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-[11px] font-black tracking-[0.4em] text-white/20 uppercase mb-6 flex items-center gap-4">
                <User size={14} /> Choose Your Expert
              </h3>
              <div className="space-y-4">
                {experts.map((exp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedExpert(idx)}
                    className={`
                      w-full p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4
                      ${selectedExpert === idx 
                        ? 'bg-white/10 border-naturals-purple shadow-[inset_0_0_20px_rgba(91,45,142,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'}
                    `}
                  >
                    <img src={exp.img} alt={exp.name} className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="text-left">
                      <p className="text-white font-bold tracking-tight">{exp.name}</p>
                      <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{exp.role}</p>
                    </div>
                    {selectedExpert === idx && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-naturals-purple flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Final Confirmation Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-12"
            >
              <button
                onClick={handleBooking}
                disabled={!selectedTime}
                className={`
                  w-full py-6 rounded-full font-black tracking-[0.3em] uppercase text-sm transition-all duration-500
                  ${selectedTime 
                    ? 'bg-white text-black hover:bg-white/90 shadow-xl border border-white/10' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'}
                `}
              >
                Confirm Booking
              </button>
              <div className="mt-6 flex items-center justify-center gap-3 opacity-20">
                <ShieldCheck size={14} className="text-white" />
                <span className="text-[9px] font-black tracking-widest text-white uppercase">Secure Concierge Booking</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Overlay */}
      <AnimatePresence>
        {isBooked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full prestige-glass p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-serif text-white mb-4 uppercase">Booking <br />Confirmed.</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Your appointment for <span className="text-white font-bold">{service}</span> with <span className="text-white font-bold">{experts[selectedExpert].name}</span> is scheduled for {dates[selectedDate].day}, {dates[selectedDate].date} at {selectedTime}.
              </p>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Location</p>
                <p className="text-white font-bold">Naturals Signature Salon, Chennai</p>
              </div>
              <Link 
                href="/"
                className="inline-flex items-center gap-3 text-naturals-orange font-black tracking-widest uppercase text-[10px] hover:gap-5 transition-all"
              >
                Back to Home <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0F051D] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-naturals-purple border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <BookingContent />
    </Suspense>
  );
}
