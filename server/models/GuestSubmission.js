import mongoose from "mongoose";

const guestSubmissionSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    galleryPhoto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("GuestSubmission", guestSubmissionSchema);
