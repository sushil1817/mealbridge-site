"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Clock, MapPin, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

// This tells the computer what a "Food Item" looks like
type Donation = {
  id: string;
  title: string;
  quantity: string;
  created_at: string;
};

export default function VolunteerPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // This runs automatically when the page loads
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    // Ask Supabase for all donations, sorted by newest first
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
    // 1. Optimistic Update: Remove it from the screen immediately (feels fast)
    setDonations(donations.filter(item => item.id !== id));

    // 2. Real Update: Tell Supabase to delete this specific row
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id); // "Delete the row where ID equals this ID"

    if (error) {
      alert("Error claiming: " + error.message);
      // If it failed, maybe reload the page to show the item again
      fetchDonations(); 
    } else {
      alert("Success! You have claimed this pickup.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-900 mb-8 font-bold">
        <ArrowLeft size={20} /> Back Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Dashboard</h1>
        <p className="text-gray-600 mb-8">Available food pickups near you.</p>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Scanning for food...</p>
        ) : donations.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl shadow-sm">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900">All Clear!</h3>
            <p className="text-gray-500">No pending donations right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {donations.map((food) => (
              <div key={food.id} className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#118AB2] hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{food.title}</h3>
                    <p className="text-[#118AB2] font-medium flex items-center gap-2 mt-1">
                      <Package size={16} /> {food.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {new Date(food.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <MapPin size={16} />
                  <span>Restaurant Location (Demo)</span>
                </div>

                <button 
                  onClick={() => handleClaim(food.id)}
                  className="w-full py-3 bg-[#118AB2] text-white font-bold rounded-xl hover:bg-[#0e7c9e] transition-colors"
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