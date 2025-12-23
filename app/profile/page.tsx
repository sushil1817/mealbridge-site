"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trophy, Package, Heart, Award, Printer, Loader2, Star, Send, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the shape of a history item
type HistoryItem = {
  id: string; 
  title: string; 
  quantity: string; 
  created_at: string;
  volunteer_id: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  
  // STATS STATE
  const [donatedCount, setDonatedCount] = useState(0);
  const [rescuedCount, setRescuedCount] = useState(0);
  const [rescuedThisMonth, setRescuedThisMonth] = useState(0);

  // HISTORY & REVIEW STATE
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [reviewOpen, setReviewOpen] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserEmail(user.email || "User");

      // 1. STATS: Count "Meals Shared" (My Donations)
      const { count: donations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('donor_id', user.id);
      setDonatedCount(donations || 0);

      // 2. HISTORY: Fetch "Meals Delivered" (My Completed Deliveries)
      const { data: deliveredData } = await supabase
        .from('donations')
        .select('*') // We need the full data for the list, not just count
        .eq('volunteer_id', user.id)
        .eq('status', 'completed') // Only show completed items
        .order('created_at', { ascending: false });

      // Update State
      setHistory(deliveredData || []);
      const totalRescued = deliveredData?.length || 0;
      setRescuedCount(totalRescued);

      // 3. STATS: Calculate This Month's Rescues (For Certificate)
      const now = new Date();
      const thisMonth = deliveredData?.filter(item => {
        const d = new Date(item.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length || 0;
      setRescuedThisMonth(thisMonth);
      
      setLoading(false);
    };
    fetchData();
  }, [router]);

  // REVIEW SUBMISSION LOGIC
  const submitReview = async (donationId: string, title: string) => {
    if (!comment) return alert("Please write a short comment!");
    
    const { error } = await supabase.from('reviews').insert([
      { donation_title: title, rating: rating, comment: comment }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Review Sent! Thank you.");
      setReviewOpen(null); 
      setComment("");
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20 bg-slate-950 text-white">
      <Link href="/" className="flex items-center gap-2 text-gray-400 mb-8 font-bold hover:text-white transition">
        <ArrowLeft size={20} /> Back Home
      </Link>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#FF6B35]" size={48} /></div>
      ) : (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">{userEmail}</h1>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <Heart className="text-[#FF6B35] mb-2 mx-auto" />
                <h3 className="text-3xl font-bold">{donatedCount}</h3>
                <p className="text-gray-400 text-xs uppercase">Shared</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <Package className="text-[#118AB2] mb-2 mx-auto" />
                <h3 className="text-3xl font-bold">{rescuedCount}</h3>
                <p className="text-gray-400 text-xs uppercase">Delivered</p>
              </div>
            </div>
          </div>
          
          {/* --- CERTIFICATE SECTION --- */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center mb-12">
            <Award size={40} className={`mx-auto mb-4 ${rescuedThisMonth >= 50 ? "text-yellow-500" : "text-gray-600"}`} />
            <h3 className="text-xl font-bold">{rescuedThisMonth >= 50 ? "Certificate Unlocked!" : "Certificate Locked"}</h3>
            <p className="text-gray-500 mt-2 mb-4">
              {rescuedThisMonth >= 50 ? "You are a hero! Print your certificate." : `${50 - rescuedThisMonth} more deliveries needed to unlock.`}
            </p>
            {rescuedThisMonth >= 50 ? (
              <button onClick={() => window.print()} className="bg-yellow-600 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-500">
                Print Certificate
              </button>
            ) : (
               // Progress Bar
               <div className="max-w-sm mx-auto mt-4">
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-600" style={{ width: `${(rescuedThisMonth / 50) * 100}%` }}></div>
                 </div>
               </div>
            )}
          </div>

          {/* --- HISTORY & REVIEWS LIST (RESTORED!) --- */}
          {history.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <CheckCircle className="text-green-500" /> Recent Deliveries
              </h2>
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
                      
                      {/* Review Toggle Button */}
                      <button 
                        onClick={() => setReviewOpen(reviewOpen === item.id ? null : item.id)}
                        className="text-sm font-bold text-[#FF6B35] hover:text-white underline"
                      >
                        {reviewOpen === item.id ? "Cancel" : "Write Review"}
                      </button>
                    </div>

                    {/* Review Form Dropdown */}
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
                          placeholder="How was the pickup experience?"
                          className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 text-sm mb-3 outline-none focus:border-[#FF6B35]"
                        />
                        <button 
                          onClick={() => submitReview(item.id, item.title)}
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
          )}

        </div>
      )}
    </div>
  );
}