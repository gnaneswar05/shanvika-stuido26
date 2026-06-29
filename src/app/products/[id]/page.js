import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Setting from "@/lib/models/Setting";
import ProductDetailsClient from "./ProductDetailsClient";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

// Generate Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  await dbConnect();
  const { id } = await params;

  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).populate("category", "name");
  } else {
    product = await Product.findOne({ slug: id }).populate("category", "name");
  }

  if (!product) {
    return {
      title: "Product Not Found | Shanvika Studio",
    };
  }

  return {
    title: `${product.name} | Shanvika Studio`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | Shanvika Studio`,
      description: product.description.substring(0, 160),
      url: `https://shanvikastudio.com/products/${product.slug}`,
      images: [
        {
          url: product.images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }) {
  await dbConnect();
  const { id } = await params;

  // Fetch Product
  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("completeTheLook", "name slug basePrice originalPrice images sizes")
      .populate("frequentlyBoughtTogether", "name slug basePrice originalPrice images sizes");
  } else {
    product = await Product.findOne({ slug: id })
      .populate("category", "name slug")
      .populate("completeTheLook", "name slug basePrice originalPrice images sizes")
      .populate("frequentlyBoughtTogether", "name slug basePrice originalPrice images sizes");
  }

  if (!product) {
    notFound();
  }

  // Fetch configured site settings
  let settings = await Setting.findOne();
  if (!settings) {
    settings = {
      whatsappNumber: "+919876543210",
      shippingFee: 100,
      freeShippingThreshold: 2000,
      allowedPincodes: "1100*, 400*, 560*, 600*, 700*",
    };
  }

  // Convert mongoose model to plain JS object for client components
  const productObj = JSON.parse(JSON.stringify(product));
  const settingsObj = JSON.parse(JSON.stringify(settings));

  // JSON-LD structured data for Schema.org SEO best practices
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.slug,
    "offers": {
      "@type": "Offer",
      "url": `https://shanvikastudio.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.basePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ProductDetailsClient product={productObj} settings={settingsObj} />
    </>
  );
}
