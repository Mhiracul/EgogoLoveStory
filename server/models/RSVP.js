import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema(
  {
    name: {
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

    attendance: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    event: {
      type: String,
      enum: ["traditional", "church", "reception", "all"],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

const RSVP = mongoose.model("RSVP", rsvpSchema);

export default RSVP;
