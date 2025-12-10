"use client";

import { useState } from "react";
// Removed unused imports
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HygieneState {
  isCovered: boolean;
  isFresh: boolean;
  tempSafe: boolean;
}

// 1. UPDATED NAME: Changed from RestaurantPage to DonatePage
function DonatePage() {
  const [hygieneChecks, setHygieneChecks] = useState<HygieneState>({
    isCovered: false,
    isFresh: false,
    tempSafe: false,
  });

  const safetyKeys: (keyof HygieneState)[] = ["isCovered", "isFresh", "tempSafe"];
  
  const isSafe = Object.values(hygieneChecks).every((val) => val === true);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-500 mb-8 font-bold">
        <ArrowLeft size={20}/> Back Home
      </Link>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#FF6B35]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Donate Leftovers</h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Food Title</label>
            <input type="text" className="w-full mt-1 p-3 border rounded-lg" placeholder="e.g., 5kg Rice" />
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h3 className="flex items-center gap-2 text-[#FF6B35] font-bold mb-3">
              <AlertTriangle size={18} /> Safety Checklist
            </h3>
            
            {safetyKeys.map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer mb-2">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-[#FF6B35]" 
                  checked={hygieneChecks[key]}
                  onChange={() => setHygieneChecks(prev => ({...prev, [key]: !prev[key]}))}
                />
                <span className="text-sm text-gray-700">Item is {key.replace('is', '')} & Safe</span>
              </label>
            ))}
          </div>

          <button disabled={!isSafe} className={`w-full p-4 rounded-xl font-bold text-white transition-all flex justify-center gap-2 ${isSafe ? "bg-[#FF6B35]" : "bg-gray-300"}`}>
            {isSafe ? "Broadcast Donation" : "Complete Hygiene Check"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. UPDATED EXPORT: Exporting the new name
export default DonatePage;