"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FlashSale({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.error("Flash sale settings failed to load", e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // If no end date is supplied, default to a rolling 48-hour marketing countdown
    const targetDate = endDate
      ? new Date(endDate).getTime()
      : new Date().getTime() + 48 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.isExpired) {
    return null;
  }

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <div className="relative border border-[#D4AF37]/30 bg-neutral-950 p-6 sm:p-10 rounded-xl max-w-5xl mx-auto my-12 overflow-hidden shadow-[0_10px_50px_rgba(212,175,55,0.08)]">
      
      {/* Background Accent glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D4AF37] opacity-[0.04] blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#D4AF37] opacity-[0.04] blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 z-10 relative">
        
        {/* Flash Sale Text info */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[#D4AF37] mb-2.5">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] font-semibold uppercase">
              Limited Luxury Offer
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3.5xl text-white tracking-wide mb-3">
            {settings?.flashSaleTitle || "Seasonal Splendor Flash Sale"}
          </h2>
          <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
            {settings?.flashSaleSubtitle || "Acquire handcrafted royal sarees and exquisite embroidered outfits at celebratory privilege pricing. Ends soon."}
          </p>
        </div>

        {/* Counter Display Cards */}
        <div className="flex items-center gap-3 sm:gap-4 select-none">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-14 sm:w-18 aspect-square flex items-center justify-center bg-black border border-neutral-900 rounded-lg text-lg sm:text-2xl font-mono font-bold text-[#D4AF37] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {formatNum(timeLeft.days)}
            </div>
            <span className="text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-medium">Days</span>
          </div>

          <span className="text-xl text-[#D4AF37] font-bold -mt-6">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-14 sm:w-18 aspect-square flex items-center justify-center bg-black border border-neutral-900 rounded-lg text-lg sm:text-2xl font-mono font-bold text-[#D4AF37] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {formatNum(timeLeft.hours)}
            </div>
            <span className="text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-medium">Hours</span>
          </div>

          <span className="text-xl text-[#D4AF37] font-bold -mt-6">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-14 sm:w-18 aspect-square flex items-center justify-center bg-black border border-neutral-900 rounded-lg text-lg sm:text-2xl font-mono font-bold text-[#D4AF37] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {formatNum(timeLeft.minutes)}
            </div>
            <span className="text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-medium">Mins</span>
          </div>

          <span className="text-xl text-[#D4AF37] font-bold -mt-6">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-14 sm:w-18 aspect-square flex items-center justify-center bg-black border border-neutral-900 rounded-lg text-lg sm:text-2xl font-mono font-bold text-red-500 shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-pulse">
              {formatNum(timeLeft.seconds)}
            </div>
            <span className="text-[9px] tracking-widest text-neutral-500 uppercase mt-2 font-medium">Secs</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex justify-center">
          <Link
            href="/products?isFlashSale=true"
            className="bg-white hover:bg-neutral-100 text-black font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
          >
            Claim Privilege{" "}
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
