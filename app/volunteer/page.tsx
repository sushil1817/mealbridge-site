"use client";

// 1. Removed 'framer-motion' to prevent build issues.
// We will use standard CSS for the animation instead.
import { Award, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 2. Define the function first (No 'export default' here)
function VolunteerPage() {
  const deliveryCount = 24; 
  const TARGET = 30;
  const progress = Math.min((deliveryCount / TARGET) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <Link href="/" className="self-start flex items-center gap-2 text-gray-500 mb-8 font-bold">
        <ArrowLeft size={20}/> Back Home
      </Link>
      
      <h1 className="text-3xl font-bold text-[#118AB2] mb-8">Volunteer Dashboard</h1>

      {/* GAMIFICATION CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Green Hero</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Milestone: 30 Rescues</p>
          </div>
          <div className="p-3 rounded-full bg-gray-100 text-gray-400"><Award size={24} /></div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
            <span>Progress</span><span>{deliveryCount} / {TARGET}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            {/* CHANGED: Replaced motion.div with standard div + CSS transition */}
            <div 
              className="h-full bg-[#118AB2] transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <button className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-gray-200 text-gray-400 cursor-not-allowed">
           <Lock size={18} /> Locked (Reach 30 to Unlock)
        </button>
      </div>
      
      <div className="mt-8 text-center text-gray-500">
        <p>Map System requires API Key (Advanced Step)</p>
      </div>
    </div>
  );
}

// 3. EXPLICIT EXPORT at the bottom
export default VolunteerPage;