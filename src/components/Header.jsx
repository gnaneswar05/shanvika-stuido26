"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Heart, Search, Menu, X, User, ShoppingBag } from "lucide-react";
import VoiceSearch from "./VoiceSearch";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Do not show header on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);

          // Update page title dynamically in browser DOM
          if (data.brandName) {
            document.title = `${data.brandName} | Luxury Ethnic Wear & Designer Outfits`;
          }

          // Update favicon links dynamically in browser DOM
          const logo = data.logoUrl || "/favicon.ico";
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.getElementsByTagName("head")[0].appendChild(link);
          }
          link.href = logo;

          let appleLink = document.querySelector("link[rel='apple-touch-icon']");
          if (!appleLink) {
            appleLink = document.createElement("link");
            appleLink.rel = "apple-touch-icon";
            document.getElementsByTagName("head")[0].appendChild(appleLink);
          }
          appleLink.href = logo;
        }
      } catch (e) {
        console.error("Header settings failed to load", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Initial wishlist count
    const updateWishlistCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(stored.length);
      } catch (e) {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();

    // Listen for storage events (wishlist added/removed from other pages)
    window.addEventListener("storage", updateWishlistCount);
    // Custom event for wishlist updates within the same window
    window.addEventListener("wishlistUpdated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    // Sync search input with URL search params
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleVoiceTranscript = (text) => {
    setSearchQuery(text);
    router.push(`/products?q=${encodeURIComponent(text.trim())}`);
    setSearchOpen(false);
  };

  const brandName = settings?.brandName || "Shanvika Studio";
  const nameParts = brandName.split(" ");
  const firstWord = nameParts[0] || "SHANVIKA";
  const restOfName = nameParts.slice(1).join(" ") || "STUDIO";

  return (
    <header className="sticky top-0 z-[9999] glass-nav w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-400 hover:text-white transition"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo Name & Icon */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              {settings?.logoUrl ? (
                <>
                  <img
                    src={settings.logoUrl}
                    alt="Shanvika Studio"
                    className="h-10 w-10 object-cover rounded-full border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-bold text-gold-gradient group-hover:opacity-90 transition duration-300">
                      {firstWord.toUpperCase()}
                    </span>
                    <span className="text-[7.5px] tracking-[0.55em] font-light uppercase text-[#C5A059] -mt-1 font-sans">
                      {restOfName.toUpperCase()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Luxury SVG Monogram */}
                  <div className="relative flex items-center justify-center h-10 w-10">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {/* Outer dash ring */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
                      {/* Inner solid ring */}
                      <circle cx="50" cy="50" r="41" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      {/* Stylized Royal S-Crown monogram */}
                      <path 
                        d="M 30,65 C 30,65 35,38 50,38 C 65,38 70,65 70,65 M 35,50 C 35,50 42,46 50,58 C 58,46 65,50 65,50 M 42,30 L 50,22 L 58,30" 
                        fill="none" 
                        stroke="#D4AF37" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      {/* Monogram letter S in middle */}
                      <path 
                        d="M 45,56 C 45,53 55,54 55,51 C 55,48 47,48 49,45 C 50,43 53,43 54,45" 
                        fill="none" 
                        stroke="#D4AF37" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                      />
                      {/* Crown gems */}
                      <circle cx="42" cy="29" r="1.5" fill="#D4AF37" />
                      <circle cx="50" cy="20" r="2" fill="#D4AF37" />
                      <circle cx="58" cy="29" r="1.5" fill="#D4AF37" />
                    </svg>
                  </div>
                  {/* Luxury Brand Text */}
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-bold text-gold-gradient group-hover:opacity-90 transition duration-300">
                      {firstWord.toUpperCase()}
                    </span>
                    <span className="text-[7.5px] tracking-[0.55em] font-light uppercase text-[#C5A059] -mt-1 font-sans">
                      {restOfName.toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/products"
              className={`text-xs uppercase tracking-widest transition font-medium ${
                pathname === "/products" ? "text-[#D4AF37] font-semibold" : "text-neutral-300 hover:text-[#D4AF37]"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className={`text-xs uppercase tracking-widest transition font-medium ${
                pathname === "/categories" ? "text-[#D4AF37] font-semibold" : "text-neutral-300 hover:text-[#D4AF37]"
              }`}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={`text-xs uppercase tracking-widest transition font-medium ${
                pathname === "/about" ? "text-[#D4AF37] font-semibold" : "text-neutral-300 hover:text-[#D4AF37]"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-xs uppercase tracking-widest transition font-medium ${
                pathname === "/contact" ? "text-[#D4AF37] font-semibold" : "text-neutral-300 hover:text-[#D4AF37]"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className={`text-xs uppercase tracking-widest transition font-medium ${
                pathname === "/faq" ? "text-[#D4AF37] font-semibold" : "text-neutral-300 hover:text-[#D4AF37]"
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
            
            {/* Desktop Search Bar (Expandable) */}
            <div className="hidden lg:flex items-center gap-2 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-950/80 border border-neutral-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-xs rounded-full py-2 pl-4 pr-10 w-48 focus:w-64 transition-all duration-300 text-white placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#D4AF37] transition"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <VoiceSearch onTranscript={handleVoiceTranscript} />
            </div>

            {/* Mobile / Small Search Icon Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-[#D4AF37] transition"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2 text-neutral-300 hover:text-[#D4AF37] transition relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#D4AF37] text-black font-bold font-mono text-[9px] h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>


          </div>
        </div>

        {/* Mobile Search Expandable Area */}
        {searchOpen && (
          <div className="lg:hidden pb-4 px-2 animate-fade-in border-t border-[#D4AF37]/10 pt-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search royal wear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded-full py-2.5 pl-4 pr-10 w-full text-white placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] transition"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <VoiceSearch onTranscript={handleVoiceTranscript} />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999]"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Content Menu Panel */}
          <div 
            className="relative flex flex-col w-full max-w-xs border-r border-[#D4AF37]/20 p-6 shadow-2xl animate-slide-in"
            style={{ backgroundColor: "#000000", zIndex: 10000 }}
          >
            <div className="flex items-center justify-between mb-8">
              {settings?.logoUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={settings.logoUrl}
                    alt="Shanvika Studio Logo"
                    className="h-8 w-8 object-cover rounded-full border border-[#D4AF37]/50"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-sm tracking-wider font-bold text-gold-gradient">
                      {firstWord.toUpperCase()}
                    </span>
                    <span className="text-[6.5px] tracking-[0.45em] font-light uppercase text-[#C5A059] -mt-1 font-sans">
                      {restOfName.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 100 100" className="h-7 w-7">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
                    <circle cx="50" cy="50" r="41" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                    <path 
                      d="M 30,65 C 30,65 35,38 50,38 C 65,38 70,65 70,65 M 35,50 C 35,50 42,46 50,58 C 58,46 65,50 65,50 M 42,30 L 50,22 L 58,30" 
                      fill="none" 
                      stroke="#D4AF37" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M 45,56 C 45,53 55,54 55,51 C 55,48 47,48 49,45 C 50,43 53,43 54,45" 
                      fill="none" 
                      stroke="#D4AF37" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <circle cx="42" cy="29" r="1.5" fill="#D4AF37" />
                    <circle cx="50" cy="20" r="2" fill="#D4AF37" />
                    <circle cx="58" cy="29" r="1.5" fill="#D4AF37" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-serif text-sm tracking-wider font-bold text-gold-gradient">
                      {firstWord.toUpperCase()}
                    </span>
                    <span className="text-[6.5px] tracking-[0.45em] font-light uppercase text-[#C5A059] -mt-1 font-sans">
                      {restOfName.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-widest uppercase font-light border-b border-neutral-900 pb-2 transition-colors ${
                  pathname === "/products" ? "text-[#D4AF37] font-semibold border-[#D4AF37]/30" : "text-neutral-300 hover:text-[#D4AF37]"
                }`}
              >
                Shop catalog
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-widest uppercase font-light border-b border-neutral-900 pb-2 transition-colors ${
                  pathname === "/categories" ? "text-[#D4AF37] font-semibold border-[#D4AF37]/30" : "text-neutral-300 hover:text-[#D4AF37]"
                }`}
              >
                Collections
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-widest uppercase font-light border-b border-neutral-900 pb-2 transition-colors ${
                  pathname === "/about" ? "text-[#D4AF37] font-semibold border-[#D4AF37]/30" : "text-neutral-300 hover:text-[#D4AF37]"
                }`}
              >
                About Heritage
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-widest uppercase font-light border-b border-neutral-900 pb-2 transition-colors ${
                  pathname === "/contact" ? "text-[#D4AF37] font-semibold border-[#D4AF37]/30" : "text-neutral-300 hover:text-[#D4AF37]"
                }`}
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm tracking-widest uppercase font-light border-b border-neutral-900 pb-2 transition-colors ${
                  pathname === "/faq" ? "text-[#D4AF37] font-semibold border-[#D4AF37]/30" : "text-neutral-300 hover:text-[#D4AF37]"
                }`}
              >
                Help & FAQ
              </Link>
            </nav>

            <div className="mt-auto text-center border-t border-neutral-900 pt-6">
              <p className="text-[10px] text-neutral-500 font-light tracking-wide">
                Confidence in Every Outfit
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
