"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, ArrowLeft, Loader2, MapPin, Camera, Phone } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  // Added 'phone' to the state
  const [formData, setFormData] = useState({ title: "", quantity: "", location: "", phone: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [hygieneChecks, setHygieneChecks] = useState({
    isCovered: false, isFresh: false, tempSafe: false,
  });

  const isSafe = Object.values(hygieneChecks).every((val) => val === true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSafe) return;

    setLoading(true);
    let uploadedImageUrl = "";

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from('food-images').upload(fileName, imageFile);
      if (uploadError) {
        alert("Error uploading image");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
      uploadedImageUrl = data.publicUrl;
    }

    // Saving phone number to database now
    const { error } = await supabase
      .from('donations')
      .insert([
        { 
          title: formData.title, 
          quantity: formData.quantity,
          location: formData.location,
          phone: formData.phone, // <--- New Field
          image_url: uploadedImageUrl,
          is_safe: true 
        }
      ]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Success! Food listed.");
      setFormData({ title: "", quantity: "", location: "", phone: "" });
      setImageFile(null);
      setHygieneChecks({ isCovered: false, isFresh: false, tempSafe: false });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="flex items-center gap-2 text-gray-400 mb-8 font-bold hover:text-white transition">
        <ArrowLeft size={20}/> Back Home
      </Link>
      
      <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 border-t-4 border-t-[#FF6B35]">
        <h2 className="text-2xl font-bold text-white mb-6">Donate Leftovers</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Food Photo (Optional)</label>
            <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-[#FF6B35] transition-colors cursor-pointer bg-slate-950">
              <Camera size={32} className="mb-2" />
              <span className="text-xs">{imageFile ? imageFile.name : "Tap to snap or upload"}</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Food Title</label>
            <input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              type="text" 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:border-[#FF6B35] outline-none" 
              placeholder="e.g., 5kg Rice" required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Quantity</label>
            <input 
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              type="text" 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:border-[#FF6B35] outline-none" 
              placeholder="e.g., 2 Packets" required 
            />
          </div>

          {/* NEW PHONE INPUT */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-600" size={20} />
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                type="tel" 
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:border-[#FF6B35] outline-none" 
                placeholder="e.g., 98765 43210" required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-600" size={20} />
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                type="text" 
                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-600 focus:border-[#FF6B35] outline-none" 
                placeholder="e.g., Connaught Place, Delhi" required 
              />
            </div>
          </div>

          <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30">
            <h3 className="flex items-center gap-2 text-[#FF6B35] font-bold mb-3">
              <AlertTriangle size={18} /> Safety Checklist
            </h3>
            {["isCovered", "isFresh", "tempSafe"].map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer mb-2">
                <input 
                  type="checkbox" 
                  checked={hygieneChecks[key as keyof typeof hygieneChecks]}
                  className="w-5 h-5 accent-[#FF6B35]" 
                  onChange={() => setHygieneChecks(prev => ({...prev, [key]: !prev[key as keyof typeof hygieneChecks]}))}
                />
                <span className="text-sm text-gray-300 font-medium">Item is {key.replace('is', '')} & Safe</span>
              </label>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={!isSafe || loading} 
            className={`w-full p-4 rounded-xl font-bold text-white transition-all flex justify-center gap-2 ${isSafe ? "bg-[#FF6B35] hover:bg-orange-600" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Broadcast Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}