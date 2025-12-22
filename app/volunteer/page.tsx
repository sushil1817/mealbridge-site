"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, CheckCircle, Image as ImageIcon, Phone, User } from "lucide-react";
import Link from "next/link";

type Donation = {
  id: string; 
  title: string; 
  quantity: string; 
  location: string; 
  image_url?: string; 
  phone?: string; 
  created_at: string;
  status: string;
};

export default function VolunteerPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check User & Fetch Data
    const checkUserAndSetup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      await fetchDonations();
    };
    checkUserAndSetup();

    // 2. Real-Time Listener
    const channel = supabase
      .channel('realtime donations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'donations' },
        (payload) => {
          const newFood = payload.new as Donation;
          if (newFood.status === 'available') {
            const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
            audio.play().catch(e => console.log("Audio play failed", e));
            setDonations((currentList) => [newFood, ...currentList]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router]);

  const fetchDonations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    setDonations(data || []);
    setLoading(false);
  };

  const handleClaim = async (id: string) => {
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Optimistic Update
    setDonations(donations.filter(item => item.id !== id));
    
    // 3. Database Update: Mark claimed & Save volunteer_id
    await supabase
      .from('donations')
      .update({ 
        status: 'claimed',
        volunteer_id: user.id // <--- SAVES YOUR ID
      })
      .eq('id', id);
      
    alert("Success! You have claimed this pickup.");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition">
          <ArrowLeft size={20} /> Back Home
        </Link>
        <Link href="/profile" className="flex items-center gap-2 text-[#FF6B35] font-bold hover:underline">
          <User size={20} /> My Impact
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Volunteer Dashboard</h1>
        <p className="text-gray-400 mb-8">Live Feed: Waiting for new donations...</p>

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
              <div key={food.id} className="bg-slate-900 overflow-hidden rounded-2xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all flex flex-col animate-in fade-in slide-in-from-top-4 duration-500">
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
                  <h3 className="text-xl font-bold text-white mb-1">{food.title}</h3>
                  <p className="text-[#118AB2] font-medium flex items-center gap-2 mb-4"><Package size={16} /> {food.quantity}</p>
                  
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.location || "India")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 text-sm mb-6 hover:text-[#118AB2] transition-colors underline">
                    <MapPin size={16} /> <span>{food.location || "View on Map"}</span>
                  </a>

                  <div className="grid grid-cols-4 gap-2 mt-auto">
                    {food.phone && (
                      <a href={`tel:${food.phone}`} className="col-span-1 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center hover:bg-green-700">
                        <Phone size={20} />
                      </a>
                    )}
                    <button onClick={() => handleClaim(food.id)} className={`${food.phone ? "col-span-3" : "col-span-4"} py-3 bg-[#118AB2] text-white font-bold rounded-xl hover:bg-[#0e7c9e]`}>
                      Claim Pickup
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}