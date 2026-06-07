"use client";

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { getUserData } from "@/lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { setUserData } from "@/lib/auth";

type SavedOutfit = {
  id: string;
  savedAt: string;
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

export default function WardrobePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [wardrobe, setWardrobe] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    try {
      const wardrobeRaw = getUserData("wardrobe");
      if (wardrobeRaw) {
        setWardrobe(JSON.parse(wardrobeRaw));
      }
    } catch (error) {
      console.error("Failed to load wardrobe:", error);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const removeOutfit = (id: string) => {
    const newWardrobe = wardrobe.filter(item => item.id !== id);
    setWardrobe(newWardrobe);
    setUserData("wardrobe", JSON.stringify(newWardrobe));
  };

  const getImageUrl = (gender: string, styleKey: string) => {
    if (styleKey && styleKey !== "default") {
      const fallback = gender === "male" ? "/generated-male.png" : "/generated-dress.png";
      const validCombos = [
        "female_minimalist", "female_boho", "female_streetwear", "female_classic",
        "male_minimalist", "male_streetwear"
      ];
      const combo = `${gender}_${styleKey}`;
      if (validCombos.includes(combo)) {
        return `/${combo}.png`;
      }
      return fallback;
    }
    return gender === "male" ? "/generated-male.png" : "/generated-dress.png";
  };

  if (loading || authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rosegold" />
      </div>
    );
  }

  return (
    <PageTransition className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="font-serif text-5xl mb-4 text-charcoal">My Wardrobe</h1>
          <p className="text-charcoal/60 font-light max-w-xl">
            Your saved curations, personalized lookbooks, and AI rewear suggestions.
          </p>
        </div>
        {wardrobe.length > 0 && (
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center px-6 py-3 bg-charcoal text-ivory rounded-none hover:bg-charcoal/90 transition-colors uppercase tracking-widest text-xs font-medium"
          >
            Generate New Look
          </a>
        )}
      </div>

      {wardrobe.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-sand/30 bg-white/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mb-6">
            <span className="font-serif italic text-2xl text-charcoal/40">W</span>
          </div>
          <h2 className="font-serif text-2xl text-charcoal mb-2">Your Wardrobe is Empty</h2>
          <p className="text-charcoal/50 mb-8 max-w-md text-center font-light">
            Generate outfits and save your favorite looks to build your digital luxury wardrobe.
          </p>
          <a 
            href="/onboarding" 
            className="text-sm uppercase tracking-widest text-rosegold hover:text-charcoal transition-colors underline underline-offset-4"
          >
            Generate a Look
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {wardrobe.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white border border-sand/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => removeOutfit(item.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from Wardrobe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="relative w-full aspect-[4/5] bg-sand/20">
                  <Image
                    src={getImageUrl(item.gender, item.styleKey)}
                    alt="Saved Outfit"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex h-4 w-full rounded-sm overflow-hidden mb-4">
                    {item.palette.map((color, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} title={color.name} />
                    ))}
                  </div>
                  <h3 className="font-serif text-lg text-charcoal mb-2 line-clamp-1">{item.outfit.top} & {item.outfit.bottom}</h3>
                  <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-4">
                    {new Date(item.savedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-charcoal/70 text-sm line-clamp-3 font-light mb-4">
                    {item.explanation}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </PageTransition>
  );
}
