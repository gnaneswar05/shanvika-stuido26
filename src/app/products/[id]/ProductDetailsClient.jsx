"use client";

import React, { useState, useEffect } from "react";
import { Heart, Star, Share2, Phone, Sparkles, Check, ChevronRight, MessageSquareText, Shield, Info, QrCode } from "lucide-react";
import ThreeSixtyViewer from "@/components/ThreeSixtyViewer";
import PincodeChecker from "@/components/PincodeChecker";
import VisitorCount from "@/components/VisitorCount";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailsClient({ product, settings }) {
  const [selectedSizeObj, setSelectedSizeObj] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // description, fabric, care
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?product=${product._id}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data);
      }
    } catch (e) {
      console.error("Failed to load reviews", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product._id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      
      // Track Analytics View Event
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "view",
          targetId: product.slug,
          device: window.innerWidth < 768 ? "mobile" : "desktop",
        }),
      }).catch(err => console.error("Analytics view logging failed:", err));
    }

    // Set default selectors
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSizeObj(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }

    // Check wishlist
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
  }, [product, product._id]);

  const handleToggleWishlist = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let updated;
      
      if (inWishlist) {
        updated = stored.filter((item) => item._id !== product._id);
      } else {
        updated = [...stored, product];
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      setInWishlist(!inWishlist);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  // Price calculations
  const basePrice = product.basePrice;
  const sizeAdjustment = selectedSizeObj ? selectedSizeObj.priceAdjustment : 0;
  const unitPrice = basePrice + sizeAdjustment;
  const totalPrice = unitPrice * quantity;
  const originalPrice = product.originalPrice ? product.originalPrice + sizeAdjustment : null;

  // WhatsApp order text generation
  const handleWhatsAppOrder = () => {
    // Record analytics click
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "whatsapp_click",
        targetId: product.slug,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
      }),
    }).catch(err => console.error(err));

    const cleanNum = settings.whatsappNumber.replace(/[^\d+]/g, "");
    
    const text = `Hello Shanvika Studio, I would like to place an order for this designer outfit:

👑 *${product.name}*
📏 Size: ${selectedSizeObj ? selectedSizeObj.size : "Not specified"}
🎨 Color: ${selectedColor || "Default"}
🔢 Qty: ${quantity}
💰 Price: ₹${totalPrice.toLocaleString()} (₹${unitPrice.toLocaleString()} each)

🔗 Link: ${currentUrl}

Please confirm availability and sharing sizing options! Thank you.`;

    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-black text-white min-h-screen pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-widest mb-8">
          <a href="/" className="hover:text-white transition">Home</a>
          <ChevronRight className="h-3 w-3" />
          <a href="/products" className="hover:text-white transition">Shop</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#C5A059] font-medium line-clamp-1">{product.name}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
          
          {/* Column Left: Images Viewer */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Main Interactive Display Box */}
            <div className="relative w-full">
              {is360Mode ? (
                <ThreeSixtyViewer images={product.images} />
              ) : (
                <div className="relative aspect-[3/4] overflow-hidden rounded bg-[#121212] border border-neutral-900">
                  <img
                    src={product.images[activeImageIndex]}
                    alt={`${product.name} active display`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  
                  {product.originalPrice && (
                    <span className="absolute top-4 left-4 z-10 bg-red-650 text-white font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded shadow">
                      Limited Celebration Rate
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Controls & 360 Toggle Buttons */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {/* 360 mode button toggle */}
                <button
                  onClick={() => setIs360Mode(!is360Mode)}
                  className={`px-3 py-3 aspect-[3/4] shrink-0 border rounded text-[10px] tracking-wider uppercase font-semibold flex flex-col items-center justify-center gap-1.5 transition ${
                    is360Mode
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-neutral-950 text-neutral-400 border-neutral-850 hover:border-neutral-750"
                  }`}
                  style={{ width: "65px" }}
                >
                  <span className="text-sm font-bold">360°</span>
                  <span>Spin</span>
                </button>

                {/* Regular image thumbnails */}
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIs360Mode(false);
                      setActiveImageIndex(idx);
                    }}
                    className={`aspect-[3/4] shrink-0 rounded overflow-hidden border transition ${
                      !is360Mode && activeImageIndex === idx
                        ? "border-[#D4AF37] opacity-100 ring-1 ring-[#D4AF37]"
                        : "border-neutral-900 opacity-60 hover:opacity-100"
                    }`}
                    style={{ width: "65px" }}
                  >
                    <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column Right: Custom selectors */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">
                  {product.category?.name || "Boutique Wear"}
                </span>
                <span className="h-1 w-1 bg-[#D4AF37]/50 rounded-full"></span>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-light">
                  {product.fabric}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4.5xl font-light text-white tracking-wide leading-tight mb-3">
                {product.name}
              </h1>

              {/* Star Rating details */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.ratings || 5)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-neutral-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-neutral-300 font-semibold ml-1">
                    {product.ratings}
                  </span>
                </div>
                <span className="text-neutral-700">|</span>
                <span className="text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                  {product.reviewsCount} Moderated Reviews
                </span>
              </div>

              {/* Live viewers indicator */}
              <VisitorCount />

              {/* Dynamic Prices */}
              <div className="flex items-baseline gap-4 mt-6 mb-8 border-b border-neutral-900 pb-6">
                <span className="text-3xl font-light text-[#D4AF37] font-mono">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-lg text-neutral-600 line-through font-mono">
                    ₹{(originalPrice * quantity).toLocaleString()}
                  </span>
                )}
                {quantity > 1 && (
                  <span className="text-[10px] text-neutral-500 tracking-wider uppercase font-light">
                    (₹{unitPrice.toLocaleString()} each)
                  </span>
                )}
              </div>

              {/* Sizing dropdown selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                    <span>Select Sizing Option</span>
                    <button
                      onClick={() => {
                        alert("Size Guide:\nXS: Bust 32\" | Waist 26\"\nS: Bust 34\" | Waist 28\"\nM: Bust 36\" | Waist 30\"\nL: Bust 38\" | Waist 32\"\nXL: Bust 40\" | Waist 34\"\nXXL: Bust 42\" | Waist 36\"\nAll items include customizable styling parameters.");
                      }}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s._id}
                        onClick={() => setSelectedSizeObj(s)}
                        className={`px-4 py-2.5 text-xs font-semibold rounded border transition ${
                          selectedSizeObj?.size === s.size
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg"
                            : "bg-black text-neutral-300 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {s.size}
                        {s.priceAdjustment > 0 && ` (+₹${s.priceAdjustment})`}
                      </button>
                    ))}
                  </div>

                  {/* Stock counter helper */}
                  {selectedSizeObj && selectedSizeObj.stock <= 5 && selectedSizeObj.stock > 0 && (
                    <p className="text-[10px] text-red-400 mt-2 animate-pulse font-medium">
                      Hurry, only {selectedSizeObj.stock} left in this size!
                    </p>
                  )}
                  {selectedSizeObj && selectedSizeObj.stock === 0 && (
                    <p className="text-[10px] text-red-500 mt-2 font-medium">
                      Sold out in this size (contact support for bespoke orders).
                    </p>
                  )}
                </div>
              )}

              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                    Select Color Accent: <span className="text-white ml-1">{selectedColor}</span>
                  </span>
                  <div className="flex gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`h-8 w-8 rounded-full border transition flex items-center justify-center ${
                          selectedColor === c
                            ? "border-[#D4AF37] scale-110 shadow-lg"
                            : "border-neutral-900 hover:border-neutral-750"
                        }`}
                        style={{ backgroundColor: c.startsWith("#") ? c : "#888" }}
                        title={c}
                      >
                        {selectedColor === c && (
                          <Check className={`h-4.5 w-4.5 ${c === "#FFFFFF" || c === "#FFF" || c === "#F5F5DC" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity counter */}
              <div className="mb-8">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                  Order Quantity
                </span>
                <div className="flex items-center border border-neutral-800 rounded bg-black w-24">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    className="w-8 h-8 text-neutral-500 hover:text-white transition disabled:opacity-20 disabled:hover:text-neutral-500 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono text-xs text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 text-neutral-500 hover:text-white transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Primary: WhatsApp Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-gold-gradient hover:opacity-90 text-black font-semibold text-xs sm:text-sm tracking-wider uppercase py-4 px-6 rounded transition duration-300 flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(212,175,55,0.2)]"
                >
                  <MessageSquareText className="h-5 w-5 fill-current" /> Order on WhatsApp
                </button>

                {/* Secondary: Wishlist toggle */}
                <button
                  onClick={handleToggleWishlist}
                  className={`p-4 rounded border transition flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase font-semibold ${
                    inWishlist
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-black text-neutral-300 border-neutral-850 hover:border-neutral-750"
                  }`}
                >
                  <Heart className="h-5 w-5 fill-current" /> {inWishlist ? "Saved" : "Save Outwear"}
                </button>

                {/* Share Button (triggers QR/Link drawer) */}
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="p-4 rounded border border-neutral-850 bg-black text-neutral-300 hover:text-white hover:border-neutral-750 transition flex items-center justify-center"
                  title="Share product with friends"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Pincode Checker integration */}
              <PincodeChecker allowedPincodesRule={settings.allowedPincodes} />
            </div>

            {/* Custom fit / Fabric tabs */}
            <div className="mt-8 border-t border-neutral-900 pt-6">
              <div className="flex border-b border-neutral-900 text-xs font-semibold uppercase tracking-wider mb-4">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-2.5 pr-4 border-b-2 transition ${
                    activeTab === "description" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Garment details
                </button>
                <button
                  onClick={() => setActiveTab("fabric")}
                  className={`pb-2.5 px-4 border-b-2 transition ${
                    activeTab === "fabric" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Fabric details
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`pb-2.5 px-4 border-b-2 transition ${
                    activeTab === "care" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Wash care
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2.5 px-4 border-b-2 transition ${
                    activeTab === "reviews" ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  Reviews ({reviewsList.length})
                </button>
              </div>

              <div className="text-xs text-neutral-400 font-light leading-relaxed min-h-24">
                {activeTab === "description" && (
                  <div>
                    <p className="mb-4">{product.description}</p>
                    {product.details && product.details.length > 0 && (
                      <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === "fabric" && (
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Fabric specifications</h4>
                      <p>{product.fabric || "Premium luxury fabric sourced directly from certified heritage weaving centers."}</p>
                    </div>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-1">Laundering guidelines</h4>
                      <p>{product.washCare || "Professional Dry Clean Only. Iron on low settings with protective fabric layering."}</p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Reviews List */}
                    <div className="flex flex-col gap-4">
                      <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] border-b border-neutral-900 pb-2">
                        Verified customer feedback
                      </h4>
                      {reviewsList.length === 0 ? (
                        <p className="text-[10px] text-neutral-600 italic">No reviews have been verified for this outfit yet. Be the first to share your experience!</p>
                      ) : (
                        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                          {reviewsList.map((rev) => (
                            <div key={rev._id} className="bg-neutral-950 border border-neutral-900 p-4 rounded">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-semibold text-white text-[10px] tracking-wide">{rev.name}</span>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-800"}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-[11px] text-neutral-450 font-light leading-relaxed">"{rev.comment}"</p>
                              <span className="text-[9px] text-neutral-600 font-mono block mt-2">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Submit Review Form */}
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!reviewName.trim() || !reviewComment.trim()) return;
                        setSubmitting(true);
                        try {
                          const res = await fetch("/api/reviews", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              product: product._id,
                              name: reviewName,
                              rating: reviewRating,
                              comment: reviewComment,
                            }),
                          });
                          if (res.ok) {
                            setSubmitSuccess(true);
                            setReviewName("");
                            setReviewRating(5);
                            setReviewComment("");
                            setTimeout(() => setSubmitSuccess(false), 5000);
                            fetchReviews(); // reload review count
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setSubmitting(false);
                        }
                      }} 
                      className="bg-neutral-950 border border-neutral-900 p-5 rounded-lg flex flex-col gap-3.5 h-fit"
                    >
                      <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> Share Your Experience
                      </h4>
                      
                      {submitSuccess ? (
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] p-3 rounded text-[11px] font-light leading-relaxed animate-fade-in">
                          Thank you! Your feedback has been received and is currently being processed by the moderation queue. It will render publicly once verified.
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[9px] uppercase text-neutral-500 font-semibold mb-1">Your Name</label>
                              <input
                                type="text"
                                required
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                className="w-full bg-black border border-neutral-900 focus:border-[#D4AF37] text-[11px] rounded px-3 py-2 text-white outline-none font-mono"
                                placeholder="Enter name"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase text-neutral-500 font-semibold mb-1">Rating</label>
                              <div className="flex items-center gap-1 h-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className="p-1 hover:scale-110 transition"
                                  >
                                    <Star className={`h-4.5 w-4.5 ${star <= reviewRating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-800"}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase text-neutral-500 font-semibold mb-1">Comment</label>
                            <textarea
                              required
                              rows={3}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              className="w-full bg-black border border-neutral-900 focus:border-[#D4AF37] text-[11px] rounded px-3 py-2 text-white outline-none resize-none leading-relaxed"
                              placeholder="Share your experience with this garment..."
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="bg-gold-gradient text-black font-semibold text-[10px] tracking-wider uppercase py-2.5 rounded hover:opacity-95 transition disabled:opacity-50 mt-1"
                          >
                            {submitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Complete the Look section */}
        {product.completeTheLook && product.completeTheLook.length > 0 && (
          <div className="mt-20 border-t border-neutral-900 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Style Synergy</span>
              <h2 className="font-serif text-2.5xl sm:text-3.5xl text-white tracking-wide mt-1">Complete the Look</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.completeTheLook.map((look) => (
                <ProductCard key={look._id} product={look} />
              ))}
            </div>
          </div>
        )}

        {/* Frequently Bought Together section */}
        {product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0 && (
          <div className="mt-16 border-t border-neutral-900 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Privilege Bundles</span>
              <h2 className="font-serif text-2.5xl sm:text-3.5xl text-white tracking-wide mt-1">Frequently Bought Together</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.frequentlyBoughtTogether.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Share drawer overlay modal (QR Scanner & Copy Link) */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShareModalOpen(false)}></div>
          
          <div className="relative glass-card border border-[#D4AF37]/30 bg-black/95 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up z-10">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              &times;
            </button>

            <QrCode className="h-6 w-6 text-[#D4AF37] mx-auto mb-2" />
            <h3 className="font-serif text-lg text-white mb-2">Scan & Share Outwear</h3>
            <p className="text-[10px] text-neutral-400 font-light mb-6">
              Scan this code using your phone camera to open this royal garment page instantly on your mobile device for easy WhatsApp sharing.
            </p>

            {/* QR Image API */}
            <div className="bg-white p-3 rounded w-44 h-44 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
                alt="QR Code to scan"
                className="w-full h-full"
              />
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUrl);
                alert("Product link copied to clipboard!");
              }}
              className="w-full bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase py-2.5 rounded transition hover:opacity-90"
            >
              Copy Page Link
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
