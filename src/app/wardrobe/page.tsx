"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { motion } from "framer-motion";

export default function WardrobePage() {
  return (
    <PageTransition className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl mb-4 text-charcoal">My Wardrobe</h1>
        <p className="text-charcoal/60 font-light max-w-xl mx-auto">
          Your saved curations, personalized lookbooks, and AI rewear suggestions.
        </p>
      </div>

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
    </PageTransition>
  );
}
