import express from "express";
import multer from "multer";
import path from "path";

import Gallery from "../models/Gallery.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ------------------------------------
// MULTER — STORE IMAGE IN MEMORY
// ------------------------------------

const storage = multer.memoryStorage();

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
// HELPER — UPLOAD TO CLOUDINARY
// ------------------------------------

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "egogolovestory/gallery",
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

    uploadStream.end(file.buffer);
  });
};

// ------------------------------------
// HELPER — DELETE FROM CLOUDINARY
// ------------------------------------

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

// ------------------------------------
// PUBLIC — GET GALLERY
// ------------------------------------

router.get("/", async (req, res) => {
  try {
    const photos = await Gallery.find().sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch gallery.",
    });
  }
});

// ------------------------------------
// ADMIN — GET ALL GALLERY PHOTOS
// ------------------------------------

router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const photos = await Gallery.find().sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    console.error("Admin gallery fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch gallery.",
    });
  }
});

// ------------------------------------
// ADMIN — ADD PHOTO
// ------------------------------------

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const { caption, category, featured, order } = req.body;

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file);

    const photo = await Gallery.create({
      image: cloudinaryResult.secure_url,
      caption: caption || "",
      category: category || "Pre-Wedding",
      featured: featured === "true",
      order: Number(order) || 0,
    });

    // Save Cloudinary public ID separately
    photo.cloudinaryPublicId = cloudinaryResult.public_id;

    await photo.save();

    res.status(201).json({
      success: true,
      message: "Photo added successfully.",
      data: photo,
    });
  } catch (error) {
    console.error("Gallery creation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to add photo.",
    });
  }
});

// ------------------------------------
// ADMIN — UPDATE PHOTO
// ------------------------------------

router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found.",
      });
    }

    const { caption, category, featured, order } = req.body;

    // If a new image was uploaded
    if (req.file) {
      // Upload new image first
      const cloudinaryResult = await uploadToCloudinary(req.file);

      // Delete old Cloudinary image
      if (photo.cloudinaryPublicId) {
        await deleteFromCloudinary(photo.cloudinaryPublicId);
      }

      photo.image = cloudinaryResult.secure_url;
      photo.cloudinaryPublicId = cloudinaryResult.public_id;
    }

    if (caption !== undefined) {
      photo.caption = caption;
    }

    if (category !== undefined) {
      photo.category = category;
    }

    if (featured !== undefined) {
      photo.featured = featured === "true";
    }

    if (order !== undefined) {
      photo.order = Number(order) || 0;
    }

    await photo.save();

    res.status(200).json({
      success: true,
      message: "Photo updated successfully.",
      data: photo,
    });
  } catch (error) {
    console.error("Gallery update error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to update photo.",
    });
  }
});

// ------------------------------------
// ADMIN — DELETE PHOTO
// ------------------------------------

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found.",
      });
    }

    // Delete image from Cloudinary
    if (photo.cloudinaryPublicId) {
      await deleteFromCloudinary(photo.cloudinaryPublicId);
    }

    // Delete MongoDB record
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully.",
    });
  } catch (error) {
    console.error("Gallery delete error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete photo.",
    });
  }
});

export default router;
