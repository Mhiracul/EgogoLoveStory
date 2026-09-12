import express from "express";
import multer from "multer";

import GuestSubmission from "../models/GuestSubmission.js";
import Gallery from "../models/Gallery.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ------------------------------------
// MULTER MEMORY STORAGE
// ------------------------------------

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ------------------------------------
// CLOUDINARY UPLOAD HELPER
// ------------------------------------

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "egogolovestory/guest-submissions",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });

// ------------------------------------
// PUBLIC — GUEST SUBMIT PHOTO
// ------------------------------------

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const { guestName, caption } = req.body;

    if (!guestName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    const submission = await GuestSubmission.create({
      guestName: guestName.trim(),
      caption: caption?.trim() || "",
      image: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Your photo has been submitted successfully. Thank you for sharing this memory with us!",
      data: submission,
    });
  } catch (error) {
    console.error("Guest photo submission error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit your photo.",
    });
  }
});

// ------------------------------------
// ADMIN — GET ALL SUBMISSIONS
// ------------------------------------

router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const submissions = await GuestSubmission.find()
      .populate("galleryPhoto")
      .sort({
        status: 1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Guest submissions fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch guest submissions.",
    });
  }
});

// ------------------------------------
// ADMIN — APPROVE SUBMISSION
// ------------------------------------

router.patch("/admin/:id/approve", authMiddleware, async (req, res) => {
  try {
    const submission = await GuestSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (submission.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "This submission is already approved.",
      });
    }

    if (!submission.image) {
      return res.status(400).json({
        success: false,
        message: "This submission has no image.",
      });
    }

    // Reuse the existing Cloudinary image.
    // We do NOT upload/copy the image again.
    const galleryPhoto = await Gallery.create({
      image: submission.image,
      cloudinaryPublicId: submission.cloudinaryPublicId || "",
      caption: submission.caption || `Shared by ${submission.guestName}`,
      category: "Special Moments",
      featured: false,
      order: 0,
    });

    submission.status = "approved";
    submission.galleryPhoto = galleryPhoto._id;
    submission.reviewedAt = new Date();

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Photo approved and added to the gallery.",
      data: {
        submission,
        galleryPhoto,
      },
    });
  } catch (error) {
    console.error("Guest submission approval error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to approve submission.",
    });
  }
});

// ------------------------------------
// ADMIN — REJECT SUBMISSION
// ------------------------------------

router.patch("/admin/:id/reject", authMiddleware, async (req, res) => {
  try {
    const submission = await GuestSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (submission.status === "approved") {
      return res.status(400).json({
        success: false,
        message:
          "An approved photo cannot be rejected. Remove it from the gallery instead.",
      });
    }

    submission.status = "rejected";
    submission.reviewedAt = new Date();

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Photo rejected.",
      data: submission,
    });
  } catch (error) {
    console.error("Guest submission rejection error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject submission.",
    });
  }
});

// ------------------------------------
// ADMIN — DELETE SUBMISSION
// ------------------------------------

router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const submission = await GuestSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    // If approved, remove the linked Gallery record.
    if (submission.galleryPhoto) {
      await Gallery.findByIdAndDelete(submission.galleryPhoto);
    }

    // Remove the image from Cloudinary.
    if (submission.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(submission.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary guest photo deletion error:",
          cloudinaryError,
        );
      }
    }

    // Remove the submission from MongoDB.
    await GuestSubmission.findByIdAndDelete(submission._id);

    return res.status(200).json({
      success: true,
      message: "Submission and associated gallery photo deleted successfully.",
    });
  } catch (error) {
    console.error("Guest submission deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete submission.",
    });
  }
});

export default router;
