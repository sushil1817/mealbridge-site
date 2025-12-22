"use client";
import Link from "next/link";
import { Heart, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      // Get the role from the user metadata
      if (session?.user?.user_metadata?.role) {
        setRole(session.user.user_metadata.role);
      }
    };

    getData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.user_metadata?.role) {
        setRole(session.user.user_metadata.role);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
          MEAL<span className="text-[#FF6B35]">BRIDGE</span>
        </h1>
        <p className="text-xl text-gray-400">
          Bridging the gap between excess food and empty plates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* SHOW DONATE BUTTON: If role is 'donor' OR user is not logged in OR role is missing */}
        {(!session || role === 'donor' || !role) && (
          <Link href="/donate" className={`group relative overflow-hidden bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-[#FF6B35] transition-all duration-300 ${role === 'donor' ? 'md:col-span-2' : ''}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 text-[#FF6B35]">
                <Heart size={24} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I have Food</h2>
              <p className="text-gray-400">List leftovers from your restaurant, mess, or event.</p>
            </div>
          </Link>
        )}

        {/* SHOW VOLUNTEER BUTTON: If role is 'volunteer' OR user is not logged in OR role is missing */}
        {(!session || role === 'volunteer' || !role) && (
          <Link href="/volunteer" className={`group relative overflow-hidden bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-[#118AB2] transition-all duration-300 ${role === 'volunteer' ? 'md:col-span-2' : ''}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Truck size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-[#118AB2]">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">I want to Help</h2>
              <p className="text-gray-400">Find nearby food pickups and deliver them to the needy.</p>
            </div>
          </Link>
        )}

      </div>

      <div className="mt-12">
        {session ? (
          <Link href="/profile" className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-full text-white font-bold hover:bg-slate-800 transition">
            <User size={18} /> My Profile ({role ? role.toUpperCase() : "MEMBER"})
          </Link>
        ) : (
          <Link href="/login" className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-gray-200 transition">
            Login / Sign Up
          </Link>
        )}
      </div>

    </div>
  );
}