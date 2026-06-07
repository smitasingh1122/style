"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Heart, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getUserData } from "@/lib/auth";
import Image from "next/image";

type OutfitResponse = {
  outfit: {
    top: string;
    bottom: string;
    footwear: string;
    accessories: string[];
    finishingTouches: string;
    finishingTouchesLabel: string;
  };
  palette: { hex: string; name: string }[];
  explanation: string;
  affirmation: string;
  gender: string;
  styleKey: string;
};

export default function OutfitPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [outfitData, setOutfitData] = useState<OutfitResponse | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchOutfit = async () => {
      try {
        const profileStr = getUserData("profile");
        if (!profileStr) {
          router.push("/onboarding");
          return;
        }

        const profile = JSON.parse(profileStr);
        const res = await fetch("/api/generate-outfit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        });
        
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const text = await res.text();
        if (!text) {
          throw new Error("Empty response from server");
        }

        const data = JSON.parse(text);
        setOutfitData(data);
      } catch (error) {
        console.error("Failed to fetch outfit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [authLoading, isAuthenticated, router]);

  if (loading) {
    return (
      <PageTransition className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 text-rosegold animate-spin mb-8" />
        <p className="font-serif text-2xl text-charcoal/80 animate-pulse">Consulting your stylist...</p>
      </PageTransition>
    );
  }

  if (!outfitData) return null;

  return (
    <PageTransition className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12">
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => router.push("/onboarding")}
          className="flex items-center text-sm tracking-widest uppercase text-charcoal/60 hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </Button>
          <Button className="flex items-center">
            <Heart className="w-4 h-4 mr-2" /> Save Look
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Moodboard / Outfit Details */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 shadow-sm border border-sand/30"
          >
            <h2 className="font-serif text-4xl mb-8">Your Curated Look</h2>
            
            <div className="relative w-full aspect-[4/5] mb-10 overflow-hidden bg-sand/20">
              <Image 
                src={(() => {
                  if (outfitData.styleKey && outfitData.styleKey !== "default") {
                    const fallback = outfitData.gender === "male" ? "/generated-male.png" : "/generated-dress.png";
                    // Map of available specific images
                    const validCombos = [
                      "female_minimalist", "female_boho", "female_streetwear", "female_classic",
                      "male_minimalist", "male_streetwear"
                    ];
                    const combo = `${outfitData.gender}_${outfitData.styleKey}`;
                    if (validCombos.includes(combo)) {
                      return `/${combo}.png`;
                    }
                    return fallback;
                  }
                  return outfitData.gender === "male" ? "/generated-male.png" : "/generated-dress.png";
                })()}
                alt="AI Generated Outfit Visualization" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="border-l-2 border-rosegold pl-6">
                <p className="text-xs tracking-widest text-charcoal/50 uppercase mb-1">Top</p>
                <p className="text-lg">{outfitData.outfit.top}</p>
              </div>
              <div className="border-l-2 border-rosegold pl-6">
                <p className="text-xs tracking-widest text-charcoal/50 uppercase mb-1">Bottom</p>
                <p className="text-lg">{outfitData.outfit.bottom}</p>
              </div>
              <div className="border-l-2 border-rosegold pl-6">
                <p className="text-xs tracking-widest text-charcoal/50 uppercase mb-1">Footwear</p>
                <p className="text-lg">{outfitData.outfit.footwear}</p>
              </div>
              <div className="border-l-2 border-rosegold pl-6">
                <p className="text-xs tracking-widest text-charcoal/50 uppercase mb-1">Accessories</p>
                <ul className="list-disc list-inside text-lg">
                  {outfitData.outfit.accessories.map((acc, idx) => (
                    <li key={idx}>{acc}</li>
                  ))}
                </ul>
              </div>
              <div className="border-l-2 border-rosegold pl-6">
                <p className="text-xs tracking-widest text-charcoal/50 uppercase mb-1">{outfitData.outfit.finishingTouchesLabel}</p>
                <p className="text-lg">{outfitData.outfit.finishingTouches}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Palette & Explanation */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-charcoal text-ivory p-8 shadow-sm"
          >
            <h3 className="font-serif text-2xl mb-6">Why This Works</h3>
            <p className="text-ivory/80 font-light leading-relaxed mb-8">
              {outfitData.explanation}
            </p>
            <div className="pt-6 border-t border-ivory/20">
              <p className="font-serif italic text-xl text-rosegold">
                "{outfitData.affirmation}"
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 shadow-sm border border-sand/30"
          >
            <h3 className="font-serif text-xl mb-6 text-charcoal">Color Story</h3>
            <div className="flex h-24 w-full rounded-sm overflow-hidden mb-4">
              {outfitData.palette.map((color, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 flex items-end justify-center pb-2 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-charcoal/60 uppercase tracking-wider">
              {outfitData.palette.map((color, idx) => (
                <span key={idx}>{color.name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
