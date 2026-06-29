"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(stored);
      } catch (e) {
        setWishlist([]);
      }
    };
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const clearAll = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      localStorage.setItem("wishlist", "[]");
      setWishlist([]);
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="h-10 w-10 text-[#D4AF37] mx-auto mb-3 animate-pulse" />
          <h1 className="font-serif text-4xl text-white tracking-wide">My Saved Showcase</h1>
          <p className="text-xs text-neutral-400 font-light mt-2 max-w-sm mx-auto">
            Review and finalize your favored luxury coordinates before sending them to WhatsApp styling inquiries.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950/40 border border-neutral-900 rounded-xl p-10 max-w-xl mx-auto">
            <span className="text-4xl block mb-4">👑</span>
            <h3 className="font-serif text-lg text-white mb-2">Your showcase is empty</h3>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Acquire details of Banarasi sarees, hand-embroidered Anarkali suits or premium Co-ords, and save them here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded hover:opacity-90 transition duration-300"
            >
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div>
            {/* Clear All button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={clearAll}
                className="text-xs text-neutral-500 hover:text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Trash2 className="h-4 w-4" /> Clear All Items
              </button>
            </div>

            {/* Wishlist grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
