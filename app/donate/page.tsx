"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // HANDLE SIGN UP
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert("Check your email for the confirmation link!");
    } else {
      // HANDLE LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      } else {
        // SUCCESS: Go to the Volunteer page
        router.push("/volunteer");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-slate-800 mb-4 border border-slate-700">
            <Lock size={32} className="text-[#FF6B35]" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p className="text-gray-400 mt-2">To save food, we need to know who you are.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-600" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-[#FF6B35]"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-600" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-[#FF6B35]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-4 bg-[#FF6B35] rounded-xl font-bold text-white hover:bg-orange-600 transition-colors flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
          </button>
        </div>

        <Link href="/" className="block text-center mt-6 text-gray-600 hover:text-gray-400 text-sm">
          Back to Home
        </Link>
      </div>
    </div>
  );
}