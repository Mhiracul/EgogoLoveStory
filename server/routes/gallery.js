import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Gallery from "../models/Gallery.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ------------------------------------
// UPLOAD DIRECTORY
// ------------------------------------

const uploadDirectory = path.join(
  process.cwd(),
  "server",
  "uploads",
  "gallery",
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ------------------------------------
// MULTER STORAGE
// ------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
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

    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const photo = await Gallery.create({
      image: imageUrl,
      caption: caption || "",
      category: category || "Pre-Wedding",
      featured: featured === "true",
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Photo added successfully.",
      data: photo,
    });
  } catch (error) {
    console.error("Gallery creation error:", error);

    if (req.file) {
      const filePath = path.join(uploadDirectory, req.file.filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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

    if (req.file) {
      const oldImage = photo.image;

      photo.image = `/uploads/gallery/${req.file.filename}`;

      if (oldImage?.startsWith("/uploads/gallery/")) {
        const oldFilename = path.basename(oldImage);

        const oldFilePath = path.join(uploadDirectory, oldFilename);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
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
    const photo = await Gallery.findByIdAndDelete(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found.",
      });
    }

    if (photo.image?.startsWith("/uploads/gallery/")) {
      const filename = path.basename(photo.image);

      const filePath = path.join(uploadDirectory, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
