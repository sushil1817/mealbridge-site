"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, ArrowLeft, Loader2, MapPin } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", quantity: "", location: "" });
  const [hygieneChecks, setHygieneChecks] = useState({
    isCovered: false, isFresh: false, tempSafe: false,
  });

  const isSafe = Object.values(hygieneChecks).every((val) => val === true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSafe) return;

    setLoading(true);

    const { error } = await supabase
      .from('donations')
      .insert([
        { 
          title: formData.title, 
          quantity: formData.quantity,
          location: formData.location,
          is_safe: true 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Success! Food listed on MealBridge.");
      setFormData({ title: "", quantity: "", location: "" });
      setHygieneChecks({ isCovered: false, isFresh: false, tempSafe: false });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-bold transition-colors">
        <ArrowLeft size={20}/> Back Home
      </Link>
      
      {/* Dark Card Container */}
      <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6">Donate Leftovers</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Food Title</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              type="text" 
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" 
              placeholder="e.g., 5kg Rice" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Quantity</label>
            <input 
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              type="text" 
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" 
              placeholder="e.g., 2 Packets" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-500" size={20} />
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                type="text" 
                className="w-full pl-10 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" 
                placeholder="e.g., Connaught Place, Delhi" 
                required 
              />
            </div>
          </div>

          <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-900/50">
            <h3 className="flex items-center gap-2 text-[#FF6B35] font-bold mb-3">
              <AlertTriangle size={18} /> Safety Checklist
            </h3>
            {["isCovered", "isFresh", "tempSafe"].map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer mb-2 hover:bg-white/5 p-1 rounded transition-colors">
                <input 
                  type="checkbox" 
                  checked={hygieneChecks[key as keyof typeof hygieneChecks]}
                  className="w-5 h-5 accent-[#FF6B35] bg-slate-800 border-slate-600 rounded" 
                  onChange={() => setHygieneChecks(prev => ({...prev, [key]: !prev[key as keyof typeof hygieneChecks]}))}
                />
                <span className="text-sm text-gray-300 font-medium">Item is {key.replace('is', '')} & Safe</span>
              </label>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={!isSafe || loading} 
            className={`w-full p-4 rounded-xl font-bold text-white transition-all flex justify-center gap-2 ${isSafe ? "bg-[#FF6B35] hover:bg-orange-600 shadow-lg shadow-orange-900/20" : "bg-slate-700 text-slate-400 cursor-not-allowed"}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Broadcast Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}