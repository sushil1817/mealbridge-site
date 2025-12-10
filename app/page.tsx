"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Heart, Truck, UtensilsCrossed } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden font-sans text-gray-900">
      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#118AB2] text-sm font-bold mb-6">
            LIVE: 1,240 Meals Saved Today
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Waste for some, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF6B35] to-[#FF9F1C]">
              Food for many.
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link href="/donate">
              <button className="px-8 py-4 bg-[#FF6B35] text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:bg-orange-600 transition">
                <UtensilsCrossed size={20} /> Donate Food
              </button>
            </Link>
            <Link href="/volunteer">
              <button className="px-8 py-4 bg-white text-[#118AB2] border-2 border-[#118AB2] font-bold rounded-full flex items-center gap-2 hover:bg-blue-50 transition">
                <Truck size={20} /> Become a Carrier
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-[#FF6B35]">
            <h3 className="text-xl font-bold mb-2 text-[#FF6B35]">1. Post Surplus</h3>
            <p className="text-gray-500">Restaurants check hygiene and list leftover food.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-[#118AB2]">
            <h3 className="text-xl font-bold mb-2 text-[#118AB2]">2. Smart Match</h3>
            <p className="text-gray-500">AI assigns the nearest volunteer to pickup.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-[#06D6A0]">
            <h3 className="text-xl font-bold mb-2 text-[#06D6A0]">3. Feed the Needy</h3>
            <p className="text-gray-500">Food reaches NGOs before expiry.</p>
          </div>
        </div>
      </section>
    </main>
  );
}