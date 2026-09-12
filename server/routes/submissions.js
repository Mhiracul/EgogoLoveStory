import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import GuestSubmission from "../models/GuestSubmission.js";
import Gallery from "../models/Gallery.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------------------------
// UPLOAD DIRECTORIES
// ------------------------------------

const submissionDirectory = path.join(
  process.cwd(),
  "server",
  "uploads",
  "submissions",
);

const galleryDirectory = path.join(
  process.cwd(),
  "server",
  "uploads",
  "gallery",
);

if (!fs.existsSync(submissionDirectory)) {
  fs.mkdirSync(submissionDirectory, {
    recursive: true,
  });
}

if (!fs.existsSync(galleryDirectory)) {
  fs.mkdirSync(galleryDirectory, {
    recursive: true,
  });
}

// ------------------------------------
// MULTER STORAGE
// ------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

// ------------------------------------
// FILE FILTER
// ------------------------------------

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
      const filePath = path.join(submissionDirectory, req.file.filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    const imageUrl = `/uploads/submissions/${req.file.filename}`;

    const submission = await GuestSubmission.create({
      guestName: guestName.trim(),
      caption: caption?.trim() || "",
      image: imageUrl,
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

    if (req.file) {
      const filePath = path.join(submissionDirectory, req.file.filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
  let galleryFilePath = null;

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

    const submissionFilename = path.basename(submission.image);

    const oldFilePath = path.join(submissionDirectory, submissionFilename);

    if (!fs.existsSync(oldFilePath)) {
      return res.status(404).json({
        success: false,
        message: "The uploaded image could not be found.",
      });
    }

    // Create a unique filename for the public gallery
    const galleryFilename = `guest-${Date.now()}-${submissionFilename}`;

    galleryFilePath = path.join(galleryDirectory, galleryFilename);

    // Copy submission image into gallery folder
    fs.copyFileSync(oldFilePath, galleryFilePath);

    const galleryImageUrl = `/uploads/gallery/${galleryFilename}`;

    // Create Gallery record
    const galleryPhoto = await Gallery.create({
      image: galleryImageUrl,
      caption: submission.caption || `Shared by ${submission.guestName}`,
      category: "Special Moments",
      featured: false,
      order: 0,
    });

    // Link submission to Gallery photo
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

    // Remove copied gallery file if approval failed
    if (galleryFilePath && fs.existsSync(galleryFilePath)) {
      fs.unlinkSync(galleryFilePath);
    }

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

    // Don't allow an approved photo to become rejected
    // because it already exists in the public Gallery.
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

    // ------------------------------------
    // IF APPROVED:
    // Delete the linked Gallery record
    // and its physical gallery image.
    // ------------------------------------

    if (submission.galleryPhoto) {
      const galleryPhoto = await Gallery.findById(submission.galleryPhoto);

      if (galleryPhoto) {
        if (galleryPhoto.image?.startsWith("/uploads/gallery/")) {
          const galleryFilename = path.basename(galleryPhoto.image);

          const galleryFilePath = path.join(galleryDirectory, galleryFilename);

          if (fs.existsSync(galleryFilePath)) {
            fs.unlinkSync(galleryFilePath);
          }
        }

        await Gallery.findByIdAndDelete(galleryPhoto._id);
      }
    }

    // ------------------------------------
    // Delete original submission image
    // ------------------------------------

    if (submission.image?.startsWith("/uploads/submissions/")) {
      const filename = path.basename(submission.image);

      const filePath = path.join(submissionDirectory, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // ------------------------------------
    // Delete submission record
    // ------------------------------------

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
