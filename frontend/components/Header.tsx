"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-black/10 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between">
        {/* Left: Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-[0.2em] text-white transition-colors group-hover:text-naturals-purple">
            OMORFIA <span className="text-naturals-purple">|</span> NATURALS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-8">
            <Link href="/about" className="text-[10px] font-bold tracking-[0.4em] text-white/50 hover:text-white transition-colors uppercase">
              About
            </Link>
            <Link href="/contact" className="text-[10px] font-bold tracking-[0.4em] text-white/50 hover:text-white transition-colors uppercase">
              Contact
            </Link>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-bold tracking-[0.4em] text-white/50 hover:text-white transition-colors uppercase">
              Sign In
            </Link>
            <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-naturals-purple hover:text-white transition-all duration-300">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-midnight-purple/95 backdrop-blur-xl border-b border-white/10 p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            <Link href="/about" className="text-xs font-bold tracking-[0.4em] text-white/70 uppercase">
              About
            </Link>
            <Link href="/contact" className="text-xs font-bold tracking-[0.4em] text-white/70 uppercase">
              Contact
            </Link>
          </div>
          <div className="h-[1px] w-full bg-white/5" />
          <div className="flex flex-col gap-6">
            <Link href="/login" className="text-xs font-bold tracking-[0.4em] text-white/70 uppercase">
              Sign In
            </Link>
            <Link href="/register" className="text-xs font-bold tracking-[0.4em] text-naturals-orange uppercase">
              Create Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
