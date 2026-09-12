import express from "express";

import Gift from "../models/Gift.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const MIN_GIFT_AMOUNT = 1000;

// PUBLIC — GET CONFIRMED GIFTS

router.get("/", async (req, res) => {
  try {
    const gifts = await Gift.find({
      paymentStatus: "paid",
    })

      .select("donorName amount message displayOnGiftWall createdAt")

      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,

      count: gifts.length,

      data: gifts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Unable to fetch gifts.",
    });
  }
});

// CREATE PENDING GIFT

router.post("/", async (req, res) => {
  try {
    const {
      donorName,
      email,
      amount,
      message,
      displayOnGiftWall,
      registryItem,
    } = req.body;
    if (!donorName || !email || !amount) {
      return res.status(400).json({
        success: false,

        message: "Name, email and amount are required.",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return res.status(400).json({
        success: false,

        message: "Please enter a valid gift amount.",
      });
    }

    if (numericAmount < MIN_GIFT_AMOUNT) {
      return res.status(400).json({
        success: false,

        message: `The minimum gift amount is ₦${MIN_GIFT_AMOUNT.toLocaleString()}.`,
      });
    }

    const gift = await Gift.create({
      donorName,
      email,
      amount: numericAmount,
      message,
      displayOnGiftWall: displayOnGiftWall !== false,
      registryItem: registryItem || null,
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,

      message: "Gift created successfully.",

      data: gift,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Unable to create gift.",
    });
  }
});

// INITIALIZE PAYSTACK PAYMENT

router.post("/initialize-payment", async (req, res) => {
  try {
    const { giftId } = req.body;

    if (!giftId) {
      return res.status(400).json({
        success: false,

        message: "Gift ID is required.",
      });
    }

    const gift = await Gift.findById(giftId);

    if (!gift) {
      return res.status(404).json({
        success: false,

        message: "Gift not found.",
      });
    }

    if (gift.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,

        message: "This gift has already been paid for.",
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,

        message: "Paystack is not configured on the server.",
      });
    }

    const amountInKobo = Number(gift.amount) * 100;

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",

      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: gift.email,

          amount: amountInKobo,

          currency: "NGN",

          metadata: {
            giftId: gift._id.toString(),

            donorName: gift.donorName,
          },
        }),
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization failed:", paystackData);

      return res.status(400).json({
        success: false,

        message:
          paystackData.message || "Unable to initialize Paystack payment.",
      });
    }

    gift.reference = paystackData.data.reference;

    await gift.save();

    res.status(200).json({
      success: true,

      message: "Payment initialized successfully.",

      data: {
        access_code: paystackData.data.access_code,

        reference: paystackData.data.reference,
      },
    });
  } catch (error) {
    console.error("Gift payment initialization error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to initialize payment.",
    });
  }
});

// VERIFY PAYSTACK PAYMENT

router.post("/verify-payment", async (req, res) => {
  try {
    const { reference, giftId } = req.body;

    if (!reference || !giftId) {
      return res.status(400).json({
        success: false,

        message: "Payment reference and gift ID are required.",
      });
    }

    const gift = await Gift.findById(giftId);

    if (!gift) {
      return res.status(404).json({
        success: false,

        message: "Gift not found.",
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,

        message: "Paystack is not configured on the server.",
      });
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference,
      )}`,

      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      return res.status(400).json({
        success: false,

        message: paystackData.message || "Unable to verify Paystack payment.",
      });
    }

    const transaction = paystackData.data;

    const expectedAmount = Number(gift.amount) * 100;

    // Make sure this Paystack transaction belongs to this gift

    const metadataGiftId = transaction.metadata?.giftId;

    if (metadataGiftId !== gift._id.toString()) {
      return res.status(400).json({
        success: false,

        message: "Payment does not belong to this gift.",
      });
    }

    if (
      transaction.status !== "success" ||
      Number(transaction.amount) !== expectedAmount ||
      transaction.reference !== reference
    ) {
      return res.status(400).json({
        success: false,

        message: "Payment could not be verified.",
      });
    }

    if (
      transaction.customer?.email?.toLowerCase() !== gift.email.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,

        message: "Payment details do not match this gift.",
      });
    }

    gift.paymentStatus = "paid";

    gift.reference = transaction.reference;

    await gift.save();

    res.status(200).json({
      success: true,

      message: "Gift payment verified successfully.",

      data: {
        gift: {
          _id: gift._id,

          donorName: gift.donorName,

          amount: gift.amount,

          message: gift.message,

          createdAt: gift.createdAt,
        },

        reference: transaction.reference,
      },
    });
  } catch (error) {
    console.error("Gift payment verification error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to verify payment.",
    });
  }
});

// ADMIN — GET ALL GIFTS

router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,

      count: gifts.length,

      data: gifts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Unable to fetch gifts.",
    });
  }
});

// ADMIN — DELETE GIFT

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,

        message: "Gift not found.",
      });
    }

    res.status(200).json({
      success: true,

      message: "Gift deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Unable to delete gift.",
    });
  }
});

export default router;
