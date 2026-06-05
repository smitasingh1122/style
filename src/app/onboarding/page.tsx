"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";

type OnboardingData = {
  name: string;
  age: string;
  gender: string;
  bodyType: string;
  height: string;
  measurements: string;
  skinTone: string;
  undertone: string;
  stylePreferences: string;
  budget: string;
  avoid: string;
  occasion: string;
  season: string;
};

const STEPS = ["Personal", "Body", "Skin", "Style", "Occasion"];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: "",
    gender: "",
    bodyType: "",
    height: "",
    measurements: "",
    skinTone: "",
    undertone: "",
    stylePreferences: "",
    budget: "",
    avoid: "",
    occasion: "",
    season: "",
  });

  const updateForm = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      // Submit form and go to outfit generation
      localStorage.setItem("styleSenseProfile", JSON.stringify(formData));
      router.push("/outfit");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  return (
    <PageTransition className="flex-1 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl relative">
        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-sand -z-10"></div>
          {STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2 bg-ivory px-2">
              <div 
                className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                  idx <= currentStep ? "bg-rosegold" : "bg-sand"
                }`} 
              />
              <span className={`text-xs uppercase tracking-widest ${
                idx === currentStep ? "text-charcoal font-medium" : "text-charcoal/40"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 md:p-12 shadow-sm border border-sand/30 min-h-[400px] relative overflow-hidden flex flex-col">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              {currentStep === 0 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-3xl text-charcoal">Tell us about yourself</h2>
                  <p className="text-charcoal/60 font-light mb-4">Let's start with the basics to personalize your experience.</p>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                      placeholder="How should we call you?"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm tracking-wide text-charcoal/80 uppercase">Age</label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => updateForm("age", e.target.value)}
                        className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                        placeholder="e.g., 28"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm tracking-wide text-charcoal/80 uppercase">Gender Identity</label>
                      <input 
                        type="text" 
                        value={formData.gender}
                        onChange={(e) => updateForm("gender", e.target.value)}
                        className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                        placeholder="e.g., Female, Non-binary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-3xl text-charcoal">Your Silhouette</h2>
                  <p className="text-charcoal/60 font-light mb-4">Understanding your proportions helps us recommend the most flattering cuts.</p>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Body Type</label>
                    <select 
                      value={formData.bodyType}
                      onChange={(e) => updateForm("bodyType", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors appearance-none"
                    >
                      <option value="">Select your shape...</option>
                      <option value="hourglass">Hourglass</option>
                      <option value="pear">Pear / Triangle</option>
                      <option value="apple">Apple / Round</option>
                      <option value="rectangle">Rectangle / Straight</option>
                      <option value="inverted_triangle">Inverted Triangle</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm tracking-wide text-charcoal/80 uppercase">Height</label>
                      <input 
                        type="text" 
                        value={formData.height}
                        onChange={(e) => updateForm("height", e.target.value)}
                        className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                        placeholder="e.g., 5'6&quot; or 168cm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm tracking-wide text-charcoal/80 uppercase">Measurements (Opt)</label>
                      <input 
                        type="text" 
                        value={formData.measurements}
                        onChange={(e) => updateForm("measurements", e.target.value)}
                        className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                        placeholder="Bust/Waist/Hips"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-3xl text-charcoal">Color Profile</h2>
                  <p className="text-charcoal/60 font-light mb-4">Select your skin tone and undertone for perfect color matching.</p>
                  
                  <div className="flex flex-col gap-4">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Skin Tone Range</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'].map((tone) => (
                        <div 
                          key={tone}
                          onClick={() => updateForm("skinTone", tone.toLowerCase())}
                          className={`cursor-pointer py-3 text-center border transition-all ${
                            formData.skinTone === tone.toLowerCase() 
                              ? 'border-rosegold bg-rosegold/5' 
                              : 'border-sand hover:border-charcoal/30'
                          }`}
                        >
                          {tone}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Undertone</label>
                    <div className="flex gap-4">
                      {['Warm', 'Cool', 'Neutral'].map((ut) => (
                        <div 
                          key={ut}
                          onClick={() => updateForm("undertone", ut.toLowerCase())}
                          className={`flex-1 cursor-pointer py-3 text-center border transition-all ${
                            formData.undertone === ut.toLowerCase() 
                              ? 'border-rosegold bg-rosegold/5' 
                              : 'border-sand hover:border-charcoal/30'
                          }`}
                        >
                          {ut}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-3xl text-charcoal">Style Preferences</h2>
                  <p className="text-charcoal/60 font-light mb-4">What speaks to you? Tell us what you love and what to avoid.</p>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Vibe / Style</label>
                    <input 
                      type="text" 
                      value={formData.stylePreferences}
                      onChange={(e) => updateForm("stylePreferences", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                      placeholder="e.g., Minimalist, Boho, Streetwear, Classic..."
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Budget Range</label>
                    <select 
                      value={formData.budget}
                      onChange={(e) => updateForm("budget", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors appearance-none"
                    >
                      <option value="">Select budget...</option>
                      <option value="accessible">Accessible (High street)</option>
                      <option value="mid-range">Mid-range (Contemporary)</option>
                      <option value="luxury">Luxury (Designer)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Avoid List (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.avoid}
                      onChange={(e) => updateForm("avoid", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                      placeholder="e.g., Polka dots, Yellow, Wool..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-serif text-3xl text-charcoal">The Occasion</h2>
                  <p className="text-charcoal/60 font-light mb-4">What are we dressing for today?</p>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Event / Occasion</label>
                    <input 
                      type="text" 
                      value={formData.occasion}
                      onChange={(e) => updateForm("occasion", e.target.value)}
                      className="border-b border-sand bg-transparent pb-2 text-lg focus:outline-none focus:border-rosegold transition-colors"
                      placeholder="e.g., Summer Wedding, Job Interview, Date Night..."
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-4">
                    <label className="text-sm tracking-wide text-charcoal/80 uppercase">Season</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
                        <div 
                          key={season}
                          onClick={() => updateForm("season", season.toLowerCase())}
                          className={`cursor-pointer py-4 text-center border transition-all ${
                            formData.season === season.toLowerCase() 
                              ? 'border-rosegold bg-rosegold/5' 
                              : 'border-sand hover:border-charcoal/30'
                          }`}
                        >
                          {season}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between pt-8 border-t border-sand/30">
            {currentStep > 0 ? (
              <Button variant="ghost" onClick={handlePrev}>Back</Button>
            ) : (
              <div></div>
            )}
            
            <Button onClick={handleNext}>
              {currentStep === STEPS.length - 1 ? "Generate Outfit" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
