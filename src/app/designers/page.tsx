"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const DESIGNERS = [
  {
    id: 1,
    name: "Elena Rostova",
    specialty: "Avant-Garde & Minimalist",
    location: "Milan, Italy",
    price: "$$$",
    rating: 4.9,
    reviews: 124,
    imageColor: "#EAE3D2",
    description: "Creating architectural silhouettes that respect the natural lines of the body."
  },
  {
    id: 2,
    name: "Julian Hayes",
    specialty: "Classic Menswear & Tailoring",
    location: "London, UK",
    price: "$$$$",
    rating: 5.0,
    reviews: 89,
    imageColor: "#2C2C2C",
    description: "Bespoke tailoring focused on sustainable luxury fabrics and timeless cuts."
  },
  {
    id: 3,
    name: "Sofia Lin",
    specialty: "Contemporary Boho & Resort",
    location: "Los Angeles, CA",
    price: "$$",
    rating: 4.8,
    reviews: 210,
    imageColor: "#B76E79",
    description: "Effortless elegance designed for movement, comfort, and striking visual impact."
  }
];

export default function DesignersPage() {
  return (
    <PageTransition className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="font-serif text-5xl mb-4 text-charcoal">The Atelier</h1>
          <p className="text-charcoal/60 font-light max-w-xl">
            Connect with world-class stylists and designers for bespoke lookbooks, 
            custom pieces, and one-on-one style sessions.
          </p>
        </div>
        <div className="flex gap-4">
          <select className="border-b border-sand bg-transparent pb-2 text-sm uppercase tracking-wider focus:outline-none focus:border-rosegold text-charcoal/80">
            <option>All Styles</option>
            <option>Minimalist</option>
            <option>Avant-Garde</option>
            <option>Classic</option>
          </select>
          <select className="border-b border-sand bg-transparent pb-2 text-sm uppercase tracking-wider focus:outline-none focus:border-rosegold text-charcoal/80">
            <option>Any Price</option>
            <option>$$</option>
            <option>$$$</option>
            <option>$$$$</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DESIGNERS.map((designer, idx) => (
          <motion.div
            key={designer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div 
              className="w-full aspect-[3/4] mb-6 overflow-hidden relative border border-sand/30 bg-sand/10"
              style={{ backgroundColor: designer.imageColor }}
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <Button className="w-full bg-white/90 text-charcoal hover:bg-white">
                  Book Session
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-serif text-2xl text-charcoal">{designer.name}</h3>
              <div className="flex items-center text-sm text-charcoal/80">
                <Star className="w-4 h-4 text-rosegold fill-rosegold mr-1" />
                {designer.rating}
              </div>
            </div>
            
            <div className="flex items-center text-xs tracking-widest uppercase text-charcoal/50 mb-4">
              <MapPin className="w-3 h-3 mr-1" /> {designer.location} <span className="mx-2">•</span> {designer.price}
            </div>
            
            <p className="text-sm text-charcoal/70 font-light leading-relaxed mb-4">
              {designer.description}
            </p>
            
            <div className="inline-block border border-sand px-3 py-1 text-xs uppercase tracking-wider text-charcoal/60">
              {designer.specialty}
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
