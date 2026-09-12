import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    category: {
      type: String,
      enum: ["Pre-Wedding", "Traditional", "Wedding Day", "Special Moments"],
      default: "Pre-Wedding",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Gallery", gallerySchema);
