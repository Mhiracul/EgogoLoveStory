import dotenv from "dotenv";
import app from "../server/app.js";
import connectDB from "../server/config/db.js";

dotenv.config();

let dbConnected = false;

export default async function handler(req, res) {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("API error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
