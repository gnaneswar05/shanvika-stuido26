import React from "react";
import { Scale, ShieldCheck, Landmark } from "lucide-react";

export const metadata = {
  title: "Store Policies | Shanvika Studio",
  description: "Read about shipping fees, returns and exchanges, privacy policy, and terms of service at Shanvika Studio.",
};

export default function PoliciesPage() {
  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      
      {/* Title */}
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
        <Scale className="h-10 w-10 text-[#D4AF37] mx-auto mb-3" />
        <h1 className="font-serif text-4xl text-white tracking-wide">
          Shanvika Store Policies
        </h1>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-12 font-light text-xs text-neutral-400">
        
        {/* Return & Exchange */}
        <section className="border border-neutral-900 bg-neutral-950 p-6 rounded-lg">
          <h2 className="font-serif text-lg text-white mb-4 tracking-wide flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]"></span> 1. Return & Exchange Policy
          </h2>
          <div className="flex flex-col gap-3 leading-relaxed">
            <p>
              Due to the bespoke, customized nature of our luxury ethnic outfits (crafted based on selected sizing adjustments and specific user measurements), we do not offer direct cash returns.
            </p>
            <p>
              However, we guarantee your satisfaction. If a garment does not fit as expected:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>We offer free sizing adjustment modifications within 14 days of receipt. Simply dispatch the item back to our Jubliee Hills salon.</li>
              <li>In the rare event of transit damage or weaving defects, we provide an instant replacement of the exact design. Photographic proof must be shared on WhatsApp within 24 hours of package unboxing.</li>
            </ul>
          </div>
        </section>

        {/* Shipping & Customs */}
        <section className="border border-neutral-900 bg-neutral-950 p-6 rounded-lg">
          <h2 className="font-serif text-lg text-white mb-4 tracking-wide flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]"></span> 2. Shipping & Customization Timeline
          </h2>
          <div className="flex flex-col gap-3 leading-relaxed">
            <p>
              All standard in-stock royal wear dispatches within 24 hours. Custom measurements require 5-9 working days of tailors' finish time.
            </p>
            <p>
              Express domestic shipping takes 2-4 days. While we make every effort to deliver on schedule, delivery timelines may vary due to location constraints.
            </p>
            <p>
              For international shipments, any custom duties or local taxes levied at destination ports are the sole responsibility of the customer.
            </p>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="border border-neutral-900 bg-neutral-950 p-6 rounded-lg">
          <h2 className="font-serif text-lg text-white mb-4 tracking-wide flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]"></span> 3. Privacy Policy & Data Security
          </h2>
          <div className="flex flex-col gap-3 leading-relaxed">
            <p>
              We respect your privacy. Any personal parameters shared with us (including name, email, phone numbers, delivery coordinates, and body measurements) are used strictly to process orders and customize garments.
            </p>
            <p>
              We do not sell or rent customer data. Analytics tracking is used strictly internally to optimize search collections, visitor counts, and catalog layouts.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
