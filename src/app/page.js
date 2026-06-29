import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import Setting from "@/lib/models/Setting";
import Hero from "@/components/Hero";
import FlashSale from "@/components/FlashSale";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, Heart, Star, ShieldCheck, RefreshCcw, Send } from "lucide-react";

// Server Action equivalent to trigger seeding from button click
async function triggerSeeding() {
  "use server";
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/seed`);
  } catch (e) {
    console.error("Seed error", e);
  }
}

export default async function Home() {
  await dbConnect();

  // Fetch Categories, Products, and settings from DB
  const categories = await Category.find().sort({ orderIndex: 1 }).limit(4);
  const bestSellers = await Product.find({ isBestSeller: true }).populate("category", "name").limit(4);
  const trending = await Product.find({ isTrending: true }).populate("category", "name").limit(4);
  const flashSaleProduct = await Product.findOne({ isFlashSale: true });
  const settings = await Setting.findOne();

  const isDbEmpty = categories.length === 0;

  return (
    <div className="pb-16 bg-black text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-gold-gradient text-black py-2 text-center text-[10px] tracking-[0.25em] font-semibold uppercase animate-pulse">
        {settings?.promoBanner || "Luxury Bridal & Festive Collection • Free Shipping on Orders"}
      </div>

      {/* Database Seeding Trigger Panel (Only shown when DB is empty) */}
      {isDbEmpty && (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-neutral-950 border border-[#D4AF37]/30 rounded-xl text-center shadow-[0_4px_30px_rgba(212,175,55,0.15)]">
          <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto mb-3 animate-spin" style={{ animationDuration: "10s" }} />
          <h3 className="font-serif text-xl text-white mb-2">Welcome to {settings?.brandName || "Shanvika Studio"}</h3>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto mb-5 leading-relaxed">
            Your MongoDB database is currently connected, but empty. Click below to instantly seed the store with royal categories and sample clothing items to experience the full features.
          </p>
          <a
            href="/api/seed"
            className="inline-block bg-gold-gradient text-black font-bold text-xs uppercase tracking-widest px-8 py-3 rounded hover:opacity-90 transition duration-300 shadow-md"
          >
            Instantly Seed Database
          </a>
        </div>
      )}

      {/* Hero Banner Slider */}
      <Hero />

      {/* Premium Trust Values Banner */}
      <section className="border-y border-neutral-900 bg-neutral-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-6 w-6 text-[#D4AF37] mb-2" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-1">Authentic Royal Weaves</h4>
            <p className="text-[10px] text-neutral-500 max-w-xs font-light">Direct partnerships with master weavers from heritage weaving centers across the country.</p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCcw className="h-6 w-6 text-[#D4AF37] mb-2" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-1">Privilege Custom Fitting</h4>
            <p className="text-[10px] text-neutral-500 max-w-xs font-light">Tailored customizations on sleeves, necklines and sizing to guarantee your confidence.</p>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="h-6 w-6 text-[#D4AF37] mb-2" />
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-1">Direct WhatsApp Orders</h4>
            <p className="text-[10px] text-neutral-500 max-w-xs font-light">Hassle-free ordering directly with our luxury styling specialists over secure WhatsApp chat.</p>
          </div>
        </div>
      </section>

      {/* Featured Collections / Categories */}
      {!isDbEmpty && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Collections</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide mt-1">Browse Curated Heritage</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-96 overflow-hidden rounded border border-neutral-900 shadow-lg block"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-10 transition-colors duration-300 group-hover:from-black/95" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="font-serif text-xl text-white tracking-wide group-hover:text-[#D4AF37] transition mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-light leading-relaxed mb-3 opacity-90">
                    {cat.description}
                  </p>
                  <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-semibold flex items-center gap-1.5">
                    View Catalog <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Grid */}
      {!isDbEmpty && bestSellers.length > 0 && (
        <section className="bg-neutral-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Privilege Picks</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide mt-1">Our Best Sellers</h2>
              </div>
              <Link
                href="/products?sort=bestseller"
                className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((prod) => (
                <div key={prod._id} className="group relative bg-black border border-neutral-900 rounded p-3 transition hover:border-[#D4AF37]/30 shadow-lg">
                  
                  {/* Image view */}
                  <Link href={`/products/${prod.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded bg-neutral-900 mb-4 zoom-container">
                    {prod.originalPrice && (
                      <span className="absolute top-2 left-2 z-20 bg-[#D4AF37] text-black font-bold text-[8px] tracking-widest uppercase px-2 py-0.5 rounded">
                        Celebration Priv.
                      </span>
                    )}
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product description info */}
                  <div>
                    <span className="text-[9px] tracking-widest uppercase text-neutral-500 font-medium">
                      {prod.category?.name}
                    </span>
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="font-serif text-sm text-white hover:text-[#D4AF37] transition font-medium tracking-wide line-clamp-1 mt-0.5">
                        {prod.name}
                      </h3>
                    </Link>
                    
                    {/* Star Rating summary */}
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                      <span className="text-[9px] text-neutral-400 font-semibold">{prod.ratings} ({prod.reviewsCount})</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#D4AF37] font-mono">₹{prod.basePrice.toLocaleString()}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-neutral-600 line-through font-mono">₹{prod.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Flash Sale Banner wrapper */}
      <FlashSale endDate={flashSaleProduct?.flashSaleEnd} />

      {/* Trending Collections */}
      {!isDbEmpty && trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Style Statement</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide mt-1">Trending Handcrafts</h2>
            </div>
            <Link
              href="/products?isTrending=true"
              className="text-xs uppercase tracking-widest text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((prod) => (
              <div key={prod._id} className="group relative bg-neutral-950 border border-neutral-900 rounded p-3 transition hover:border-[#D4AF37]/30 shadow-lg">
                
                {/* Image View */}
                <Link href={`/products/${prod.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded bg-neutral-900 mb-4 zoom-container">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details info */}
                <div>
                  <span className="text-[9px] tracking-widest uppercase text-neutral-500 font-medium">
                    {prod.category?.name}
                  </span>
                  <Link href={`/products/${prod.slug}`}>
                    <h3 className="font-serif text-sm text-white hover:text-[#D4AF37] transition font-medium tracking-wide line-clamp-1 mt-0.5">
                      {prod.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-[9px] text-neutral-400 font-semibold">{prod.ratings} ({prod.reviewsCount})</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#D4AF37] font-mono">₹{prod.basePrice.toLocaleString()}</span>
                    {prod.originalPrice && (
                      <span className="text-xs text-neutral-600 line-through font-mono">₹{prod.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Fashion Reels Section */}
      <section className="bg-neutral-950 py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Lookbook Reels</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide mt-1">Shanvika Lookbook</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600", desc: "Zari Weaves" },
              { img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600", desc: "Embroidery Details" },
              { img: "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=600", desc: "Royal Fitting" },
              { img: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&q=80&w=600", desc: "Privilege Custom" },
            ].map((reel, idx) => (
              <div key={idx} className="relative aspect-[9/16] overflow-hidden rounded group border border-neutral-900 cursor-pointer">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors z-10 flex items-center justify-center">
                  <span className="p-3.5 rounded-full bg-black/60 border border-[#D4AF37]/50 text-[#D4AF37] transform scale-90 group-hover:scale-100 transition duration-300">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
                <img
                  src={reel.img}
                  alt={reel.desc}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-[10px] tracking-widest text-[#D4AF37] font-semibold uppercase">{reel.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials block */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase">Client Love</span>
        <h2 className="font-serif text-3xl text-white tracking-wide mt-1 mb-8">Voices of Shanvika Elegance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
          <div className="glass-card p-6 rounded-lg relative">
            <span className="text-6xl font-serif text-[#D4AF37]/20 absolute top-2 right-4">“</span>
            <div className="flex items-center gap-1.5 text-[#D4AF37] mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed mb-4">
              "The Imperial Kanjeevaram Saree I ordered is magnificent. The double-warp zari thread work feels extremely heavy and authentic. Directing questions through WhatsApp custom fitting was a breeze."
            </p>
            <h4 className="font-serif text-xs text-white uppercase tracking-widest font-semibold">Ananya R. &bull; Chennai</h4>
          </div>

          <div className="glass-card p-6 rounded-lg relative">
            <span className="text-6xl font-serif text-[#D4AF37]/20 absolute top-2 right-4">“</span>
            <div className="flex items-center gap-1.5 text-[#D4AF37] mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed mb-4">
              "I purchased the green hand-embroidered Anarkali suit set for my sister's wedding reception. The custom fittings were precise, and the silk fabric flow is spectacular. Truly feels premium!"
            </p>
            <h4 className="font-serif text-xs text-white uppercase tracking-widest font-semibold">Meera K. &bull; Mumbai</h4>
          </div>
        </div>
      </section>

      {/* FAQ block */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-neutral-900">
        <h2 className="font-serif text-3xl text-white text-center tracking-wide mb-8">Frequently Asked Queries</h2>
        
        <div className="flex flex-col gap-4 text-xs font-light">
          <div className="border border-neutral-900 bg-neutral-950 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2 tracking-wide text-sm">How does the WhatsApp Ordering process work?</h4>
            <p className="text-neutral-400 leading-relaxed">
              When you select your sizing, color and click 'Order on WhatsApp', we generate a prefilled message with the product name, sizes, pricing adjustments, image url, and page link. You'll be connected directly with our luxury concierge, who will confirm custom sizes, shipping fees, and share billing coordinates.
            </p>
          </div>
          
          <div className="border border-neutral-900 bg-neutral-950 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2 tracking-wide text-sm">Can I customize my outfit measurements?</h4>
            <p className="text-neutral-400 leading-relaxed">
              Yes, custom adjustments (sleeves lengths, bottoms lengths, collar types) are highly encouraged. When chatting with our support styling team over WhatsApp, you can share exact measurements, and our masters will customize it accordingly.
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2 tracking-wide text-sm">How long does shipping take?</h4>
            <p className="text-neutral-400 leading-relaxed">
              In-stock items ship within 24 hours. Custom-fitted garments are hand-tailored and take 5-9 working days. Delivery times vary by location, typically taking 2-4 days. Check availability using our pincode checker on product details.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
