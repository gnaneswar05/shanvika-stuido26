import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      default: "+919876543210",
    },
    shippingFee: {
      type: Number,
      default: 100,
    },
    freeShippingThreshold: {
      type: Number,
      default: 2000,
    },
    allowedPincodes: {
      type: String,
      default: "1100*, 400*, 560*, 600*, 700*",
    },
    promoBanner: {
      type: String,
      default: "Exclusive Summer Luxury Edition: Free shipping on orders above ₹2000!",
    },
    logoUrl: {
      type: String,
      default: "/logo.jpg", // Default to local logo
    },
    slogan: {
      type: String,
      default: "Confidence in Every Outfit",
    },
    brandName: {
      type: String,
      default: "Shanvika Studio",
    },
    flashSaleTitle: {
      type: String,
      default: "Seasonal Splendor Flash Sale",
    },
    flashSaleSubtitle: {
      type: String,
      default: "Acquire handcrafted royal sarees and exquisite embroidered outfits at celebratory privilege pricing. Ends soon.",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.model("Setting", SettingSchema);
