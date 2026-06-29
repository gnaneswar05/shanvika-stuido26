"use client";

import React, { useState, useRef } from "react";
import { RotateCw } from "lucide-react";

export default function ThreeSixtyViewer({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startIndexRef = useRef(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-neutral-900 flex items-center justify-center text-neutral-500">
        No Images Available
      </div>
    );
  }

  // If only one image, show it normally
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded bg-[#121212]">
        <img
          src={images[0]}
          alt="Product showcase"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const handleStart = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startIndexRef.current = currentIndex;
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;

    const deltaX = clientX - startXRef.current;
    
    // Sensitivity: how many pixels of drag change one image
    const sensitivity = 15; 
    const step = Math.floor(deltaX / sensitivity);

    // Calculate new index wrapping around
    const total = images.length;
    let nextIndex = (startIndexRef.current - step) % total;
    if (nextIndex < 0) {
      nextIndex += total;
    }

    setCurrentIndex(nextIndex);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    handleStart(e.clientX);
    e.preventDefault(); // prevent image ghost drag
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  // Touch handlers (Mobile support)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      className="relative w-full aspect-[3/4] overflow-hidden rounded bg-[#121212] select-none cursor-grab active:cursor-grabbing border border-neutral-900 group"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      {/* Product Image */}
      <img
        src={images[currentIndex]}
        alt={`Product rotation angle ${currentIndex + 1}`}
        className="w-full h-full object-cover pointer-events-none transition-all duration-100"
      />

      {/* 360 Premium Gold Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-[#D4AF37]/30 flex items-center gap-2 transition-all duration-300 group-hover:border-[#D4AF37] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <RotateCw className="h-4 w-4 text-[#D4AF37] animate-spin" style={{ animationDuration: "6s" }} />
        <span className="text-[10px] tracking-[0.2em] font-light uppercase text-[#C5A059]">
          360° VIEW &bull; DRAG TO ROTATE
        </span>
      </div>

      {/* Image index counter indicator */}
      <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded border border-white/5 text-[10px] text-neutral-400 font-mono">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
