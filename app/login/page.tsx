"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        alert("Account created! You are now logged in.");
        router.push("/donate");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        router.push("/donate");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      
      {/* Back Button */}
      <div className="w-full max-w-md mb-8">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-colors">
          <ArrowLeft size={20}/> Back Home
        </Link>
      </div>

      {/* Dark Card */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 relative overflow-hidden">
        
        {/* Top Orange Line Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#FF6B35] to-[#FF9F1C]"></div>

        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          {isSignUp ? "Join MealBridge" : "Welcome Back"}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isSignUp ? "Start saving food today." : "Login to manage donations."}
        </p>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input 
                type="email" 
                className="w-full pl-10 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" 
                placeholder="chef@restaurant.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input 
                type="password" 
                className="w-full pl-10 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" 
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
          </div>

          <button disabled={loading} className="w-full p-4 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex justify-center shadow-lg shadow-orange-900/20">
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Create Account" : "Login")}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          {isSignUp ? "Already have an account?" : "New to MealBridge?"}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="ml-2 text-[#FF6B35] font-bold hover:text-orange-400 hover:underline transition-colors"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}