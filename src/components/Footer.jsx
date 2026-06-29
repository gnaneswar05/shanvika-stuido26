"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.error("Footer settings failed to load", e);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Footer categories failed to load", e);
      }
    };
    fetchSettings();
    fetchCategories();
  }, []);

  // Do not show footer on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const brandName = settings?.brandName || "Shanvika Studio";
  const nameParts = brandName.split(" ");
  const firstWord = nameParts[0] || "SHANVIKA";
  const restOfName = nameParts.slice(1).join(" ") || "STUDIO";

  return (
    <footer className="bg-neutral-950 border-t border-[#D4AF37]/10 pt-16 pb-8 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              {settings?.logoUrl ? (
                <>
                  <img
                    src={settings.logoUrl}
                    alt="Shanvika Studio"
                    className="h-10 w-10 object-cover rounded-full border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-bold text-gold-gradient transition duration-300">
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
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-bold text-gold-gradient transition duration-300">
                      {firstWord.toUpperCase()}
                    </span>
                    <span className="text-[7.5px] tracking-[0.55em] font-light uppercase text-[#C5A059] -mt-1 font-sans">
                      {restOfName.toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-xs font-light leading-relaxed text-neutral-500 mt-2">
              Crafting premium luxury garments designed to inspire true confidence. Expressing heritage and elegance in every weave.
            </p>
            <p className="text-xs font-serif italic text-[#C5A059] mt-1">
              "{settings?.slogan || "Confidence in Every Outfit"}"
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-sm tracking-wider uppercase font-semibold text-white mb-4">
              Collections
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-light">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link href={`/products?category=${cat.slug}`} className="hover:text-[#D4AF37] transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li>
                    <Link href="/products" className="hover:text-[#D4AF37] transition">
                      Shop All Catalog
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-[#D4AF37] transition">
                      Collections
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-sm tracking-wider uppercase font-semibold text-white mb-4">
              Information
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-light">
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D4AF37] transition">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-[#D4AF37] transition">
                  Store Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className="font-serif text-sm tracking-wider uppercase font-semibold text-white mb-4">
              Newsletter
            </h3>
            <p className="text-xs font-light leading-relaxed text-neutral-500 mb-4">
              Subscribe to unlock private sales, invitations to seasonal drops, and luxury catalogs.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2 text-white placeholder:text-neutral-700 transition"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs px-3 py-2 rounded transition-colors"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            {success && (
              <p className="text-[10px] text-emerald-400 mt-2">
                Thank you! Welcome to the inner circle of Shanvika Studio.
              </p>
            )}
          </div>
        </div>

        {/* Lower Footer */}
        <div className="border-t border-neutral-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-600 font-light">
          <p>&copy; {new Date().getFullYear()} Shanvika Studio. All rights reserved.</p>

          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition flex items-center gap-1.5"
            >
              {/* Instagram Custom SVG */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition flex items-center gap-1.5"
            >
              {/* Facebook Custom SVG */}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Facebook
            </a>
          </div>

          <p className="text-neutral-700">Handcrafted Luxury. Made with love.</p>
        </div>
      </div>
    </footer>
  );
}
