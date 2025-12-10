import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // <--- 1. Importing the new cool font
import "./globals.css";
import Navbar from "@/components/navbar";

// 2. Setting up the font
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MealBridge",
  description: "Connecting surplus food to those in need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Applied font and Dark Background (bg-slate-950) globally */}
      <body className={`${outfit.className} bg-slate-950 text-gray-200`}>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}