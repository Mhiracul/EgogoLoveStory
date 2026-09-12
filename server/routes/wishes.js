import express from "express";

import Wish from "../models/Wish.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------------------------
// PUBLIC — SUBMIT WEDDING WISH
// ------------------------------------

router.post("/", async (req, res) => {
  try {
    const { guestName, message } = req.body;

    if (!guestName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write a message.",
      });
    }

    const wish = await Wish.create({
      guestName: guestName.trim(),
      message: message.trim(),
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you for your beautiful message. It has been received and will appear after review.",
      data: wish,
    });
  } catch (error) {
    console.error("Wedding wish submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your message.",
    });
  }
});

// ------------------------------------
// PUBLIC — GET APPROVED WISHES
// ------------------------------------

router.get("/", async (req, res) => {
  try {
    const wishes = await Wish.find({
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: wishes.length,
      data: wishes,
    });
  } catch (error) {
    console.error("Wedding wishes fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wedding wishes.",
    });
  }
});

// ------------------------------------
// ADMIN — GET ALL WISHES
// ------------------------------------

router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const wishes = await Wish.find().sort({
      status: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: wishes.length,
      data: wishes,
    });
  } catch (error) {
    console.error("Admin wedding wishes fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wedding wishes.",
    });
  }
});

// ------------------------------------
// ADMIN — APPROVE WISH
// ------------------------------------

router.patch("/admin/:id/approve", authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id);

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: "Wedding wish not found.",
      });
    }

    if (wish.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "This wish is already approved.",
      });
    }

    wish.status = "approved";
    wish.reviewedAt = new Date();

    await wish.save();

    return res.status(200).json({
      success: true,
      message: "Wedding wish approved.",
      data: wish,
    });
  } catch (error) {
    console.error("Wedding wish approval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to approve wedding wish.",
    });
  }
});

// ------------------------------------
// ADMIN — REJECT WISH
// ------------------------------------

router.patch("/admin/:id/reject", authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id);

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: "Wedding wish not found.",
      });
    }

    wish.status = "rejected";
    wish.reviewedAt = new Date();

    await wish.save();

    return res.status(200).json({
      success: true,
      message: "Wedding wish rejected.",
      data: wish,
    });
  } catch (error) {
    console.error("Wedding wish rejection error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject wedding wish.",
    });
  }
});

// ------------------------------------
// ADMIN — DELETE WISH
// ------------------------------------

router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findByIdAndDelete(req.params.id);

    if (!wish) {
      return res.status(404).json({
        success: false,
        message: "Wedding wish not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wedding wish deleted successfully.",
    });
  } catch (error) {
    console.error("Wedding wish deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete wedding wish.",
    });
  }
});

export default router;
