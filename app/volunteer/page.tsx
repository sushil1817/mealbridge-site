"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

type Donation = {
  id: string;
  title: string;
  quantity: string;
  location: string;
  created_at: string;
};

export default function VolunteerPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert("Error fetching food: " + error.message);
    } else {
      setDonations(data || []);
    }
    setLoading(false);
  };

  const handleClaim = async (id: string) => {
    setDonations(donations.filter(item => item.id !== id));
    
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error claiming: " + error.message);
      fetchDonations(); 
    } else {
      alert("Success! You have claimed this pickup.");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-bold transition-colors">
        <ArrowLeft size={20} /> Back Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Volunteer Dashboard</h1>
        <p className="text-gray-400 mb-8">Available food pickups near you.</p>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Scanning for food...</p>
        ) : donations.length === 0 ? (
          <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white">All Clear!</h3>
            <p className="text-gray-500 mt-2">No pending donations right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {donations.map((food) => (
              <div key={food.id} className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-[#118AB2]/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{food.title}</h3>
                    <p className="text-[#118AB2] font-medium flex items-center gap-2 mt-1">
                      <Package size={16} /> {food.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {new Date(food.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.location || "India")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 text-sm mb-6 hover:text-[#FF6B35] transition-colors group"
                >
                  <MapPin size={16} className="group-hover:animate-bounce" />
                  <span className="underline decoration-slate-700 underline-offset-4 group-hover:decoration-[#FF6B35]">{food.location || "View on Map"}</span>
                </a>

                <button 
                  onClick={() => handleClaim(food.id)}
                  className="w-full py-3 bg-[#118AB2] text-white font-bold rounded-xl hover:bg-[#0e7c9e] transition-colors shadow-lg shadow-cyan-900/20"
                >
                  Claim Pickup
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}