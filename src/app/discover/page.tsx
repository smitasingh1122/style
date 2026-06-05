"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function DiscoverPage() {
  return (
    <PageTransition className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12">
      <div className="mb-16 text-center">
        <h1 className="font-serif text-5xl mb-8 text-charcoal">Discover</h1>
        
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for 'Summer Wedding' or 'Corporate Minimalism'..."
            className="w-full bg-transparent border-b border-charcoal/20 pb-4 pl-12 text-lg focus:outline-none focus:border-rosegold transition-colors font-light"
          />
          <Search className="absolute left-2 top-1 text-charcoal/40 w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-[400px] bg-charcoal text-ivory p-12 flex flex-col justify-end group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
          <p className="text-rosegold uppercase tracking-widest text-xs mb-4 z-10">Curated Edit</p>
          <h2 className="font-serif text-4xl mb-4 z-10 group-hover:text-rosegold transition-colors">The Gala Collection</h2>
          <p className="font-light text-ivory/70 max-w-md z-10">Formalwear redefined for the modern aesthetic. Discover silhouettes that command attention.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="h-[400px] bg-sand text-charcoal p-12 flex flex-col justify-end group cursor-pointer relative overflow-hidden"
        >
          <p className="text-charcoal/50 uppercase tracking-widest text-xs mb-4 z-10">Trend Report</p>
          <h2 className="font-serif text-4xl mb-4 z-10">Quiet Luxury</h2>
          <p className="font-light text-charcoal/70 max-w-md z-10">Mastering the art of understated elegance through neutral palettes and premium textures.</p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
