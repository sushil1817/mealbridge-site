"use client";
import Link from "next/link";
import { UtensilsCrossed, Truck, ChevronRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    // Changed bg-gray-50 to min-h-screen (background is handled by layout now)
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-[#FF6B35] bg-orange-900/30 border border-orange-800/50 rounded-full">
          BRIDGING THE HUNGER GAP
        </span>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-8">
          Waste for some, <br/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF6B35] to-[#FF9F1C]">
            Food for many.
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Connect surplus food from restaurants directly to volunteers and shelters. 
          Instant, transparent, and completely free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link href="/donate">
            <button className="px-8 py-4 bg-[#FF6B35] text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,107,53,0.3)] flex items-center gap-2 hover:bg-orange-600 hover:scale-105 transition-all">
              <UtensilsCrossed size={20} /> Donate Food
            </button>
          </Link>
          
          <Link href="/volunteer">
            <button className="px-8 py-4 bg-slate-800 text-cyan-400 border border-slate-700 font-bold rounded-full flex items-center gap-2 hover:bg-slate-700 transition-all">
              <Truck size={20} /> Become a Carrier
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section - Dark Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-4xl"
      >
        {[
          { label: "Meals Saved", value: "1,200+", icon: UtensilsCrossed },
          { label: "Volunteers", value: "85+", icon: Truck },
          { label: "Communities", value: "12", icon: Heart },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-[#FF6B35]/30 transition-colors">
            <stat.icon className="mx-auto text-[#FF6B35] mb-2" size={24} />
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}