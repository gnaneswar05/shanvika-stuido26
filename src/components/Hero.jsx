"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600",
    title: "The Royal Heritage",
    subtitle: "Exquisite Gold Zari Banarasi & Kanjeevaram Sarees",
    description: "Experience handcrafted fabrics woven by master artisans, expressing true timeless elegance.",
    link: "/products?category=royal-sarees",
    cta: "Explore Heritage"
  },
  {
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1600",
    title: "Bridal Opulence",
    subtitle: "Showstopping Heavy Hand-Embroidered Lehengas",
    description: "Meticulous gota patti and zardozi detailing designed to make your special moments unforgettable.",
    link: "/products?category=designer-lehengas",
    cta: "View Collection"
  },
  {
    image: "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=1600",
    title: "Modern Contours",
    subtitle: "Minimalist Premium Silk Co-ords & Suits",
    description: "Tailored structures and fluid premium blends for the modern luxury lifestyle.",
    link: "/products?category=premium-co-ords",
    cta: "Shop Modern"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[85vh] overflow-hidden bg-black">
      
      {/* Slides mapping */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Dark Overlay tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/85 z-10" />
          
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
            style={{ transform: idx === current ? "scale(1)" : "scale(1.05)" }}
          />

          {/* Slide Description content overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.4em] uppercase text-[#D4AF37] mb-3 block animate-fade-in">
                {slide.title}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6.5xl font-light tracking-wide text-white mb-4 max-w-3xl mx-auto leading-tight animate-slide-up">
                {slide.subtitle}
              </h1>
              
              <p className="text-xs sm:text-sm font-light text-neutral-300 max-w-xl mx-auto mb-8 leading-relaxed">
                {slide.description}
              </p>

              <div className="flex justify-center gap-4">
                <Link
                  href={slide.link}
                  className="bg-gold-gradient text-black font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3 rounded hover:opacity-90 transition duration-300 flex items-center gap-2 group shadow-[0_4px_25px_rgba(212,175,55,0.25)]"
                >
                  {slide.cta}{" "}
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-black/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-white transition duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-black/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-white transition duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators progress bar */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 transition-all duration-500 rounded-full ${
              idx === current ? "w-8 bg-[#D4AF37]" : "w-2.5 bg-neutral-600"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
