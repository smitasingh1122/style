"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <PageTransition className="flex-1 flex flex-col">
      <section className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 relative overflow-hidden min-h-[80vh]">
        
        {/* Animated Fashion Background */}
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <Image
            src="/fashion-bg.png"
            alt="Fashion Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ivory/60 to-ivory"></div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-rosegold uppercase tracking-[0.3em] text-xs md:text-sm mb-6 font-medium"
          >
            Your Personal Stylist
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 text-charcoal"
          >
            Dressed for you.<br/>
            <span className="italic text-charcoal/80">Built for the moment.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base md:text-lg text-charcoal/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Experience luxury fashion styling driven by artificial intelligence. 
            Tailored to your body type, skin tone, and individual preferences.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button 
              size="lg" 
              onClick={() => router.push("/onboarding")}
              className="bg-charcoal text-ivory hover:bg-rosegold hover:text-white transition-colors duration-500"
            >
              Begin Your Styling Experience
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Decorative asymmetric imagery placeholders for the magazine feel */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] w-full rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden bg-sand/30 shadow-2xl"
          >
             <Image
               src="/editorial.png"
               alt="Editorial Fashion"
               fill
               className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
             />
             <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/10 rounded-tr-[5rem] rounded-bl-[5rem] pointer-events-none"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-md"
          >
            <h2 className="font-serif text-4xl mb-6">More Than Just Clothes</h2>
            <p className="text-charcoal/70 leading-relaxed mb-8 font-light text-lg">
              We analyze your unique proportions and undertones to curate outfits that flatter 
              your natural silhouette. Every recommendation comes with a detailed explanation 
              of why it works specifically for you.
            </p>
            <Button variant="outline" onClick={() => router.push("/analysis")}>
              Try Color Analysis
            </Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
