"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "My Wardrobe", href: "/wardrobe" },
    { name: "Color Analysis", href: "/analysis" },
    { name: "Designers", href: "/designers" },
    { name: "Discover", href: "/discover" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-ivory/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="font-serif text-2xl tracking-wide text-charcoal">
          StyleSense<span className="text-rosegold text-4xl leading-[0]">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest text-charcoal/70 hover:text-charcoal transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {/* Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 h-10 px-4 border border-charcoal/15 hover:border-rosegold/50 transition-colors duration-300 bg-white/50 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-rosegold/15 flex items-center justify-center">
                  <span className="text-xs font-medium text-rosegold uppercase">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-charcoal/80 max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-sand/40 shadow-xl shadow-charcoal/5 py-2"
                  >
                    <div className="px-4 py-3 border-b border-sand/30">
                      <p className="text-sm font-medium text-charcoal truncate">{user.name}</p>
                      <p className="text-xs text-charcoal/50 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-charcoal/70 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth"
              className="h-10 px-6 flex items-center text-sm uppercase tracking-widest bg-charcoal text-ivory hover:bg-rosegold transition-colors duration-500"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-charcoal"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-ivory flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-6 right-6 text-charcoal p-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl text-charcoal"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile auth */}
              {isAuthenticated && user ? (
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-sand/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rosegold/15 flex items-center justify-center">
                      <span className="text-lg font-medium text-rosegold uppercase">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg text-charcoal">{user.name}</p>
                      <p className="text-sm text-charcoal/50">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl text-rosegold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
