import mongoose from "mongoose";

const asoebiOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

const AsoebiOrder = mongoose.model("AsoebiOrder", asoebiOrderSchema);

export default AsoebiOrder;
