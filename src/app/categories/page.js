import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function CategoriesPage() {
  await dbConnect();

  // Retrieve all categories
  const categories = await Category.find().sort({ orderIndex: 1 });

  // Count products in each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(),
        productCount: count,
      };
    })
  );

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] font-semibold text-[#D4AF37] uppercase mb-2 block">
            Shanvika Studio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-wide">
            The Collections
          </h1>
          <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto mt-4 leading-relaxed">
            Delve into our signature silhouettes and heritage fabrics handcrafted with traditional hand-embroidery.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoriesWithCount.map((cat) => (
            <div 
              key={cat._id}
              className="glass-card group rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-[#D4AF37]/30 transition duration-500 shadow-xl border border-neutral-900"
            >
              {/* Image side */}
              <div className="w-full sm:w-1/2 h-64 sm:h-auto overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors pointer-events-none"></div>
              </div>

              {/* Text side */}
              <div className="w-full sm:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-semibold">
                      {cat.productCount} Designs
                    </span>
                  </div>
                  <h2 className="font-serif text-2.5xl text-white tracking-wide mb-3 group-hover:text-[#D4AF37] transition">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    {cat.description || "Indulge in curated ethnic masterpieces designed to inspire confidence."}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 border-b border-[#D4AF37]/40 pb-1 text-xs tracking-widest uppercase font-semibold text-[#D4AF37] hover:border-[#D4AF37] hover:text-[#E5C158] transition"
                  >
                    View Showcase{" "}
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
