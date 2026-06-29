import dbConnect from "@/lib/db";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import Setting from "@/lib/models/Setting";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// Helper function to upload placeholder images to Cloudinary dynamically
async function uploadToCloudinary(url, folderName) {
  try {
    const uploadRes = await cloudinary.uploader.upload(url, {
      folder: `shanvika_studio/${folderName}`,
      resource_type: "auto",
    });
    return uploadRes.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${url} to Cloudinary, using fallback:`, error.message);
    return url; // fallback to standard Unsplash URL if config is not matching
  }
}

export async function GET() {
  try {
    await dbConnect();

    // 1. Seed Settings if missing
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        whatsappNumber: "+919876543210",
        shippingFee: 150,
        freeShippingThreshold: 3000,
        allowedPincodes: "1100*, 400*, 560*, 600*, 700*, 800*",
        promoBanner: "Welcome to Shanvika Studio - Confidence in Every Outfit. Enjoy free express delivery on orders above ₹3000!",
        logoUrl: "/logo.jpg",
        slogan: "Confidence in Every Outfit",
      });
    } else {
      if (!settings.logoUrl || settings.logoUrl === "") {
        settings.logoUrl = "/logo.jpg";
        await settings.save();
      }
    }

    // 2. Seed default Admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash("ShanvikaStudio2026!", 10);
      await Admin.create({
        username: "admin",
        passwordHash,
      });
    }

    // 3. Check if Categories already exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      return NextResponse.json({
        message: "Database already seeded. Skipping.",
        categoriesCount: categoryCount,
        productsCount: await Product.countDocuments(),
      });
    }

    // Prepare Categories Data
    const categoriesRaw = [
      {
        name: "Royal Sarees",
        slug: "royal-sarees",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        description: "Elegant Banarasi, Kanjeevaram and Organza sarees that define luxury heritage.",
        orderIndex: 1,
      },
      {
        name: "Anarkali Suits",
        slug: "anarkali-suits",
        image: "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800",
        description: "Graceful flowy silhouettes crafted with premium hand-embroidery.",
        orderIndex: 2,
      },
      {
        name: "Designer Lehengas",
        slug: "designer-lehengas",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        description: "Showstopping heavy embroidered bridal and festival lehengas.",
        orderIndex: 3,
      },
      {
        name: "Premium Co-ords",
        slug: "premium-co-ords",
        image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&q=80&w=800",
        description: "Chic luxury matching sets for contemporary styling and meetings.",
        orderIndex: 4,
      },
    ];

    // Upload category images to Cloudinary
    const categoriesData = await Promise.all(
      categoriesRaw.map(async (cat) => {
        const cloudUrl = await uploadToCloudinary(cat.image, "categories");
        return { ...cat, image: cloudUrl };
      })
    );

    const seededCategories = await Category.insertMany(categoriesData);

    // Map categories by slug for referencing in products
    const catMap = seededCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {});

    // Prepare Products Data
    const productsRaw = [
      {
        name: "Imperial Gold Zari Kanjeevaram Saree",
        slug: "imperial-gold-zari-kanjeevaram-saree",
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
        ],
        videoUrl: "",
        description: "Handcrafted by master weavers in Kanchipuram, this pure silk saree features exquisite double-warp gold zari borders and matching pallu, delivering pure royal elegance.",
        details: [
          "100% Pure Mulberry Silk",
          "Intricate pure gold zari work",
          "Includes matching unstitched blouse piece (80cm)",
          "Occasion: Bridal, Festive Ceremonies"
        ],
        basePrice: 12500,
        originalPrice: 16000,
        sizes: [
          { size: "Free Size", priceAdjustment: 0, stock: 15 }
        ],
        colors: ["#D4AF37", "#800020"],
        category: catMap["royal-sarees"],
        fabric: "Pure Mulberry Silk with Gold Zari Threads",
        washCare: "Dry Clean Only. Store wrapped in muslin cloth.",
        isTrending: true,
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Emerald Green Hand-Embroidered Anarkali Set",
        slug: "emerald-green-hand-embroidered-anarkali-set",
        images: [
          "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&q=80&w=1000",
        ],
        videoUrl: "",
        description: "Crafted in flowy premium georgette, this emerald green set features meticulous hand-done Zardozi and Aari work on the yoke and cuffs, paired with raw silk pants and a matching sheer organza dupatta.",
        details: [
          "Georgette kurta with shantoon lining",
          "Intricate gold Zardozi hand-embroidery",
          "Paired with tailored pants and a scalloped dupatta",
          "Comfortable relaxed fit silhouette"
        ],
        basePrice: 8900,
        originalPrice: 11500,
        sizes: [
          { size: "S", priceAdjustment: 0, stock: 10 },
          { size: "M", priceAdjustment: 0, stock: 12 },
          { size: "L", priceAdjustment: 200, stock: 8 },
          { size: "XL", priceAdjustment: 400, stock: 5 }
        ],
        colors: ["#004B49", "#D4AF37"],
        category: catMap["anarkali-suits"],
        fabric: "Premium Georgette, Organza Dupatta, Raw Silk Pants",
        washCare: "Dry Clean Only. Low heat iron with protective cloth.",
        isTrending: true,
        isBestSeller: false,
        isFeatured: true,
      },
      {
        name: "Midnight Velvet Royal Lehenga",
        slug: "midnight-velvet-royal-lehenga",
        images: [
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
        ],
        videoUrl: "",
        description: "A showstopping deep midnight blue lehenga cut in premium plush velvet, adorned with heavy traditional gota patti, dori, and sequin hand embroidery. Accompanied by a heavy designer blouse and silk dupatta.",
        details: [
          "Heavy flare lehenga skirt with double cancan inside",
          "Stunning gota patti and dori work details",
          "Custom tailored fit options",
          "Perfect for weddings and receptions"
        ],
        basePrice: 24500,
        originalPrice: 32000,
        sizes: [
          { size: "S", priceAdjustment: 0, stock: 4 },
          { size: "M", priceAdjustment: 500, stock: 6 },
          { size: "L", priceAdjustment: 1000, stock: 3 }
        ],
        colors: ["#0B1B3D", "#C5A059"],
        category: catMap["designer-lehengas"],
        fabric: "Plush Micro-Velvet Skirt & Blouse, Soft Net Dupatta",
        washCare: "Professional Dry Clean Only. Avoid spray perfumes directly.",
        isTrending: false,
        isBestSeller: true,
        isFeatured: true,
      },
      {
        name: "Vanilla Ivory Silk Co-ord Suit Set",
        slug: "vanilla-ivory-silk-co-ord-suit-set",
        images: [
          "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&q=80&w=1000",
          "https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=1000",
        ],
        videoUrl: "",
        description: "Define modern luxury in this minimalist silk blend matching set. Complete with a asymmetric structured tunic and relaxed high-waist straight fit trousers, styled with subtle gold detailing.",
        details: [
          "Chic modern asymmetric tunic design",
          "Breathable premium silk-cotton fabric blend",
          "High-rise trousers with elasticized waist back",
          "Perfect for semi-formal luxury lounge look"
        ],
        basePrice: 4200,
        originalPrice: 5500,
        sizes: [
          { size: "XS", priceAdjustment: 0, stock: 8 },
          { size: "S", priceAdjustment: 0, stock: 15 },
          { size: "M", priceAdjustment: 0, stock: 15 },
          { size: "L", priceAdjustment: 100, stock: 10 },
          { size: "XL", priceAdjustment: 200, stock: 6 }
        ],
        colors: ["#F5F5DC", "#000000"],
        category: catMap["premium-co-ords"],
        fabric: "Silk-Cotton Blend with gold highlights",
        washCare: "Gentle Hand Wash or Dry Clean.",
        isTrending: true,
        isBestSeller: false,
        isFeatured: false,
      },
    ];

    // Upload product images to Cloudinary dynamically
    const productsData = await Promise.all(
      productsRaw.map(async (prod) => {
        const cloudImages = await Promise.all(
          prod.images.map((imgUrl) => uploadToCloudinary(imgUrl, "products"))
        );
        return { ...prod, images: cloudImages };
      })
    );

    const seededProducts = await Product.insertMany(productsData);

    // Link related items to each other
    if (seededProducts.length >= 4) {
      seededProducts[0].completeTheLook = [seededProducts[2]._id];
      seededProducts[0].frequentlyBoughtTogether = [seededProducts[2]._id];
      await seededProducts[0].save();

      seededProducts[1].completeTheLook = [seededProducts[3]._id];
      seededProducts[1].frequentlyBoughtTogether = [seededProducts[3]._id];
      await seededProducts[1].save();

      seededProducts[2].completeTheLook = [seededProducts[0]._id];
      seededProducts[2].frequentlyBoughtTogether = [seededProducts[0]._id];
      await seededProducts[2].save();
    }

    return NextResponse.json({
      message: "Database seeded successfully with Cloudinary uploaded assets!",
      categoriesCount: seededCategories.length,
      productsCount: seededProducts.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
