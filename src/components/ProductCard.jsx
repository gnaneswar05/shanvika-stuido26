"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    // Check if in wishlist
    const checkWishlist = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setInWishlist(stored.some((item) => item._id === product._id));
      } catch (e) {
        setInWishlist(false);
      }
    };
    
    checkWishlist();
    window.addEventListener("wishlistUpdated", checkWishlist);
    return () => window.removeEventListener("wishlistUpdated", checkWishlist);
  }, [product._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let updated;
      
      if (inWishlist) {
        updated = stored.filter((item) => item._id !== product._id);
      } else {
        updated = [...stored, product];
        
        // Log analytics event for wishlist addition
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "wishlist_add",
            targetId: product.slug,
            device: window.innerWidth < 768 ? "mobile" : "desktop",
          }),
        }).catch(err => console.error("Wishlist analytics error:", err));
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      setInWishlist(!inWishlist);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  const currentPrice = product.basePrice;
  const originalPrice = product.originalPrice;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="group relative bg-neutral-950 border border-neutral-900 rounded p-3.5 transition duration-300 hover:border-[#D4AF37]/35 flex flex-col justify-between shadow-lg">
      
      {/* Visual container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-neutral-900 mb-4 zoom-container">
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-20 bg-red-650 text-white font-bold text-[8px] tracking-widest uppercase px-2 py-0.5 rounded shadow">
            -{discount}% Drop
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition shadow ${
            inWishlist 
              ? "bg-[#D4AF37] text-black" 
              : "bg-black/40 text-neutral-300 hover:text-[#D4AF37] hover:bg-black/60"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="h-4.5 w-4.5 fill-current" />
        </button>

        {/* Product image link */}
        <Link href={`/products/${product.slug}`} className="w-full h-full block">
          <img
            src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Info content */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[9px] tracking-widest uppercase text-neutral-500 font-semibold font-sans">
            {product.category?.name || "Premium Wear"}
          </span>
          
          <div className="flex items-center gap-0.5 text-neutral-400 font-mono text-[9px] font-medium">
            <Star className="h-2.5 w-2.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>{product.ratings || 5}</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-sm text-white hover:text-[#D4AF37] transition font-medium tracking-wide line-clamp-2 min-h-10 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2.5 mt-3 pt-2 border-t border-neutral-900">
          <span className="text-sm font-semibold text-[#D4AF37] font-mono">
            ₹{currentPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-xs text-neutral-600 line-through font-mono">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
    </div>
  );
}
