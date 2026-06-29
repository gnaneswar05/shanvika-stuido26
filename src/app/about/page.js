import React from "react";
import { Sparkles, Heart, Landmark, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Our Heritage | Shanvika Studio",
  description: "Learn more about the craftsmanship, weavers, and design philosophy behind Shanvika Studio's luxury ethnic wear.",
};

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      
      {/* Title */}
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
        <span className="text-[10px] tracking-[0.4em] font-semibold text-[#D4AF37] uppercase mb-2 block">
          Our Heritage
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-wide">
          The Craft & Philosophy
        </h1>
        <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-serif text-2.5xl sm:text-3.5xl text-white tracking-wide mb-6 leading-snug">
              Preserving Ancient Weaving Traditions in Modern Silhouettes.
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
              At Shanvika Studio, we believe that an outfit is not just clothing; it is a canvas of self-expression, carrying stories of history, artistry, and handcraft. Founded with a vision to preserve the majestic beauty of Indian ethnic craftsmanship, we merge centuries-old heritage looms with sleek, contemporary cuts.
            </p>
            <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
              Each Banarasi silk saree, scallops-edged Anarkali dupatta, and hand-embroidered wedding lehenga is curated individually. We partner directly with artisan clusters in Banaras, Kanchipuram, and Lucknow, ensuring fair wages and reviving ancient weaving methods that are slowly being lost to mass factory production.
            </p>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              When you wear a creation from Shanvika Studio, you don’t just wear an outfit. You wear the confidence of master weavers and the elegance of authentic threads.
            </p>
          </div>
          <div className="aspect-[4/3] rounded overflow-hidden border border-neutral-900 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
              alt="Artisan weaving silk"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars Section */}
        <div className="border-t border-neutral-900 pt-16">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl text-white tracking-wide">The Pillars of Shanvika</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-lg text-center border border-neutral-900">
              <Landmark className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
              <h4 className="font-serif text-sm text-white uppercase tracking-widest font-semibold mb-3">Loom Authenticity</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                We work exclusively with hand-loom weavers, verifying zari authenticity and hand-done embroidery to guarantee true premium value.
              </p>
            </div>

            <div className="glass-card p-8 rounded-lg text-center border border-neutral-900">
              <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
              <h4 className="font-serif text-sm text-white uppercase tracking-widest font-semibold mb-3">Privileged Bespoke Fitting</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                We cater to your specific body curves. Every outline is customizable through direct coordinates with our tailors on WhatsApp.
              </p>
            </div>

            <div className="glass-card p-8 rounded-lg text-center border border-neutral-900">
              <ShieldCheck className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
              <h4 className="font-serif text-sm text-white uppercase tracking-widest font-semibold mb-3">Sustainable Fashion</h4>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                By focusing on bespoke made-to-order parameters, we eliminate deadstock waste, preserving both the planet and artisan legacy.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
