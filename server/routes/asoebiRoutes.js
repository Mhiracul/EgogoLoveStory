import express from "express";
import AsoebiOrder from "../models/AsoebiOrder.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const ASOEBI_PRICE = 50000;

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await AsoebiOrder.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch Asoebi orders.",
    });
  }
});

// ==========================================
// ADMIN - GET ONE ORDER
// ==========================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await AsoebiOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Asoebi order not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch Asoebi order.",
    });
  }
});

// ==========================================
// CREATE ASOEBI ORDER
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      packageName,
      quantity,
      size,
      notes,
    } = req.body;

    if (!customerName || !phone || !email || !packageName || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericQuantity) || numericQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const totalAmount = ASOEBI_PRICE * numericQuantity;

    const order = await AsoebiOrder.create({
      customerName,
      phone,
      email,
      address,
      packageName,
      quantity: numericQuantity,
      size,
      amount: totalAmount,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Asoebi order created successfully.",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating your order.",
    });
  }
});

// ==========================================
// INITIALIZE PAYSTACK PAYMENT
// ==========================================
router.post("/initialize-payment", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const order = await AsoebiOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Asoebi order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid for.",
      });
    }

    const expectedAmount = ASOEBI_PRICE * Number(order.quantity);

    if (Number(order.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Order amount is invalid.",
      });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Paystack is not configured on the server.",
      });
    }

    // Paystack expects the amount in kobo.
    const amountInKobo = expectedAmount * 100;

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: order.email,
          amount: amountInKobo,
          currency: "NGN",
          metadata: {
            orderId: order._id.toString(),
            customerName: order.customerName,
            phone: order.phone,
            packageName: order.packageName,
            quantity: order.quantity,
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

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully.",
      data: {
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
    });
  } catch (error) {
    console.error("Payment initialization error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to initialize payment.",
    });
  }
});

// ==========================================
// VERIFY PAYSTACK PAYMENT
// ==========================================
router.post("/verify-payment", async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment reference and order ID are required.",
      });
    }

    const order = await AsoebiOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Asoebi order not found.",
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

    const expectedAmount = ASOEBI_PRICE * Number(order.quantity);
    const expectedAmountInKobo = expectedAmount * 100;

    // IMPORTANT:
    // Verify both payment status and amount.
    if (
      transaction.status !== "success" ||
      Number(transaction.amount) !== expectedAmountInKobo
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified.",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: {
        order,
        reference: transaction.reference,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
});

// ==========================================
// ADMIN - UPDATE ORDER
// ==========================================
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const allowedFields = ["paymentStatus", "orderStatus", "notes"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const order = await AsoebiOrder.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Asoebi order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asoebi order updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update Asoebi order.",
    });
  }
});

// ==========================================
// ADMIN - DELETE ORDER
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await AsoebiOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Asoebi order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asoebi order deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete Asoebi order.",
    });
  }
});

export default router;
