import express from "express";
import RSVP from "../models/RSVP.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch RSVPs.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, attendance, guests, event, message } = req.body;

    if (!name || !phone || !attendance || !guests || !event) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const rsvp = await RSVP.create({
      name,
      phone,
      email,
      attendance,
      guests,
      event,
      message,
    });

    res.status(201).json({
      success: true,
      message: "RSVP submitted successfully.",
      data: rsvp,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your RSVP.",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const rsvp = await RSVP.findByIdAndDelete(req.params.id);

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: "RSVP not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "RSVP deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete RSVP.",
    });
  }
});

export default router;
