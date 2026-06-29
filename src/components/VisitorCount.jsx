"use client";

import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";

export default function VisitorCount() {
  const [count, setCount] = useState(12);

  useEffect(() => {
    // Generate initial random viewer count
    setCount(Math.floor(Math.random() * (22 - 8 + 1)) + 8);

    // Fluctuate count periodically
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        if (next < 5) return 5;
        if (next > 30) return 30;
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 mt-4 py-1.5 px-3 bg-neutral-950 border border-neutral-900 rounded-full w-fit">
      {/* Glowing Green Dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-[11px] text-neutral-400 font-medium">
        <span className="text-[#D4AF37] font-semibold font-mono">{count}</span> fashion lovers are looking at this item right now
      </span>
    </div>
  );
}
