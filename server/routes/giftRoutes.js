import express from "express";
import Gift from "../models/Gift.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const MIN_GIFT_AMOUNT = 1000;
const MIN_OUR_HOME_AMOUNT = 50000;

// Trusted registry catalogue.
// These prices must match GiftRegistry.jsx.
const REGISTRY_ITEMS = {
  "pressure-cooker": {
    title: "Silver Crest 10-in-1 Electric Pressure Cooker",
    amount: 143180,
  },
  microwave: {
    title: "Digital Countertop Microwave Oven",
    amount: 75535,
  },
  refrigerator: {
    title: "Double Door Home Refrigerator",
    amount: 238680,
  },
  television: {
    title: "Hisense 4K Smart UHD Television",
    amount: 512500,
  },
  "air-fryer": {
    title: "Digital XL Rapid Air Fryer",
    amount: 64973,
  },
  "juice-extractor": {
    title: "Electric Cold-Press Juice Extractor",
    amount: 33516,
  },
  "dinner-set": {
    title: "16 Pieces Ceramic Dinner Set (Plates, Cups, Bowls)",
    amount: 49850,
  },
  "plate-rack": {
    title: "Stainless Steel Kitchen Plate Rack Organizer",
    amount: 48999,
  },
  bedsheet: {
    title: "Luxury Egyptian Cotton Bed Sheet Set",
    amount: 14950,
  },
  "toyota-rav4": {
    title: "Toyota RAV4 (2014 Model SUV)",
    amount: 10500000,
  },
  "washing-machine": {
    title: "Automatic Front-Load Washing Machine",
    amount: 481525,
  },
  "chest-freezer": {
    title: "Deep Chest Freezer",
    amount: 255320,
  },
  "air-conditioner": {
    title: "Hisense 1.5HP GenCool Dual Inverter Air Conditioner",
    amount: 368600,
  },
  "air-fryer-oven": {
    title:
      "Sedar 24L All Stainless Steel French Door Multifunction Air Fryer Oven + 1 Enamel Bake Tray",
    amount: 245000,
  },
  "glass-bowls": {
    title: "12 Piece Set of High Borosilicate Glass Bowls",
    amount: 60000,
  },
  "adjustable-desk": {
    title: "Adjustable Desk",
    amount: 400000,
  },
  "solar-system": {
    title: "Complete Home Solar Power System",
    amount: 5100000,
  },
  starlink: {
    title: "Starlink High-Speed Internet Setup",
    amount: 650000,
  },
  cutlery: {
    title: "Elegant 24-Piece Cutlery Set",
    amount: 18000,
  },
  "knife-set": {
    title: "Premium Kitchen Knife Set",
    amount: 16500,
  },
  "mug-set": {
    title: "Ceramic Mug Set",
    amount: 12500,
  },
  toaster: {
    title: "2-Slice Electric Toaster",
    amount: 14000,
  },
  "food-processor": {
    title: "16-in-1 Food Processor",
    amount: 155000,
  },
  blanket: {
    title: "Cozy Fleece Blanket",
    amount: 25000,
  },
  "throw-pillows": {
    title: "Decorative Throw Pillows",
    amount: 20000,
  },
  microphone: {
    title: "Hollyland Lark M2 Microphone Combo",
    amount: 160000,
  },
  "honeymoon-fund": {
    title: "Honeymoon Travel & Experience Fund",
    amount: 5000000,
  },
  cookware: {
    title: "High-End Non-Stick Cookware Set (12-Piece)",
    amount: 115500,
  },
  "power-station": {
    title: "Portable Solar Power Station / Powerbox",
    amount: 345000,
  },
  "standing-fan": {
    title: "18-Inch Rechargeable Standing Fan",
    amount: 88500,
  },
  "gas-cooker": {
    title: "Qasa 4 Burners Table Top Glass Gas Cooker",
    amount: 105000,
  },
  "ergonomic-chair": {
    title: "Generic Moq Ergonomic Swivel Mesh High Back Chair With Headrest",
    amount: 116800,
  },
};

const isValidAmount = (value) =>
  Number.isFinite(Number(value)) && Number(value) > 0;

// PUBLIC: GET PAID GIFTS FOR THE GIFT WALL
router.get("/", async (req, res) => {
  try {
    const gifts = await Gift.find({ paymentStatus: "paid" })
      .select("donorName amount message displayOnGiftWall createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gifts.length,
      data: gifts,
    });
  } catch (error) {
    console.error("Unable to fetch gifts:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch gifts.",
    });
  }
});

// CREATE A PENDING GIFT
router.post("/", async (req, res) => {
  try {
    const {
      donorName,
      email,
      amount,
      message,
      displayOnGiftWall,
      registryItem,
      registryItemId,
    } = req.body;

    if (
      typeof donorName !== "string" ||
      !donorName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and amount are required.",
      });
    }

    const submittedAmount = Number(amount);

    if (!isValidAmount(submittedAmount)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid gift amount.",
      });
    }

    let finalAmount = submittedAmount;
    let finalRegistryItem = registryItem || null;
    let finalRegistryItemId = registryItemId || null;

    if (registryItemId) {
      // OUR HOME: CUSTOM CONTRIBUTION
      if (registryItemId === "our-home") {
        if (submittedAmount < MIN_OUR_HOME_AMOUNT) {
          return res.status(400).json({
            success: false,
            message: `Our Home contributions must be at least ₦${MIN_OUR_HOME_AMOUNT.toLocaleString("en-NG")}.`,
          });
        }

        finalAmount = submittedAmount;
        finalRegistryItem = "Our Home";
        finalRegistryItemId = "our-home";
      } else {
        // FIXED-PRICE REGISTRY GIFT
        const catalogueItem = REGISTRY_ITEMS[registryItemId];

        if (!catalogueItem) {
          return res.status(400).json({
            success: false,
            message: "The selected registry item is not valid.",
          });
        }

        if (submittedAmount !== catalogueItem.amount) {
          return res.status(400).json({
            success: false,
            message: `The full price for ${catalogueItem.title} is ₦${catalogueItem.amount.toLocaleString("en-NG")}. Partial payments are not accepted.`,
            expectedAmount: catalogueItem.amount,
          });
        }

        // Always save the trusted server-side price.
        finalAmount = catalogueItem.amount;
        finalRegistryItem = catalogueItem.title;
        finalRegistryItemId = registryItemId;
      }
    } else if (submittedAmount < MIN_GIFT_AMOUNT) {
      // Preserve the existing minimum for general cash gifts.
      return res.status(400).json({
        success: false,
        message: `The minimum gift amount is ₦${MIN_GIFT_AMOUNT.toLocaleString("en-NG")}.`,
      });
    }

    const gift = await Gift.create({
      donorName: donorName.trim(),
      email: email.trim().toLowerCase(),
      amount: finalAmount,
      message: typeof message === "string" ? message.trim() : "",
      displayOnGiftWall: displayOnGiftWall !== false,
      registryItem: finalRegistryItem,
      registryItemId: finalRegistryItemId,
      paymentStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Gift created successfully.",
      data: gift,
    });
  } catch (error) {
    console.error("Unable to create gift:", error);

    return res.status(500).json({
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

    // Revalidate fixed-price gifts before initializing payment.
    if (gift.registryItemId && gift.registryItemId !== "our-home") {
      const catalogueItem = REGISTRY_ITEMS[gift.registryItemId];

      if (!catalogueItem || Number(gift.amount) !== catalogueItem.amount) {
        return res.status(400).json({
          success: false,
          message:
            "The registry gift price is invalid. Please restart checkout.",
        });
      }
    }

    if (
      gift.registryItemId === "our-home" &&
      Number(gift.amount) < MIN_OUR_HOME_AMOUNT
    ) {
      return res.status(400).json({
        success: false,
        message: `Our Home contributions must be at least ₦${MIN_OUR_HOME_AMOUNT.toLocaleString("en-NG")}.`,
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

    if (
      !paystackResponse.ok ||
      !paystackData.status ||
      !paystackData.data?.reference
    ) {
      console.error("Paystack initialization failed:", paystackData);

      return res.status(400).json({
        success: false,
        message:
          paystackData.message || "Unable to initialize Paystack payment.",
      });
    }

    gift.reference = paystackData.data.reference;
    await gift.save();

    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully.",
      data: {
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
    });
  } catch (error) {
    console.error("Gift payment initialization error:", error);

    return res.status(500).json({
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

    // Allow safe repeat verification of the same successful payment.
    if (gift.paymentStatus === "paid") {
      if (gift.reference === reference) {
        return res.status(200).json({
          success: true,
          message: "Gift payment was already verified.",
          data: {
            gift: {
              _id: gift._id,
              donorName: gift.donorName,
              amount: gift.amount,
              message: gift.message,
              createdAt: gift.createdAt,
            },
            reference: gift.reference,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: "This gift has already been paid for.",
      });
    }

    // Only verify the reference saved during initialization.
    if (!gift.reference || gift.reference !== reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference does not match this gift.",
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Paystack is not configured on the server.",
      });
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status || !paystackData.data) {
      return res.status(400).json({
        success: false,
        message: paystackData.message || "Unable to verify Paystack payment.",
      });
    }

    const transaction = paystackData.data;

    // Ensure the Paystack transaction belongs to this gift.
    if (transaction.metadata?.giftId !== gift._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to this gift.",
      });
    }

    let expectedAmountNaira = Number(gift.amount);

    // Recalculate fixed-price gifts from the trusted catalogue.
    if (gift.registryItemId && gift.registryItemId !== "our-home") {
      const catalogueItem = REGISTRY_ITEMS[gift.registryItemId];

      if (!catalogueItem || Number(gift.amount) !== catalogueItem.amount) {
        return res.status(400).json({
          success: false,
          message: "The registry gift price is invalid.",
        });
      }

      expectedAmountNaira = catalogueItem.amount;
    }

    if (
      gift.registryItemId === "our-home" &&
      Number(gift.amount) < MIN_OUR_HOME_AMOUNT
    ) {
      return res.status(400).json({
        success: false,
        message: "Our Home contribution is below the minimum amount.",
      });
    }

    const expectedAmountKobo = expectedAmountNaira * 100;

    if (
      transaction.status !== "success" ||
      Number(transaction.amount) !== expectedAmountKobo ||
      transaction.reference !== reference
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment could not be verified. The full required amount must be paid.",
      });
    }

    if (
      typeof transaction.customer?.email !== "string" ||
      transaction.customer.email.toLowerCase() !== gift.email.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match this gift.",
      });
    }

    gift.paymentStatus = "paid";
    await gift.save();

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
});

// PUBLIC: GET PAID REGISTRY ITEM STATUS
router.get("/registry-status", async (req, res) => {
  try {
    const gifts = await Gift.find({
      paymentStatus: "paid",
      registryItemId: { $in: Object.keys(REGISTRY_ITEMS) },
    })
      .select("registryItemId donorName amount createdAt")
      .sort({ createdAt: 1 })
      .lean();

    const items = {};

    for (const gift of gifts) {
      const id = gift.registryItemId;
      const catalogueItem = REGISTRY_ITEMS[id];

      // Only a verified full-price payment counts as a purchased item.
      if (!catalogueItem || Number(gift.amount) !== catalogueItem.amount) {
        continue;
      }

      if (!items[id]) {
        items[id] = {
          quantityGifted: 0,
          donors: [],
        };
      }

      items[id].quantityGifted += 1;

      items[id].donors.push({
        name: gift.donorName,
        amount: gift.amount,
        createdAt: gift.createdAt,
      });
    }

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Registry status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch registry status.",
    });
  }
});

// ADMIN: GET ALL GIFTS
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const gifts = await Gift.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gifts.length,
      data: gifts,
    });
  } catch (error) {
    console.error("Unable to fetch all gifts:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch gifts.",
    });
  }
});

// ADMIN: DELETE GIFT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: "Gift not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gift deleted successfully.",
    });
  } catch (error) {
    console.error("Unable to delete gift:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete gift.",
    });
  }
});

export default router;
