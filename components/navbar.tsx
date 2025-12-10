"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Truck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Updated for Dark Mode: Active is Orange, Inactive is Gray
  const isActive = (path: string) => pathname === path ? "text-[#FF6B35] bg-white/10" : "text-gray-400 hover:bg-white/5";

  return (
    // Changed bg-white to bg-slate-900/80 for dark glass effect
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="text-xl font-bold text-white">
            Meal<span className="text-[#FF6B35]">Bridge</span>
          </Link>

          <div className="flex gap-2">
            <Link href="/" className={`p-2 rounded-lg transition-colors ${isActive("/")}`}>
              <Home size={24} />
            </Link>

            <Link href="/donate" className={`p-2 rounded-lg transition-colors ${isActive("/donate")}`}>
              <UtensilsCrossed size={24} />
            </Link>

            <Link href="/volunteer" className={`p-2 rounded-lg transition-colors ${isActive("/volunteer")}`}>
              <Truck size={24} />
            </Link>
            
             <Link href="/login" className="p-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
              <span className="font-bold text-sm">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}