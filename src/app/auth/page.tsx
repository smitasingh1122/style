"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signUp, logIn } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await logIn(formData.email, formData.password);
        if (result.success && result.user) {
          setUser(result.user);
          router.push("/");
        } else {
          setError(result.error || "Login failed.");
        }
      } else {
        if (!formData.name.trim()) {
          setError("Please enter your name.");
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }
        const result = await signUp(formData.name, formData.email, formData.password);
        if (result.success && result.user) {
          setUser(result.user);
          router.push("/onboarding");
        } else {
          setError(result.error || "Sign up failed.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="flex-1 flex min-h-[80vh] relative overflow-hidden">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none hidden lg:block"
      >
        <Image
          src="/fashion-bg.png"
          alt="Fashion Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-transparent"></div>
      </motion.div>

      {/* Floating fashion particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {isMounted && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-rosegold/20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: -20,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: typeof window !== "undefined" ? window.innerHeight + 20 : 900,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo & Brand */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-rosegold" />
              <span className="text-xs uppercase tracking-[0.4em] text-rosegold font-medium">
                StyleSense AI
              </span>
              <Sparkles className="w-5 h-5 text-rosegold" />
            </motion.div>
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3">
              {isLogin ? "Welcome Back" : "Join the Studio"}
            </h1>
            <p className="text-charcoal/50 font-light">
              {isLogin
                ? "Sign in to access your personalized wardrobe"
                : "Create your account to start your style journey"}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-sand/40 shadow-xl shadow-charcoal/5 p-8 md:p-10">
            {/* Toggle tabs */}
            <div className="flex mb-8 border-b border-sand/30">
              <button
                onClick={() => switchMode()}
                className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-all duration-300 border-b-2 ${
                  isLogin
                    ? "border-rosegold text-charcoal font-medium"
                    : "border-transparent text-charcoal/40 hover:text-charcoal/60"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode()}
                className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-all duration-300 border-b-2 ${
                  !isLogin
                    ? "border-rosegold text-charcoal font-medium"
                    : "border-transparent text-charcoal/40 hover:text-charcoal/60"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200/60 text-red-600 text-sm font-light"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2 overflow-hidden"
                  >
                    <label className="text-xs tracking-widest text-charcoal/60 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="auth-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-b border-sand bg-transparent pb-3 text-lg focus:outline-none focus:border-rosegold transition-colors placeholder:text-charcoal/25 text-charcoal"
                      placeholder="Your full name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest text-charcoal/60 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  id="auth-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-b border-sand bg-transparent pb-3 text-lg focus:outline-none focus:border-rosegold transition-colors placeholder:text-charcoal/25 text-charcoal"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-widest text-charcoal/60 uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="auth-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-b border-sand bg-transparent pb-3 text-lg focus:outline-none focus:border-rosegold transition-colors placeholder:text-charcoal/25 text-charcoal pr-10"
                    placeholder={isLogin ? "Your password" : "Min. 6 characters"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-charcoal/30 hover:text-charcoal/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-4 h-14 bg-charcoal text-ivory uppercase tracking-widest text-sm font-medium hover:bg-rosegold transition-colors duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom text */}
            <p className="text-center text-charcoal/40 text-sm mt-8 font-light">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={switchMode}
                className="text-rosegold hover:text-charcoal transition-colors underline underline-offset-4"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="mt-8 h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}
