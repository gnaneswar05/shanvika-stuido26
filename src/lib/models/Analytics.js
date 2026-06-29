import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["view", "whatsapp_click", "search", "wishlist_add"],
    },
    targetId: {
      type: String, // product slug, search query, or category name
      required: true,
    },
    device: {
      type: String,
      default: "desktop",
    },
    referrer: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
