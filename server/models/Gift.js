import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1000,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    displayOnGiftWall: {
      type: Boolean,
      default: true,
    },

    // Used when the contribution comes from the Gift Registry
    registryItem: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    reference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
