"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; // <--- Importing the connection!
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", quantity: "" });
  const [hygieneChecks, setHygieneChecks] = useState({
    isCovered: false, isFresh: false, tempSafe: false,
  });

  const isSafe = Object.values(hygieneChecks).every((val) => val === true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSafe) return;

    setLoading(true);

    // --- TALKING TO DATABASE ---
    const { error } = await supabase
      .from('donations')
      .insert([
        { 
          title: formData.title, 
          quantity: formData.quantity, 
          is_safe: true 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Success! Food listed on MealBridge.");
      setFormData({ title: "", quantity: "" }); // Reset form
      setHygieneChecks({ isCovered: false, isFresh: false, tempSafe: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-500 mb-8 font-bold">
        <ArrowLeft size={20}/> Back Home
      </Link>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#FF6B35]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Donate Leftovers</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Food Title</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              type="text" 
              className="w-full mt-1 p-3 border rounded-lg" 
              placeholder="e.g., 5kg Rice" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Quantity</label>
            <input 
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              type="text" 
              className="w-full mt-1 p-3 border rounded-lg" 
              placeholder="e.g., 2 Packets" 
              required 
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h3 className="flex items-center gap-2 text-[#FF6B35] font-bold mb-3">
              <AlertTriangle size={18} /> Safety Checklist
            </h3>
            {["isCovered", "isFresh", "tempSafe"].map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer mb-2">
                <input 
                  type="checkbox" 
                  checked={hygieneChecks[key as keyof typeof hygieneChecks]}
                  className="w-5 h-5 accent-[#FF6B35]" 
                  onChange={() => setHygieneChecks(prev => ({...prev, [key]: !prev[key as keyof typeof hygieneChecks]}))}
                />
                <span className="text-sm text-gray-700">Item is {key.replace('is', '')} & Safe</span>
              </label>
            ))}
          </div>

          <button 
          type="submit" 
  // disabled={!isSafe || loading}  <-- I deleted this line
      >
   BROADCAST NOW (DEBUG MODE)
</button>
        </form>
      </div>
    </div>
  );
}