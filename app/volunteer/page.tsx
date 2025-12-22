"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Package, CheckCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

// Added image_url to type
type Donation = {
  id: string; title: string; quantity: string; location: string; image_url?: string; created_at: string;
};

export default function VolunteerPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
    setDonations(data || []);
    setLoading(false);
  };

  const handleClaim = async (id: string) => {
    setDonations(donations.filter(item => item.id !== id));
    await supabase.from('donations').delete().eq('id', id);
    alert("Success! You have claimed this pickup.");
  };

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-400 mb-8 font-bold hover:text-white transition">
        <ArrowLeft size={20} /> Back Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Volunteer Dashboard</h1>
        <p className="text-gray-400 mb-8">Available food pickups near you.</p>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Scanning for food...</p>
        ) : donations.length === 0 ? (
          <div className="text-center p-10 bg-slate-900 rounded-2xl border border-slate-800">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white">All Clear!</h3>
            <p className="text-gray-400">No pending donations right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {donations.map((food) => (
              <div key={food.id} className="bg-slate-900 overflow-hidden rounded-2xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all flex flex-col">
                
                {/* Image Section */}
                <div className="h-48 w-full bg-slate-800 relative">
                  {food.image_url ? (
                    <img src={food.image_url} alt={food.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <span className="absolute top-4 right-4 text-xs font-bold text-gray-900 bg-white/90 px-2 py-1 rounded">
                    {new Date(food.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{food.title}</h3>
                      <p className="text-[#118AB2] font-medium flex items-center gap-2 mt-1">
                        <Package size={16} /> {food.quantity}
                      </p>
                    </div>
                  </div>

                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.location || "India")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 text-sm mb-6 hover:text-[#118AB2] transition-colors underline"
                  >
                    <MapPin size={16} />
                    <span>{food.location || "View on Map"}</span>
                  </a>

                  <button 
                    onClick={() => handleClaim(food.id)}
                    className="mt-auto w-full py-3 bg-[#118AB2] text-white font-bold rounded-xl hover:bg-[#0e7c9e] transition-colors"
                  >
                    Claim Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}