"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Tags, Shirt, Star, Settings, LogOut, Plus, Trash2, 
  CheckCircle, ArrowRight, Upload, Sparkles, Check, Tablet, Smartphone, Laptop
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics");
  const [verified, setVerified] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  // Form Input States
  // 1. Category Form
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catImage, setCatImage] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catOrder, setCatOrder] = useState(0);

  // 2. Product Form
  const [prodId, setProdId] = useState(null); // null for create, ID for edit
  const [prodName, setProdName] = useState("");
  const [prodSlug, setProdSlug] = useState("");
  const [prodImages, setProdImages] = useState([]);
  const [prodVideoUrl, setProdVideoUrl] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodDetails, setProdDetails] = useState(""); // newline separated
  const [prodBasePrice, setProdBasePrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodFabric, setProdFabric] = useState("");
  const [prodWashCare, setProdWashCare] = useState("");
  const [prodTrending, setProdTrending] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodFlashSale, setProdFlashSale] = useState(false);
  const [prodFlashSaleEnd, setProdFlashSaleEnd] = useState("");
  const [prodSizes, setProdSizes] = useState([
    { size: "S", priceAdjustment: 0, stock: 10 },
    { size: "M", priceAdjustment: 0, stock: 10 },
    { size: "L", priceAdjustment: 0, stock: 10 },
  ]);
  const [prodColors, setProdColors] = useState(""); // comma separated

  // 3. Settings Form
  const [setWhatsapp, setSetWhatsapp] = useState("");
  const [setShipping, setSetShipping] = useState("");
  const [setFreeThreshold, setSetFreeThreshold] = useState("");
  const [setAllowedPin, setSetAllowedPin] = useState("");
  const [setPromo, setSetPromo] = useState("");
  const [setLogoUrl, setSetLogoUrl] = useState("");
  const [setSlogan, setSetSlogan] = useState("");
  const [setBrandName, setSetBrandName] = useState("");
  
  // 4. Admin Manual Review Form
  const [newReviewProduct, setNewReviewProduct] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // 5. Password Update Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Authenticate admin session
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setAdminUser(data.admin);
        setVerified(true);
      } catch (err) {
        router.push("/admin/login");
      }
    };
    verifySession();
  }, [router]);

  // Load Admin Data Modules
  const loadData = useCallback(async () => {
    if (!verified) return;
    setLoading(true);
    try {
      const [analyticsRes, categoriesRes, productsRes, reviewsRes, settingsRes] = await Promise.all([
        fetch("/api/analytics", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/products?limit=100", { cache: "no-store" }),
        fetch("/api/reviews?status=all", { cache: "no-store" }),
        fetch("/api/settings", { cache: "no-store" }),
      ]);

      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData.products || []);
      }
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSiteSettings(settingsData);
        // Pre-fill settings form
        setSetWhatsapp(settingsData.whatsappNumber || "");
        setSetShipping(settingsData.shippingFee || "");
        setSetFreeThreshold(settingsData.freeShippingThreshold || "");
        setSetAllowedPin(settingsData.allowedPincodes || "");
        setSetPromo(settingsData.promoBanner || "");
        setSetLogoUrl(settingsData.logoUrl || "");
        setSetSlogan(settingsData.slogan || "");
        setSetBrandName(settingsData.brandName || "Shanvika Studio");
      }
    } catch (e) {
      console.error("Error loading dashboard data", e);
    } finally {
      setLoading(false);
    }
  }, [verified]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle image compression and WebP conversion client-side
  const handleImageProcess = (file, type) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          if (type === "logo") {
            // Keep original aspect ratio for logos
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          } else {
            // aspect ratio 3:4 for luxury garments (600x800 resolution)
            const targetWidth = 600;
            const targetHeight = 800;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // Crop source logic
            const imgRatio = img.width / img.height;
            const targetRatio = targetWidth / targetHeight;
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = img.width;
            let sourceHeight = img.height;
            
            if (imgRatio > targetRatio) {
              sourceWidth = img.height * targetRatio;
              sourceX = (img.width - sourceWidth) / 2;
            } else {
              sourceHeight = img.width / targetRatio;
              sourceY = (img.height - sourceHeight) / 2;
            }
            
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
          }
          
          // WebP output at 80% compression
          const base64WebP = canvas.toDataURL("image/webp", 0.8);
          resolve(base64WebP);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setActionLoading(true);
    setStatusMsg("Compressing and converting image to WebP...");
    try {
      const processedBase64 = await handleImageProcess(files[0], type);
      
      setStatusMsg("Uploading to Cloudinary...");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: processedBase64 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "category") {
        setCatImage(data.url);
        setStatusMsg("Category image uploaded successfully!");
      } else if (type === "product") {
        setProdImages((prev) => [...prev, data.url]);
        setStatusMsg("Product image added successfully!");
      } else if (type === "logo") {
        setSetLogoUrl(data.url);
        setStatusMsg("Studio Logo uploaded successfully!");
      }
    } catch (err) {
      showToast("Upload failed: " + err.message, "error");
      setStatusMsg("");
    } finally {
      setActionLoading(false);
    }
  };

  // Sign out admin
  const handleLogout = async () => {
    if (confirm("Log out of admin session?")) {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    }
  };

  // CATEGORY CRUD Handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: catName,
          slug: catSlug || catName.toLowerCase().replace(/\s+/g, "-"),
          image: catImage,
          description: catDesc,
          orderIndex: catOrder,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category");
      }

      setCatName("");
      setCatSlug("");
      setCatImage("");
      setCatDesc("");
      setCatOrder(0);
      loadData();
      showToast("Category created successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      loadData();
      showToast("Category deleted successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // PRODUCT CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (prodImages.length === 0) {
      showToast("Please upload at least one image.", "error");
      return;
    }

    setActionLoading(true);
    const prodDetailsArray = prodDetails
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const colorsArray = prodColors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const payload = {
      name: prodName,
      slug: prodSlug || prodName.toLowerCase().replace(/\s+/g, "-"),
      images: prodImages,
      videoUrl: prodVideoUrl,
      description: prodDescription,
      details: prodDetailsArray,
      basePrice: Number(prodBasePrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      category: prodCategory,
      fabric: prodFabric,
      washCare: prodWashCare,
      isTrending: prodTrending,
      isBestSeller: prodBestSeller,
      isFeatured: prodFeatured,
      isFlashSale: prodFlashSale,
      flashSaleEnd: prodFlashSaleEnd || undefined,
      sizes: prodSizes,
      colors: colorsArray,
    };

    try {
      const endpoint = prodId ? `/api/products/${prodId}` : "/api/products";
      const method = prodId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      // Reset
      setProdId(null);
      setProdName("");
      setProdSlug("");
      setProdImages([]);
      setProdVideoUrl("");
      setProdDescription("");
      setProdDetails("");
      setProdBasePrice("");
      setProdOriginalPrice("");
      setProdCategory("");
      setProdFabric("");
      setProdWashCare("");
      setProdTrending(false);
      setProdBestSeller(false);
      setProdFeatured(false);
      setProdFlashSale(false);
      setProdFlashSaleEnd("");
      setProdColors("");
      loadData();
      showToast("Product saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProduct = (prod) => {
    setProdId(prod._id);
    setProdName(prod.name || "");
    setProdSlug(prod.slug || "");
    setProdImages(prod.images || []);
    setProdVideoUrl(prod.videoUrl || "");
    setProdDescription(prod.description || "");
    setProdDetails(prod.details ? prod.details.join("\n") : "");
    setProdBasePrice(prod.basePrice || "");
    setProdOriginalPrice(prod.originalPrice || "");
    setProdCategory(prod.category?._id || prod.category || "");
    setProdFabric(prod.fabric || "");
    setProdWashCare(prod.washCare || "");
    setProdTrending(!!prod.isTrending);
    setProdBestSeller(!!prod.isBestSeller);
    setProdFeatured(!!prod.isFeatured);
    setProdFlashSale(!!prod.isFlashSale);
    setProdFlashSaleEnd(prod.flashSaleEnd ? prod.flashSaleEnd.substring(0, 16) : "");
    setProdSizes(prod.sizes || []);
    setProdColors(prod.colors ? prod.colors.join(", ") : "");
    
    // Scroll to form
    setActiveTab("productForm");
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      loadData();
      showToast("Product deleted successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // SETTINGS HANDLER
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber: setWhatsapp,
          shippingFee: Number(setShipping),
          freeShippingThreshold: Number(setFreeThreshold),
          allowedPincodes: setAllowedPin,
          promoBanner: setPromo,
          logoUrl: setLogoUrl,
          slogan: setSlogan,
          brandName: setBrandName,
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      loadData();
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // REVIEW MODERATION HANDLERS
  const handleModerateReview = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id, status }),
      });

      if (!res.ok) throw new Error("Failed to moderate review");
      loadData();
      showToast(`Review status set to ${status}!`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      loadData();
      showToast("Review deleted successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewProduct || !newReviewName.trim() || !newReviewComment.trim()) {
      showToast("Please fill in all review fields.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: newReviewProduct,
          name: newReviewName,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });

      if (!res.ok) throw new Error("Failed to post manual review");

      setNewReviewProduct("");
      setNewReviewName("");
      setNewReviewRating(5);
      setNewReviewComment("");
      loadData();
      showToast("Review created and approved live!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (!verified) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#D4AF37] animate-pulse">Verifying credentials session...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Dashboard Top Header */}
      <header className="bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-gold-gradient text-black p-1.5 rounded font-bold text-xs uppercase">Dashboard</span>
          <div>
            <h1 className="font-serif text-md text-white tracking-wide">Shanvika Control Panel</h1>
            <p className="text-[9px] text-neutral-500 font-mono">Logged in as {adminUser?.username}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-neutral-500 hover:text-red-400 p-2 rounded transition flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          <LogOut className="h-4.5 w-4.5" /> Logout
        </button>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Navigation Sidebar Panel */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-neutral-950 border border-neutral-900 p-4 rounded-lg h-fit">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "analytics" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Analytics Summary
          </button>
          
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "categories" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Tags className="h-4 w-4" /> Collections Setup
          </button>

          <button
            onClick={() => {
              setProdId(null); // Reset to create mode
              setActiveTab("productForm");
            }}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "productForm" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Plus className="h-4 w-4" /> Create Product
          </button>

          <button
            onClick={() => setActiveTab("productsList")}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "productsList" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Shirt className="h-4 w-4" /> Garment Inventory
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "reviews" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Star className="h-4 w-4" /> Customer Reviews
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider font-semibold transition flex items-center gap-3.5 ${
              activeTab === "settings" ? "bg-[#D4AF37] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" /> Studio Settings
          </button>
        </div>

        {/* Tab Contents Frame */}
        <div className="lg:col-span-9 flex flex-col gap-6 bg-neutral-950 border border-neutral-900 p-6 rounded-lg min-h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center h-full my-auto flex-col gap-3">
              <span className="text-2xl animate-spin text-[#D4AF37]">&bull;</span>
              <p className="text-xs text-neutral-500 font-mono">Synchronizing database inventories...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: ANALYTICS SUMMARY */}
              {activeTab === "analytics" && analytics && (
                <div className="flex flex-col gap-8">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">Operational Analytics</h2>
                  
                  {/* Summary grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-900/50 p-5 rounded-lg border border-neutral-850 text-center">
                      <span className="block text-2xl font-bold font-mono text-[#D4AF37]">{analytics.summary?.views}</span>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">Product Views</span>
                    </div>
                    <div className="bg-neutral-900/50 p-5 rounded-lg border border-neutral-850 text-center">
                      <span className="block text-2xl font-bold font-mono text-[#D4AF37]">{analytics.summary?.whatsappClicks}</span>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">WhatsApp Orders</span>
                    </div>
                    <div className="bg-neutral-900/50 p-5 rounded-lg border border-neutral-850 text-center">
                      <span className="block text-2xl font-bold font-mono text-[#D4AF37]">{analytics.summary?.searches}</span>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">Searches</span>
                    </div>
                    <div className="bg-neutral-900/50 p-5 rounded-lg border border-neutral-850 text-center">
                      <span className="block text-2xl font-bold font-mono text-[#D4AF37]">{analytics.summary?.wishlistAdds}</span>
                      <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">Wishlist Saves</span>
                    </div>
                  </div>

                  {/* Device & search stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Device distribution list */}
                    <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg p-5">
                      <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Device Distribution</h3>
                      <div className="flex flex-col gap-4 text-xs font-light">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-neutral-400"><Laptop className="h-4 w-4" /> Desktop Views</span>
                          <span className="font-mono font-semibold text-white">{analytics.devices?.desktop || 0} hits</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-neutral-400"><Smartphone className="h-4 w-4" /> Mobile Views</span>
                          <span className="font-mono font-semibold text-white">{analytics.devices?.mobile || 0} hits</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-neutral-400"><Tablet className="h-4 w-4" /> Tablet Views</span>
                          <span className="font-mono font-semibold text-white">{analytics.devices?.tablet || 0} hits</span>
                        </div>
                      </div>
                    </div>

                    {/* Search queries list */}
                    <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg p-5">
                      <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Top Search Queries</h3>
                      {analytics.topSearches && analytics.topSearches.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {analytics.topSearches.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-900">
                              <span className="font-serif italic text-neutral-300">"{item.query}"</span>
                              <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded text-neutral-500">{item.count} searches</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-neutral-600 italic">No search events logged yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Top Products Aggregations */}
                  <div className="bg-neutral-900/40 border border-[#D4AF37]/10 rounded-lg p-5">
                    <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">Top Viewed Products</h3>
                    {analytics.topProducts && analytics.topProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {analytics.topProducts.map((item, idx) => (
                          <div key={idx} className="bg-black/60 border border-neutral-900 p-2.5 rounded text-center flex flex-col justify-between">
                            <div className="aspect-square rounded overflow-hidden mb-2 bg-neutral-900">
                              <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-[10px] text-white line-clamp-1 leading-tight font-medium">{item.product?.name}</h4>
                            <span className="block font-mono text-[10px] text-[#D4AF37] font-semibold mt-1.5">{item.views} Views</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-neutral-600 italic">No products viewed yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORY CRUD */}
              {activeTab === "categories" && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">Collections Manager</h2>

                  {/* Creation Form */}
                  <form onSubmit={handleCategorySubmit} className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-lg flex flex-col gap-4 text-xs font-light">
                    <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-2 flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add Category</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Category Name</label>
                        <input
                          type="text"
                          required
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="e.g. Royal Sarees"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={catSlug}
                          onChange={(e) => setCatSlug(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="e.g. royal-sarees"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Category Description</label>
                      <input
                        type="text"
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                        placeholder="Enter description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Drag/Select Category Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "category")}
                          className="w-full text-neutral-500 text-xs"
                        />
                        {catImage && <p className="text-[10px] text-emerald-400 mt-1 font-mono break-all">Uploaded: {catImage}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Order Index</label>
                        <input
                          type="number"
                          value={catOrder}
                          onChange={(e) => setCatOrder(Number(e.target.value))}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading || !catImage}
                      className="bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase py-2.5 rounded hover:opacity-95 transition-opacity disabled:opacity-30 mt-2 flex items-center justify-center gap-1.5"
                    >
                      {actionLoading ? "Processing Upload..." : "Create Category"}
                    </button>
                    {statusMsg && <p className="text-[10px] text-[#D4AF37] text-center font-mono">{statusMsg}</p>}
                  </form>

                  {/* Categories list */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">Category List</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <div key={cat._id} className="bg-neutral-900/35 border border-neutral-850 p-4 rounded flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded overflow-hidden shrink-0 bg-neutral-900">
                              <img src={cat.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm font-semibold text-white">{cat.name}</h4>
                              <p className="text-[10px] text-neutral-500 font-mono">Slug: {cat.slug} | Order: {cat.orderIndex}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCT FORM (Create & Edit) */}
              {activeTab === "productForm" && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">
                    {prodId ? "Edit Product Coordinates" : "Create Royal Outfit"}
                  </h2>

                  <form onSubmit={handleProductSubmit} className="flex flex-col gap-5 text-xs font-light">
                    
                    {/* Basic details info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Product Name</label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="e.g. Royal Organza Gold Saree"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={prodSlug}
                          onChange={(e) => setProdSlug(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="e.g. royal-organza-gold-saree"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Category Category</label>
                        <select
                          required
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2 outline-none"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Base Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={prodBasePrice}
                          onChange={(e) => setProdBasePrice(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                          placeholder="8500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Original Price (INR)</label>
                        <input
                          type="number"
                          value={prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                          placeholder="12000"
                        />
                      </div>
                    </div>

                    {/* Sizing & Colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-2">Sizes Configuration</label>
                        <div className="flex flex-col gap-2.5">
                          {["XS", "S", "M", "L", "XL", "Free Size"].map((s, idx) => {
                            const config = prodSizes.find((item) => item.size === s) || { size: s, priceAdjustment: 0, stock: 0 };
                            return (
                              <div key={idx} className="flex items-center gap-2 border-b border-neutral-900 pb-1.5">
                                <span className="w-14 font-semibold text-neutral-400 text-[10px]">{s}</span>
                                
                                <input
                                  type="number"
                                  placeholder="Offset Price"
                                  value={config.priceAdjustment || ""}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setProdSizes((prev) => {
                                      const filtered = prev.filter((item) => item.size !== s);
                                      return [...filtered, { size: s, priceAdjustment: val, stock: config.stock }];
                                    });
                                  }}
                                  className="w-1/2 bg-black border border-neutral-850 text-xs rounded px-2.5 py-1 text-white font-mono"
                                />

                                <input
                                  type="number"
                                  placeholder="Stock"
                                  value={config.stock || ""}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setProdSizes((prev) => {
                                      const filtered = prev.filter((item) => item.size !== s);
                                      return [...filtered, { size: s, priceAdjustment: config.priceAdjustment, stock: val }];
                                    });
                                  }}
                                  className="w-1/2 bg-black border border-neutral-850 text-xs rounded px-2.5 py-1 text-white font-mono"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Color Options (Comma separated hex)</label>
                        <input
                          type="text"
                          value={prodColors}
                          onChange={(e) => setProdColors(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                          placeholder="e.g. #D4AF37, #800020, #000000"
                        />
                        <span className="text-[9px] text-neutral-500 font-mono mt-1 block">Hex values work directly as circles on page details.</span>
                      </div>
                    </div>

                    {/* Fabrics & washcare */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Fabric specifications</label>
                        <input
                          type="text"
                          value={prodFabric}
                          onChange={(e) => setProdFabric(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="Pure Banarasi Mulberry Silk"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Laundering Wash care</label>
                        <input
                          type="text"
                          value={prodWashCare}
                          onChange={(e) => setProdWashCare(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                          placeholder="Dry Clean Only. Wrapped in Muslin."
                        />
                      </div>
                    </div>

                    {/* Image uploads */}
                    <div className="bg-neutral-900/35 border border-neutral-850 p-4 rounded-lg flex flex-col gap-3">
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Garment Images (Upload Center-cropped WebP)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "product")}
                        className="text-neutral-400"
                      />
                      {prodImages.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 mt-2">
                          {prodImages.map((img, idx) => (
                            <div key={idx} className="relative h-20 w-16 border border-[#D4AF37]/20 rounded overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setProdImages((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 text-[8px] h-4 w-4 flex items-center justify-center hover:bg-red-500"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Descriptions */}
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Garment Narrative Description</label>
                      <textarea
                        rows={3}
                        required
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white resize-none"
                        placeholder="Detail the heritage look, drape and occasion..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Garment Details (New line separated bullet points)</label>
                      <textarea
                        rows={3}
                        value={prodDetails}
                        onChange={(e) => setProdDetails(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white resize-none"
                        placeholder="Double warp zari border&#10;Include matching silk blouse&#10;Embroidery zardozi details"
                      />
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-light">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                        <input
                          type="checkbox"
                          checked={prodTrending}
                          onChange={(e) => setProdTrending(e.target.checked)}
                          className="accent-[#D4AF37] h-4 w-4"
                        />
                        <span>Trending Outfit</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                        <input
                          type="checkbox"
                          checked={prodBestSeller}
                          onChange={(e) => setProdBestSeller(e.target.checked)}
                          className="accent-[#D4AF37] h-4 w-4"
                        />
                        <span>Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                        <input
                          type="checkbox"
                          checked={prodFeatured}
                          onChange={(e) => setProdFeatured(e.target.checked)}
                          className="accent-[#D4AF37] h-4 w-4"
                        />
                        <span>Feature Banner</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                        <input
                          type="checkbox"
                          checked={prodFlashSale}
                          onChange={(e) => setProdFlashSale(e.target.checked)}
                          className="accent-[#D4AF37] h-4 w-4"
                        />
                        <span>Countdown Flash Sale</span>
                      </label>
                    </div>

                    {/* Flash Sale Date picker */}
                    {prodFlashSale && (
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Flash Sale End Date</label>
                        <input
                          type="datetime-local"
                          value={prodFlashSaleEnd}
                          onChange={(e) => setProdFlashSaleEnd(e.target.value)}
                          className="bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                        />
                      </div>
                    )}

                    <div className="flex gap-4 mt-4">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase py-3 rounded hover:opacity-95 transition disabled:opacity-50"
                      >
                        {prodId ? "Update Outwear" : "Publish Outwear"}
                      </button>
                      
                      {prodId && (
                        <button
                          type="button"
                          onClick={() => {
                            setProdId(null);
                            // Clear
                            setProdName("");
                            setProdSlug("");
                            setProdImages([]);
                            setProdVideoUrl("");
                            setProdDescription("");
                            setProdDetails("");
                            setProdBasePrice("");
                            setProdOriginalPrice("");
                            setProdCategory("");
                            setProdFabric("");
                            setProdWashCare("");
                            setProdTrending(false);
                            setProdBestSeller(false);
                            setProdFeatured(false);
                            setProdFlashSale(false);
                            setProdFlashSaleEnd("");
                            setProdColors("");
                            setActiveTab("productsList");
                          }}
                          className="border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white px-6 py-3 rounded text-xs uppercase tracking-wider font-semibold"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: GARMENT INVENTORY LIST */}
              {activeTab === "productsList" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">Garment Inventory List</h2>
                  <div className="flex flex-col gap-4.5">
                    {products.map((prod) => (
                      <div key={prod._id} className="bg-neutral-900/35 border border-neutral-850 p-4 rounded flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-12 rounded overflow-hidden shrink-0 bg-neutral-900">
                            <img src={prod.images?.[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-white">{prod.name}</h4>
                            <p className="text-[10px] text-neutral-500 font-mono">
                              Price: ₹{prod.basePrice.toLocaleString()} | Category: {prod.category?.name || "None"}
                            </p>
                            <div className="flex gap-2.5 mt-1.5 text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">
                              {prod.isTrending && <span>&bull; Trending</span>}
                              {prod.isBestSeller && <span>&bull; Best Seller</span>}
                              {prod.isFlashSale && <span>&bull; Flash Sale</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="bg-transparent border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-neutral-400 text-xs px-3.5 py-1.5 rounded transition uppercase font-semibold tracking-wider"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CUSTOMER REVIEWS */}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">Reviews Moderation</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Manual Form - Left Side */}
                    <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-850 p-5 rounded-lg flex flex-col gap-4 text-xs font-light h-fit">
                      <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-2 flex items-center gap-1.5">
                        <Plus className="h-4 w-4" /> Add Review Manual
                      </h3>
                      
                      <form onSubmit={handleAdminReviewSubmit} className="flex flex-col gap-3.5">
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Select Product</label>
                          <select
                            required
                            value={newReviewProduct}
                            onChange={(e) => setNewReviewProduct(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2 outline-none"
                          >
                            <option value="">-- Choose Product --</option>
                            {products.map((prod) => (
                              <option key={prod._id} value={prod._id}>
                                {prod.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Reviewer Name</label>
                          <input
                            type="text"
                            required
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                            placeholder="e.g. Priyanjali S."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Star Rating</label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2 outline-none"
                          >
                            <option value="5">5 Stars (Excellent)</option>
                            <option value="4">4 Stars (Very Good)</option>
                            <option value="3">3 Stars (Good)</option>
                            <option value="2">2 Stars (Average)</option>
                            <option value="1">1 Star (Poor)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Comment</label>
                          <textarea
                            required
                            rows={3}
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white outline-none resize-none leading-relaxed"
                            placeholder="Write review..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-gold-gradient text-black font-semibold text-[10px] tracking-wider uppercase py-2.5 rounded hover:opacity-95 transition disabled:opacity-50 mt-1"
                        >
                          Create & Approve Live
                        </button>
                      </form>
                    </div>

                    {/* Moderation List - Right Side */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">Verified Feedback List ({reviews.length})</h3>
                      {reviews.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No reviews submitted yet.</p>
                      ) : (
                        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                          {reviews.map((rev) => (
                            <div key={rev._id} className="bg-neutral-900/35 border border-neutral-850 p-5 rounded-lg flex flex-col gap-2.5">
                              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{rev.name}</h4>
                                  <p className="text-[9px] text-neutral-500 font-mono">Reviewed Product: {rev.product?.name || "Deleted Product"}</p>
                                </div>
                                <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                                  rev.status === "approved" ? "bg-emerald-950 text-emerald-400" : "bg-yellow-950 text-yellow-400 animate-pulse"
                                }`}>
                                  {rev.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-800"}`} />
                                ))}
                              </div>

                              <p className="text-xs text-neutral-400 font-light italic leading-relaxed">"{rev.comment}"</p>

                              <div className="flex justify-end gap-2.5 mt-2.5 pt-2 border-t border-neutral-900/60">
                                {rev.status === "pending" && (
                                  <button
                                    onClick={() => handleModerateReview(rev._id, "approved")}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded transition flex items-center gap-1"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteReview(rev._id)}
                                  className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STUDIO SETTINGS */}
              {activeTab === "settings" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="font-serif text-2xl text-white tracking-wide border-b border-neutral-900 pb-3">Studio Settings</h2>
                  
                  <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-5 text-xs font-light">
                    {/* Brand Logo Upload, Name & Slogan Config */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-neutral-900 pb-5 mb-2">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Dynamic Brand Logo Image</label>
                        <div className="flex items-center gap-3">
                          {setLogoUrl ? (
                            <div className="h-12 w-24 bg-neutral-900 border border-neutral-800 rounded p-1 flex items-center justify-center relative group">
                              <img src={setLogoUrl} alt="Brand Logo Preview" className="h-full w-full object-contain" />
                              <button
                                type="button"
                                onClick={() => setSetLogoUrl("")}
                                className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-0.5 text-[8px] leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="h-12 w-24 bg-neutral-950 border border-neutral-900 border-dashed rounded flex items-center justify-center text-[9px] text-neutral-600">
                              No Custom Logo
                            </div>
                          )}
                          <label className="flex-1 flex flex-col items-center justify-center border border-neutral-850 hover:border-[#D4AF37] rounded px-3 py-2 cursor-pointer bg-neutral-900 text-center transition">
                            <span className="text-[10px] font-semibold text-neutral-300">Choose Logo Image</span>
                            <span className="text-[8px] text-neutral-500 mt-0.5">Base64 WebP compressed</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "logo")}
                              disabled={actionLoading}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Boutique Brand Name</label>
                        <input
                          type="text"
                          required
                          value={setBrandName}
                          onChange={(e) => setSetBrandName(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-3 text-white"
                          placeholder="e.g. Shanvika Studio"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Brand Slogan (Displayed in Footer)</label>
                        <input
                          type="text"
                          required
                          value={setSlogan}
                          onChange={(e) => setSetSlogan(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-3 text-white"
                          placeholder="e.g. Confidence in Every Outfit"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">WhatsApp Order Mobile Number</label>
                      <input
                        type="text"
                        required
                        value={setWhatsapp}
                        onChange={(e) => setSetWhatsapp(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                        placeholder="e.g. +919876543210"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Default Shipping Fee (INR)</label>
                        <input
                          type="number"
                          required
                          value={setShipping}
                          onChange={(e) => setSetShipping(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Free Shipping Threshold Limit (INR)</label>
                        <input
                          type="number"
                          required
                          value={setFreeThreshold}
                          onChange={(e) => setSetFreeThreshold(e.target.value)}
                          className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Allowed Shipping Pincodes Wildcards (Comma separated)</label>
                      <input
                        type="text"
                        required
                        value={setAllowedPin}
                        onChange={(e) => setSetAllowedPin(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                        placeholder="e.g. 560*, 400*, 110001"
                      />
                      <span className="text-[9px] text-neutral-500 font-mono mt-1.5 block">Use wildcard asterisk (*) to match prefixes, e.g. 560* matches all Bangalore pincodes starting with 560.</span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Home Announcement Promo Banner Text</label>
                      <input
                        type="text"
                        required
                        value={setPromo}
                        onChange={(e) => setSetPromo(e.target.value)}
                        className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-gold-gradient text-black font-semibold text-xs tracking-wider uppercase py-3 rounded hover:opacity-95 transition disabled:opacity-50 mt-2"
                    >
                      Save Configuration
                    </button>
                  </form>

                  {/* Password Change Form */}
                  <div className="border-t border-neutral-900 pt-6 mt-6 text-xs font-light">
                    <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-4">
                      Update Administrator Credentials
                    </h3>
                    
                    <form onSubmit={handlePasswordChangeSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Current Password</label>
                          <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">New Password</label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                            placeholder="Min 6 characters"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-neutral-400 font-semibold mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black border border-neutral-800 text-xs rounded px-3 py-2 text-white font-mono"
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading || !currentPassword || !newPassword || !confirmPassword}
                        className="w-fit bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-[10px] tracking-wider uppercase px-6 py-2.5 rounded transition disabled:opacity-40"
                      >
                        Update Admin Password
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Dynamic Gold Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm w-full bg-neutral-950/95 backdrop-blur-md border border-[#D4AF37]/40 p-4 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <span className="text-[#D4AF37] text-lg font-bold">
            {toast.type === "success" ? "👑" : "⚠️"}
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white tracking-wide">
              {toast.type === "success" ? "System Success" : "System Error"}
            </p>
            <p className="text-[11px] text-neutral-400 font-light mt-0.5 leading-normal">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-neutral-500 hover:text-white font-mono text-sm leading-none p-1"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
