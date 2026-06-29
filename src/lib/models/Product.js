import mongoose from "mongoose";

const SizeOptionSchema = new mongoose.Schema({
  size: { type: String, required: true },
  priceAdjustment: { type: Number, default: 0 }, // added to basePrice
  stock: { type: Number, default: 0 },
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      default: [],
    },
    videoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: [String], // bullet points
      default: [],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number, // original price before discount
    },
    sizes: {
      type: [SizeOptionSchema],
      default: [],
    },
    colors: {
      type: [String], // array of hex colors or color names
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fabric: {
      type: String,
      default: "Premium Silk/Cotton Blend",
    },
    washCare: {
      type: String,
      default: "Dry Clean Only",
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    flashSaleEnd: {
      type: Date,
    },
    ratings: {
      type: Number,
      default: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    completeTheLook: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    frequentlyBoughtTogether: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
