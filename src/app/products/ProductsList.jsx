"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, RotateCcw, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Categories & Products state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Quick flags
  const [isTrending, setIsTrending] = useState(searchParams.get("isTrending") === "true");
  const [isBestSeller, setIsBestSeller] = useState(searchParams.get("isBestSeller") === "true");
  const [isFlashSale, setIsFlashSale] = useState(searchParams.get("isFlashSale") === "true");

  // Fetch categories for dropdown
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedSize) params.append("size", selectedSize);
      if (selectedSort) params.append("sort", selectedSort);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (isTrending) params.append("isTrending", "true");
      if (isBestSeller) params.append("isBestSeller", "true");
      if (isFlashSale) params.append("isFlashSale", "true");
      params.append("page", String(currentPage));
      params.append("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedSort,
    minPrice,
    maxPrice,
    isTrending,
    isBestSeller,
    isFlashSale,
    currentPage,
  ]);

  // Log searches to Analytics
  const logSearchAnalytics = useCallback((query) => {
    if (!query || query.trim() === "") return;
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "search",
        targetId: query.trim(),
        device: window.innerWidth < 768 ? "mobile" : "desktop",
      }),
    }).catch((err) => console.error("Search analytics error:", err));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state with URL params changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setIsTrending(searchParams.get("isTrending") === "true");
    setIsBestSeller(searchParams.get("isBestSeller") === "true");
    setIsFlashSale(searchParams.get("isFlashSale") === "true");
    setCurrentPage(1); // reset to page 1 on external navigation changes
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
    logSearchAnalytics(searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setIsTrending(false);
    setIsBestSeller(false);
    setIsFlashSale(false);
    setCurrentPage(1);
    router.push("/products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4.5xl text-white tracking-wide">
          The Salon Catalog
        </h1>
        <p className="text-xs text-neutral-400 font-light mt-1.5">
          Showing {totalProducts} luxury creations hand-finished for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 bg-neutral-950/80 border border-neutral-900 rounded-lg p-6 h-fit sticky top-28">
          
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-white">Filters</span>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[10px] tracking-wider text-[#D4AF37] hover:text-white uppercase font-medium flex items-center gap-1 transition"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Search filter input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2.5 text-white placeholder:text-neutral-700 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#D4AF37] transition"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2.5 outline-none focus:border-[#D4AF37] transition"
              >
                <option value="">All Collections</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size filter options */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Size
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(selectedSize === s ? "" : s);
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 text-[10px] font-semibold border rounded transition ${
                      selectedSize === s
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                        : "bg-black text-neutral-400 border-neutral-850 hover:border-neutral-750"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting choices */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Sort By
              </label>
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2.5 outline-none focus:border-[#D4AF37] transition"
              >
                <option value="newest">New Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="bestseller">Best Sellers</option>
                <option value="trending">Trending Wear</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Price limits */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Price Limits
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 bg-black border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2 text-white font-mono placeholder:text-neutral-700 transition"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 bg-black border border-neutral-800 focus:border-[#D4AF37] outline-none text-xs rounded px-3 py-2 text-white font-mono placeholder:text-neutral-700 transition"
                />
              </div>
            </div>

            {/* Quick Filter checkbox blocks */}
            <div className="flex flex-col gap-2.5 pt-2 text-xs">
              <label className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => {
                    setIsTrending(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-[#D4AF37] h-4 w-4"
                />
                <span>Trending Outfits</span>
              </label>
              <label className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => {
                    setIsBestSeller(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-[#D4AF37] h-4 w-4"
                />
                <span>Best Sellers</span>
              </label>
              <label className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFlashSale}
                  onChange={(e) => {
                    setIsFlashSale(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-[#D4AF37] h-4 w-4"
                />
                <span>Celebrative Discounts</span>
              </label>
            </div>

          </div>
        </div>

        {/* Products Grid Pane */}
        <div className="lg:col-span-3">
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-neutral-950 border border-neutral-900 p-4 rounded aspect-[3/4] animate-pulse flex flex-col justify-between">
                  <div className="bg-neutral-900 w-full h-[65%] rounded"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-neutral-900 w-16 h-3 rounded"></div>
                    <div className="bg-neutral-900 w-full h-4 rounded"></div>
                    <div className="bg-neutral-900 w-24 h-4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-neutral-950/40 border border-neutral-900 rounded-lg p-10">
              <span className="text-4xl">👑</span>
              <h3 className="font-serif text-lg text-white mt-4 mb-2">No designs match search criteria</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Try modifying your filter checks or adjusting your search queries. Or click Reset Filters to view our royal collections.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition px-6 py-2 rounded text-xs uppercase font-semibold tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12 pt-6 border-t border-neutral-900">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 border border-neutral-850 rounded bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-xs text-neutral-400 font-medium">
                    Page <span className="text-white font-semibold font-mono">{currentPage}</span> of{" "}
                    <span className="text-white font-semibold font-mono">{totalPages}</span>
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 border border-neutral-850 rounded bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
      
    </div>
  );
}
