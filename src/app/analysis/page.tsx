"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw, Loader2 } from "lucide-react";

export default function AnalysisPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    season: string;
    description: string;
    bestColors: { hex: string; name: string }[];
    avoidColors: { hex: string; name: string }[];
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const analyzeFace = async () => {
    setAnalyzing(true);
    
    // Mock analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    stopCamera();
    
    // Mock result (e.g., Autumn)
    setResult({
      season: "True Autumn",
      description: "Your warm undertones and rich golden overtones categorize you as a True Autumn. You shine in rich, warm, earthy colors that reflect the changing leaves.",
      bestColors: [
        { hex: "#8B4513", name: "Rust" },
        { hex: "#556B2F", name: "Olive" },
        { hex: "#CD853F", name: "Terracotta" },
        { hex: "#DAA520", name: "Mustard" },
        { hex: "#800000", name: "Mahogany" }
      ],
      avoidColors: [
        { hex: "#E6E6FA", name: "Icy Lavender" },
        { hex: "#00FFFF", name: "Bright Cyan" },
        { hex: "#FF00FF", name: "Fuchsia" }
      ]
    });
    setAnalyzing(false);
  };

  return (
    <PageTransition className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl mb-4 text-charcoal">Color Intelligence</h1>
        <p className="text-charcoal/60 font-light max-w-2xl mx-auto">
          Discover the hues that elevate your natural radiance. Our AI analyzes your undertones to determine your perfect seasonal color palette.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 shadow-sm border border-sand/30 min-h-[500px]">
        <AnimatePresence mode="wait">
          {!result && !stream && !analyzing && (
            <motion.div 
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8"
            >
              <div className="w-24 h-24 rounded-full bg-sand/30 flex items-center justify-center">
                <Camera className="w-10 h-10 text-charcoal/40" />
              </div>
              <p className="text-charcoal/80 text-center max-w-md">
                Ensure you are in a well-lit room with natural lighting for the most accurate results.
              </p>
              <Button onClick={startCamera}>Enable Camera</Button>
            </motion.div>
          )}

          {stream && !analyzing && (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-full max-w-md aspect-[3/4] md:aspect-video rounded-t-full bg-charcoal overflow-hidden border-4 border-sand/30">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-[4px] border-rosegold/50 rounded-t-full rounded-b-[40%] scale-90 opacity-50 pointer-events-none"></div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                <Button onClick={analyzeFace}>Analyze Skin Tone</Button>
              </div>
            </motion.div>
          )}

          {analyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6"
            >
              <Loader2 className="w-12 h-12 text-rosegold animate-spin" />
              <div className="text-center">
                <p className="font-serif text-2xl text-charcoal mb-2">Analyzing Undertones</p>
                <p className="text-charcoal/50 font-light">Calibrating color profiles...</p>
              </div>
            </motion.div>
          )}

          {result && !analyzing && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-12"
            >
              <div className="text-center">
                <p className="text-rosegold uppercase tracking-widest text-sm mb-2">Your Profile</p>
                <h2 className="font-serif text-5xl text-charcoal mb-6">{result.season}</h2>
                <p className="text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-serif text-2xl mb-6 flex items-center">
                    Your Core Colors
                  </h3>
                  <div className="grid grid-cols-5 gap-2 h-32 mb-4">
                    {result.bestColors.map((color, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="rounded-t-full rounded-b-sm cursor-pointer hover:-translate-y-2 transition-transform shadow-sm relative group"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl mb-6">Colors to Avoid</h3>
                  <div className="grid grid-cols-3 gap-2 h-24 mb-4">
                    {result.avoidColors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-sm flex items-end justify-center pb-2 opacity-50 relative group"
                        style={{ backgroundColor: color.hex }}
                      >
                         <div className="absolute inset-0 bg-white/20 backdrop-grayscale"></div>
                         <span className="text-[10px] text-charcoal bg-white/80 px-2 py-0.5 rounded z-10 font-medium">
                           {color.name}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8 border-t border-sand/30">
                <Button variant="outline" onClick={() => setResult(null)} className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retake Analysis
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
