"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trophy, Package, Heart, Award, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  
  // Stats
  const [donatedCount, setDonatedCount] = useState(0);
  const [rescuedCount, setRescuedCount] = useState(0);
  const [rescuedThisMonth, setRescuedThisMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserEmail(user.email || "Anonymous Hero");

      // 2. Count "Meals Shared" (Where I am the donor)
      const { count: donations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true })
        .eq('donor_id', user.id);
      
      setDonatedCount(donations || 0);

      // 3. Count "Meals Rescued" (Where I am the volunteer)
      const { data: claimedData } = await supabase
        .from('donations')
        .select('created_at')
        .eq('volunteer_id', user.id)
        .eq('status', 'claimed');
      
      const totalRescued = claimedData?.length || 0;
      setRescuedCount(totalRescued);

      // 4. Calculate This Month's Rescues (For Certificate)
      const now = new Date();
      const thisMonthRescues = claimedData?.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate.getMonth() === now.getMonth() && 
               itemDate.getFullYear() === now.getFullYear();
      }).length || 0;

      setRescuedThisMonth(thisMonthRescues);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen p-6 pb-20 bg-slate-950 text-white">
      <Link href="/" className="flex items-center gap-2 text-gray-400 mb-8 font-bold hover:text-white transition">
        <ArrowLeft size={20} /> Back Home
      </Link>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#FF6B35]" size={48} /></div>
      ) : (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-1 rounded-full bg-linear-to-r from-orange-500 to-red-500 mb-4">
              <div className="bg-slate-950 p-2 rounded-full">
                 <Trophy size={48} className="text-[#FF6B35]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">{userEmail}</h1>
            <p className="text-gray-400 mt-2">Community Member Status: <span className="text-green-400 font-bold">Active</span></p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {/* Donor Stat */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-orange-900/20 rounded-xl text-[#FF6B35]">
                <Heart size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold">{donatedCount}</h3>
                <p className="text-sm text-gray-400 font-bold uppercase">Meals Shared</p>
              </div>
            </div>

            {/* Volunteer Stat */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-4 bg-blue-900/20 rounded-xl text-[#118AB2]">
                <Package size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold">{rescuedCount}</h3>
                <p className="text-sm text-gray-400 font-bold uppercase">Meals Delivered</p>
              </div>
            </div>
          </div>

          {/* CERTIFICATE SECTION */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" /> Monthly Achievements
            </h2>

            {rescuedThisMonth >= 50 ? (
              // UNLOCKED CERTIFICATE
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 via-yellow-200 to-yellow-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[#fffdf0] text-slate-900 p-8 rounded-lg border-4 border-double border-yellow-600 text-center shadow-2xl">
                  
                  {/* Certificate Content */}
                  <div className="border-2 border-yellow-600/30 p-6">
                    <Trophy size={64} className="mx-auto text-yellow-600 mb-4" />
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-2">Certificate of Excellence</h1>
                    <p className="text-slate-600 italic mb-6">Presented to</p>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-yellow-500">{userEmail}</h2>
                    <p className="text-slate-700 max-w-md mx-auto leading-relaxed mb-6">
                      For outstanding service to the community by rescuing over <span className="font-bold text-lg">50 meals</span> in a single month. Your dedication fights hunger and food waste.
                    </p>
                    <div className="flex justify-center items-center gap-8 mt-8">
                      <div className="text-left">
                        <div className="h-0.5 w-32 bg-slate-900 mb-1"></div>
                        <p className="text-xs font-bold uppercase">MealsBridge CEO</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                        <div className="h-0.5 w-32 bg-slate-900 mt-1"></div>
                        <p className="text-xs font-bold uppercase">Date</p>
                      </div>
                    </div>
                  </div>

                  {/* Print Button */}
                  <button 
                    onClick={() => window.print()}
                    className="absolute top-4 right-4 print:hidden bg-slate-900 text-white p-2 rounded-full hover:bg-slate-700 transition"
                  >
                    <Printer size={20} />
                  </button>
                </div>
              </div>
            ) : (
              // LOCKED STATE
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                <div className="inline-block p-4 bg-slate-800 rounded-full mb-4 grayscale opacity-50">
                  <Award size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Certificate Locked</h3>
                <p className="text-gray-500 mt-2 mb-6">Deliver 50+ meals this month to unlock your Certificate of Excellence.</p>
                
                {/* Progress Bar */}
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{rescuedThisMonth} / 50</span>
                  </div>
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-[#FF6B35] to-yellow-500 transition-all duration-1000"
                      style={{ width: `${(rescuedThisMonth / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}