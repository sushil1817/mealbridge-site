"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trophy, Calendar } from "lucide-react";
import Link from "next/link";

type HistoryItem = {
  id: string; title: string; quantity: string; created_at: string;
};

export default function ProfilePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // FETCH ONLY CLAIMED ITEMS
      const { data } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'claimed')
        .order('created_at', { ascending: false });
        
      setHistory(data || []);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <Link href="/volunteer" className="flex items-center gap-2 text-gray-400 mb-8 font-bold hover:text-white transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-slate-800 mb-4 border border-slate-700">
            <Trophy size={48} className="text-[#FF6B35]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Community Impact</h1>
          <p className="text-gray-400 mt-2">Food rescued by our volunteers.</p>
        </div>

        {/* The Scoreboard */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="text-4xl font-bold text-white">{history.length}</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mt-1">Meals Saved</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="text-4xl font-bold text-[#FF6B35]">∞</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mt-1">Good Vibes</p>
          </div>
        </div>

        {/* History List */}
        <h2 className="text-xl font-bold text-white mb-4">Recent Rescue History</h2>
        {loading ? (
           <p className="text-gray-500">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-gray-500">
            No meals rescued yet. Go claim some!
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="flex items-center gap-1 text-xs text-gray-500 mb-1 justify-end">
                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-green-900/30 text-green-500 text-xs font-bold border border-green-900">
                    Rescued
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}