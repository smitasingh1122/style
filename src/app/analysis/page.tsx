"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw, Loader2, Sparkles, Gem, Palette, ChevronRight } from "lucide-react";

type AnalysisResult = {
  season: string;
  subSeason: string;
  description: string;
  characteristics: string[];
  bestColors: { hex: string; name: string }[];
  avoidColors: { hex: string; name: string }[];
  metalRecommendation: string;
  tips: string[];
};

export default function AnalysisPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check your browser permissions and try again.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const analyzeFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setAnalyzing(true);
    setAnalyzeProgress(0);
    setError("");

    // Capture frame from video
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    // Save captured image for display
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.8));
    
    // Extract center region (face area — center 40% of the frame)
    const centerX = Math.floor(canvas.width * 0.3);
    const centerY = Math.floor(canvas.height * 0.2);
    const regionW = Math.floor(canvas.width * 0.4);
    const regionH = Math.floor(canvas.height * 0.5);
    
    const imageData = ctx.getImageData(centerX, centerY, regionW, regionH);
    const pixels = Array.from(imageData.data);

    stopCamera();

    // Animate progress
    const progressInterval = setInterval(() => {
      setAnalyzeProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const res = await fetch("/api/analyze-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: pixels }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      
      const text = await res.text();
      if (!text) throw new Error("Empty response");
      
      const data = JSON.parse(text) as AnalysisResult;
      
      clearInterval(progressInterval);
      setAnalyzeProgress(100);
      
      // Brief pause for the progress bar to reach 100
      await new Promise(r => setTimeout(r, 400));
      
      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Analysis failed. Please try again with better lighting.");
      clearInterval(progressInterval);
    } finally {
      setAnalyzing(false);
      setAnalyzeProgress(0);
    }
  };

  const retake = () => {
    setResult(null);
    setCapturedImage(null);
    setError("");
  };

  return (
    <PageTransition className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Palette className="w-5 h-5 text-rosegold" />
          <span className="text-xs uppercase tracking-[0.3em] text-rosegold font-medium">AI-Powered</span>
        </motion.div>
        <h1 className="font-serif text-5xl mb-4 text-charcoal">Color Intelligence</h1>
        <p className="text-charcoal/60 font-light max-w-2xl mx-auto">
          Discover the hues that elevate your natural radiance. Our AI analyzes your skin&apos;s undertones 
          from a live camera capture to determine your perfect seasonal color palette.
        </p>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white p-8 md:p-12 shadow-sm border border-sand/30 min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* --- START SCREEN --- */}
          {!result && !stream && !analyzing && !error && (
            <motion.div 
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-rosegold/20 to-sand/40 flex items-center justify-center shadow-lg"
              >
                <Camera className="w-12 h-12 text-rosegold/70" />
              </motion.div>
              <div className="text-center max-w-md">
                <h3 className="font-serif text-2xl text-charcoal mb-3">Ready for Your Analysis?</h3>
                <p className="text-charcoal/60 font-light leading-relaxed">
                  Position yourself in a well-lit room with natural lighting. 
                  Remove glasses and ensure your face is clearly visible for the most accurate results.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Button onClick={startCamera} className="px-8">
                  <Camera className="w-4 h-4 mr-2" /> Enable Camera
                </Button>
                <p className="text-xs text-charcoal/40">Your camera feed is analyzed locally and never stored.</p>
              </div>
            </motion.div>
          )}

          {/* --- ERROR SCREEN --- */}
          {error && !analyzing && !result && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-500 text-center max-w-md">{error}</p>
              <Button onClick={() => { setError(""); startCamera(); }}>Try Again</Button>
            </motion.div>
          )}

          {/* --- CAMERA FEED --- */}
          {stream && !analyzing && (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-full max-w-md aspect-[3/4] bg-charcoal overflow-hidden border-4 border-sand/30" style={{ borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%" }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                {/* Face guide overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[65%] border-2 border-rosegold/40 rounded-full" />
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="bg-charcoal/70 text-ivory text-xs px-3 py-1 rounded-full">
                      Center your face within the oval
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                <Button onClick={analyzeFace}>
                  <Sparkles className="w-4 h-4 mr-2" /> Analyze My Colors
                </Button>
              </div>
            </motion.div>
          )}

          {/* --- ANALYZING --- */}
          {analyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8"
            >
              {capturedImage && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rosegold/30 shadow-lg">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-rosegold animate-spin mx-auto mb-4" />
                <p className="font-serif text-2xl text-charcoal mb-2">Analyzing Your Undertones</p>
                <p className="text-charcoal/50 font-light">Detecting skin tone, warmth, and depth...</p>
              </div>
              {/* Progress bar */}
              <div className="w-full max-w-sm">
                <div className="h-1 bg-sand/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-rosegold to-rosegold/60 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(analyzeProgress, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* --- RESULTS --- */}
          {result && !analyzing && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-12"
            >
              {/* Season Header */}
              <div className="text-center">
                {capturedImage && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-rosegold/30 shadow-lg mx-auto mb-6"
                  >
                    <img src={capturedImage} alt="Your photo" className="w-full h-full object-cover" />
                  </motion.div>
                )}
                <p className="text-rosegold uppercase tracking-widest text-sm mb-2">Your Color Season</p>
                <h2 className="font-serif text-5xl text-charcoal mb-6">{result.season}</h2>
                <p className="text-charcoal/70 max-w-2xl mx-auto leading-relaxed font-light">
                  {result.description}
                </p>
              </div>

              {/* Characteristics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-sand/10 p-6 border border-sand/20"
              >
                <h3 className="font-serif text-xl mb-4 text-charcoal">Your Characteristics</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.characteristics.map((char, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-charcoal/70 font-light">
                      <ChevronRight className="w-4 h-4 text-rosegold mt-0.5 flex-shrink-0" />
                      {char}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Colors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-serif text-2xl mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rosegold" /> Your Power Colors
                  </h3>
                  <div className="grid grid-cols-5 gap-2 h-36 mb-6">
                    {result.bestColors.map((color, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        key={idx} 
                        className="rounded-t-full rounded-b-sm cursor-pointer hover:-translate-y-2 transition-transform shadow-md relative group"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium text-charcoal">
                          {color.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-serif text-2xl mb-6">Colors to Avoid</h3>
                  <div className="grid grid-cols-3 gap-2 h-28 mb-6">
                    {result.avoidColors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-sm flex items-end justify-center pb-2 opacity-60 relative group"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-grayscale"></div>
                        {/* X overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <div className="w-full h-px bg-white rotate-45 absolute" />
                          <div className="w-full h-px bg-white -rotate-45 absolute" />
                        </div>
                        <span className="text-[10px] text-charcoal bg-white/80 px-2 py-0.5 rounded z-10 font-medium">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Metal & Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-charcoal text-ivory p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="w-5 h-5 text-rosegold" />
                    <h3 className="font-serif text-xl">Your Metals</h3>
                  </div>
                  <p className="text-ivory/80 font-light leading-relaxed">{result.metalRecommendation}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-sand/10 p-6 border border-sand/20"
                >
                  <h3 className="font-serif text-xl mb-3">Pro Tips</h3>
                  <ul className="flex flex-col gap-2">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-charcoal/70 font-light text-sm">
                        <span className="text-rosegold font-bold mt-px">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Retake */}
              <div className="flex justify-center pt-8 border-t border-sand/30">
                <Button variant="outline" onClick={retake} className="flex items-center">
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
