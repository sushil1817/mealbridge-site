"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, CheckCircle, Image as ImageIcon, Phone, User, Truck, CheckSquare } from "lucide-react";
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
  const [availableFood, setAvailableFood] = useState<Donation[]>([]); // Zone B items
  const [myDeliveries, setMyDeliveries] = useState<Donation[]>([]); // Zone A items
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      await fetchData(user.id);
    };
    setup();

    // Real-Time Listener
    const channel = supabase
      .channel('realtime donations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload) => {
          const newFood = payload.new as Donation;
          if (newFood.status === 'available') {
            const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
            audio.play().catch(e => console.log("Audio blocked", e));
            setAvailableFood((prev) => [newFood, ...prev]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router]);

  const fetchData = async (uid: string) => {
    setLoading(true);
    
    // 1. Get Available Items (For Zone B)
    const { data: available } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available') // Only available items
      .order('created_at', { ascending: false });
    
    // 2. Get My Active Claims (For Zone A)
    const { data: mine } = await supabase
      .from('donations')
      .select('*')
      .eq('volunteer_id', uid) // Only items claimed by ME
      .eq('status', 'claimed'); // Only items that are NOT completed yet

    setAvailableFood(available || []);
    setMyDeliveries(mine || []);
    setLoading(false);
  };

  // ACTION: Move from Zone B -> Zone A
  const handleClaim = async (id: string) => {
    const item = availableFood.find(f => f.id === id);
    if (!item) return;

    // Optimistic Update
    setAvailableFood(prev => prev.filter(i => i.id !== id));
    setMyDeliveries(prev => [item, ...prev]);

    // Database Update
    await supabase.from('donations').update({ status: 'claimed', volunteer_id: userId }).eq('id', id);
  };

  // ACTION: Move from Zone A -> Done (History)
  const handleComplete = async (id: string) => {
    // Optimistic Update
    setMyDeliveries(prev => prev.filter(i => i.id !== id));

    // Database Update
    await supabase.from('donations').update({ status: 'completed' }).eq('id', id);
    alert("Delivery Completed! Added to your Profile stats.");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2 text-gray-400 font-bold hover:text-white transition">
          <ArrowLeft size={20} /> Back
        </Link>
        <Link href="/profile" className="flex items-center gap-2 text-[#FF6B35] font-bold hover:underline">
          <User size={20} /> My Stats
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* --- ZONE A: MY ACTIVE DELIVERIES (Shows "Mark Delivered") --- */}
        {myDeliveries.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-4 p-4 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
              <Truck className="text-yellow-500" /> 
              <h2 className="text-xl font-bold text-white">My Active Orders</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {myDeliveries.map((food) => (
                <div key={food.id} className="bg-slate-900 border-2 border-yellow-500 rounded-2xl overflow-hidden relative shadow-2xl shadow-yellow-900/20">
                   <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-bl-lg z-10">
                     IN PROGRESS
                   </div>
                   
                   <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{food.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{food.location}</p>
                      
                      {food.phone && (
                        <div className="mb-4 p-3 bg-slate-800 rounded-lg flex items-center gap-3">
                          <Phone size={18} className="text-green-500" />
                          <a href={`tel:${food.phone}`} className="text-white font-bold hover:underline">{food.phone}</a>
                        </div>
                      )}

                      {/* THIS BUTTON ONLY APPEARS HERE */}
                      <button 
                        onClick={() => handleComplete(food.id)}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckSquare size={20} /> Mark Delivered
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ZONE B: NEW REQUESTS FEED (Shows "Claim Pickup") --- */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Package className="text-[#118AB2]" /> Available Pickups
          </h2>
          
          {loading ? (
            <p className="text-gray-500 animate-pulse">Scanning area...</p>
          ) : availableFood.length === 0 ? (
            <div className="text-center p-10 bg-slate-900 rounded-2xl border border-slate-800">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <p className="text-gray-400">No pending donations right now.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {availableFood.map((food) => (
                <div key={food.id} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 hover:border-slate-600 transition-all flex flex-col overflow-hidden">
                  <div className="h-40 w-full bg-slate-800 relative">
                    {food.image_url ? (
                      <img src={food.image_url} alt={food.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-lg font-bold text-white">{food.title}</h3>
                    <p className="text-[#118AB2] text-sm font-medium mb-1">{food.quantity}</p>
                    <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
                      <MapPin size={12} /> {food.location}
                    </p>

                    {/* THIS BUTTON ONLY APPEARS HERE */}
                    <button 
                      onClick={() => handleClaim(food.id)}
                      className="mt-auto py-2 bg-[#118AB2] text-white font-bold rounded-lg hover:bg-[#0e7c9e] transition-colors"
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
    </div>
  );
}