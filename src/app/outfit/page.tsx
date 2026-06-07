"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Heart, RefreshCw, ExternalLink, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { getUserData, setUserData } from "@/lib/auth";
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

        // Auto-save to wardrobe
        const wardrobeRaw = getUserData("wardrobe");
        const wardrobe = wardrobeRaw ? JSON.parse(wardrobeRaw) : [];
        wardrobe.unshift({
          ...data,
          savedAt: new Date().toISOString(),
          id: `look_${Date.now()}`,
        });
        // Keep last 50 looks max
        if (wardrobe.length > 50) wardrobe.length = 50;
        setUserData("wardrobe", JSON.stringify(wardrobe));
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

      {/* Shop This Look Section */}
      {outfitData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-6 h-6 text-rosegold" />
            <h2 className="font-serif text-3xl text-charcoal">Shop This Look</h2>
          </div>
          <p className="text-charcoal/60 font-light mb-8">
            Find similar pieces on your favorite shopping platforms.
          </p>

          {/* Outfit items as shopping cards */}
          <div className="flex flex-col gap-6">
            {[
              { label: "Top", item: outfitData.outfit.top },
              { label: "Bottom", item: outfitData.outfit.bottom },
              { label: "Footwear", item: outfitData.outfit.footwear },
            ].map(({ label, item }) => {
              // Extract short search terms (first ~5 meaningful words)
              const searchQuery = item
                .replace(/^(A |An |The )/i, "")
                .split(" ")
                .slice(0, 6)
                .join(" ");
              const encoded = encodeURIComponent(searchQuery);

              const shops = [
                { name: "Amazon", icon: "🛒", url: `https://www.amazon.in/s?k=${encoded}`, color: "bg-[#FF9900]/10 hover:bg-[#FF9900]/20 border-[#FF9900]/30" },
                { name: "Myntra", icon: "👗", url: `https://www.myntra.com/${encoded.replace(/%20/g, "-")}`, color: "bg-[#FF3F6C]/10 hover:bg-[#FF3F6C]/20 border-[#FF3F6C]/30" },
                { name: "Ajio", icon: "🏷️", url: `https://www.ajio.com/search/?text=${encoded}`, color: "bg-[#3E3E56]/10 hover:bg-[#3E3E56]/20 border-[#3E3E56]/30" },
                { name: "Flipkart", icon: "🛍️", url: `https://www.flipkart.com/search?q=${encoded}`, color: "bg-[#2874F0]/10 hover:bg-[#2874F0]/20 border-[#2874F0]/30" },
                { name: "H&M", icon: "✨", url: `https://www2.hm.com/en_in/search-results.html?q=${encoded}`, color: "bg-[#E50010]/10 hover:bg-[#E50010]/20 border-[#E50010]/30" },
                { name: "Zara", icon: "🖤", url: `https://www.zara.com/in/en/search?searchTerm=${encoded}`, color: "bg-charcoal/5 hover:bg-charcoal/10 border-charcoal/20" },
              ];

              return (
                <div key={label} className="bg-white p-6 border border-sand/30 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-1">{label}</p>
                      <p className="text-charcoal font-medium">{item}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {shops.map((shop) => (
                      <a
                        key={shop.name}
                        href={shop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${shop.color} text-charcoal`}
                      >
                        <span>{shop.icon}</span>
                        {shop.name}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Accessories as a combined card */}
            <div className="bg-white p-6 border border-sand/30 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-3">Accessories</p>
              {outfitData.outfit.accessories.map((acc, idx) => {
                const searchQuery = acc
                  .replace(/^(A |An |The )/i, "")
                  .split(" ")
                  .slice(0, 5)
                  .join(" ");
                const encoded = encodeURIComponent(searchQuery);

                return (
                  <div key={idx} className={`${idx > 0 ? "mt-4 pt-4 border-t border-sand/20" : ""}`}>
                    <p className="text-charcoal font-medium mb-2 text-sm">{acc}</p>
                    <div className="flex flex-wrap gap-2">
                      <a href={`https://www.amazon.in/s?k=${encoded}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-[#FF9900]/10 hover:bg-[#FF9900]/20 border-[#FF9900]/30 text-charcoal transition-all">
                        🛒 Amazon <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                      <a href={`https://www.myntra.com/${encoded.replace(/%20/g, "-")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-[#FF3F6C]/10 hover:bg-[#FF3F6C]/20 border-[#FF3F6C]/30 text-charcoal transition-all">
                        👗 Myntra <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                      <a href={`https://www.ajio.com/search/?text=${encoded}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-[#3E3E56]/10 hover:bg-[#3E3E56]/20 border-[#3E3E56]/30 text-charcoal transition-all">
                        🏷️ Ajio <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                      <a href={`https://www.flipkart.com/search?q=${encoded}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-[#2874F0]/10 hover:bg-[#2874F0]/20 border-[#2874F0]/30 text-charcoal transition-all">
                        🛍️ Flipkart <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
}
