"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquareText } from "lucide-react";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Do not show WhatsApp float on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const [whatsappNumber, setWhatsappNumber] = useState("+919876543210");

  useEffect(() => {
    // Fetch settings to get configured WhatsApp number
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.whatsappNumber) {
            // Clean number of spaces/special characters except +
            const cleanNum = data.whatsappNumber.replace(/[^\d+]/g, "");
            setWhatsappNumber(cleanNum);
          }
        }
      } catch (err) {
        console.error("Failed to load WhatsApp number:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleWhatsAppRedirect = () => {
    // Record click event in Analytics
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "whatsapp_click",
        targetId: "floating_button",
        device: window.innerWidth < 768 ? "mobile" : "desktop",
      }),
    }).catch(err => console.error("Error logging analytics:", err));

    const text = encodeURIComponent("Hello Shanvika Studio, I am visiting your website and would like to inquire about your collections!");
    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppRedirect}
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:scale-110 group flex items-center justify-center border border-emerald-500/30"
      title="Chat on WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full animate-ping-slow bg-emerald-500/40"></span>
      
      {/* Icon */}
      <svg
        viewBox="0 0 24 24"
        className="h-6.5 w-6.5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.01 14.12 1.01 11.49 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.682.448 3.318 1.3 4.761L1.925 21.05l5.59-1.466.132-.08zM17.842 14.62c-.314-.157-1.86-.92-2.148-1.025-.289-.105-.499-.157-.708.157-.208.314-.808 1.025-.99 1.235-.183.21-.366.236-.68.079-.314-.157-1.328-.49-2.529-1.562-.934-.834-1.564-1.865-1.747-2.179-.183-.314-.02-.484.137-.641.142-.142.314-.367.472-.55.157-.184.21-.314.314-.524.105-.21.052-.393-.026-.55-.079-.157-.708-1.705-.97-2.335-.255-.615-.515-.532-.708-.541-.184-.01-.393-.01-.603-.01s-.55.079-.838.393c-.289.314-1.101 1.077-1.101 2.625 0 1.548 1.127 3.044 1.284 3.254.157.21 2.219 3.39 5.378 4.755.751.325 1.337.519 1.795.665.756.24 1.444.207 1.988.126.607-.091 1.86-.761 2.122-1.46.262-.699.262-1.3.183-1.428-.079-.13-.289-.209-.603-.366z" />
      </svg>
      
      {/* Hover visual helper text */}
      <span className="absolute right-14 bg-black border border-emerald-500/30 text-white font-medium text-[10px] tracking-wider uppercase py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        WhatsApp Order Support
      </span>
    </button>
  );
}
