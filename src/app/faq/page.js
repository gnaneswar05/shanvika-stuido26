"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

const faqData = [
  {
    category: "WhatsApp Ordering Process",
    items: [
      {
        question: "How do I order via WhatsApp?",
        answer: "Browse our catalog, select your preferred size and color accent, and click the 'Order on WhatsApp' button. This instantly generates a prefilled message containing the garment name, exact size, adjusted pricing, and link, opening a secure direct chat with our styling experts. They will confirm delivery details, customization requests, and payment coordinates."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We support major Credit/Debit Cards, UPI transfers, Net Banking, and Bank Wire transfers. All transaction receipts and invoice parameters are shared securely over WhatsApp once payment is finalized."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Since custom orders are hand-finished by our tailors based on your measurements, modifications or cancellations are only permitted within 12 hours of payment confirmation. Contact your assigned WhatsApp stylist immediately for help."
      }
    ]
  },
  {
    category: "Custom Fittings & Sizing",
    items: [
      {
        question: "How do I request bespoke fit measurements?",
        answer: "When checking out via WhatsApp, share your exact measurements (Bust, Waist, Hip, Shoulder Width, Sleeve Length, Tunic/Pants Length). Our stylists will document these parameters, and our tailoring masters will handcraft the garment according to your silhouette."
      },
      {
        question: "Is there an extra charge for custom fitting?",
        answer: "Standard minor adjustments (like hem lines or minor adjustments to sleeve lengths) are free of charge. Complete reconstruction or custom plus-sizing options (XXL+) may require a nominal fabric customization charge, which is calculated and shared by your stylist beforehand."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "What is your shipping policy?",
        answer: "We ship worldwide. We offer free express shipping across India on orders above ₹3000. Orders below this threshold incur a standard shipping charge of ₹150. International shipping fees are calculated based on weight and destination."
      },
      {
        question: "How long does delivery take?",
        answer: "In-stock items ship within 24 hours and take 2-4 days to reach major metro areas. Custom tailored garments take 5-9 working days of craft time. Tracking details are sent to you via SMS and WhatsApp once the package is dispatched."
      },
      {
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Due to the customized nature of our luxury ethnic coordinates, we only accept prepaid orders. This ensures our artisans are paid for their dedicated craft hours before fabrication begins."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleAccordion = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndexes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      
      {/* Title */}
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
        <span className="text-[10px] tracking-[0.4em] font-semibold text-[#D4AF37] uppercase mb-2 block">
          Client Care
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-wide">
          Help & Frequently Asked Queries
        </h1>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {faqData.map((cat, catIdx) => (
          <div key={catIdx} className="mb-12">
            
            {/* Category header */}
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-900 pb-2">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg text-white uppercase tracking-wider font-semibold">
                {cat.category}
              </h2>
            </div>

            {/* Accordion List */}
            <div className="flex flex-col gap-4">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isOpen = !!openIndexes[key];

                return (
                  <div 
                    key={itemIdx}
                    className="border border-neutral-900 bg-neutral-950/70 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleAccordion(catIdx, itemIdx)}
                      className="w-full flex items-center justify-between p-4 text-left font-serif text-xs sm:text-sm text-white hover:text-[#D4AF37] font-medium tracking-wide transition-colors"
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-[#D4AF37] transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-neutral-400 font-light leading-relaxed border-t border-neutral-900/50 pt-3 animate-fade-in">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
