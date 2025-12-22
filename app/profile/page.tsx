"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trophy, Calendar, Star, Send } from "lucide-react";
import Link from "next/link";

type HistoryItem = {
  id: string; title: string; quantity: string; created_at: string;
};

export default function ProfilePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review State
  const [reviewOpen, setReviewOpen] = useState<string | null>(null); // Stores ID of item being reviewed
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
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

  const submitReview = async (title: string) => {
    if (!comment) return alert("Please write a comment!");
    
    const { error } = await supabase.from('reviews').insert([
      { donation_title: title, rating: rating, comment: comment }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Review Sent! Thank you.");
      setReviewOpen(null); // Close the box
      setComment("");
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
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

        {/* Scoreboard */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="text-4xl font-bold text-white">{history.length}</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mt-1">Meals Saved</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="text-4xl font-bold text-[#FF6B35]">Top 1%</h3>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mt-1">Rank</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Your Recent Pickups</h2>
        
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 transition-all hover:border-slate-600">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-lg">{item.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{item.quantity}</p>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Review Button */}
                <button 
                  onClick={() => setReviewOpen(reviewOpen === item.id ? null : item.id)}
                  className="text-sm font-bold text-[#FF6B35] hover:text-white underline"
                >
                  {reviewOpen === item.id ? "Cancel" : "Write Review"}
                </button>
              </div>

              {/* The Review Dropdown Form */}
              {reviewOpen === item.id && (
                <div className="mt-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-700"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Was the food fresh? easy pickup?"
                    className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 text-sm mb-3 outline-none focus:border-[#FF6B35]"
                  />
                  <button 
                    onClick={() => submitReview(item.title)}
                    className="w-full py-2 bg-green-600 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700"
                  >
                    <Send size={16} /> Submit Feedback
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}