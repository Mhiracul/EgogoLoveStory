import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const PORT = 5001;

const startServer = async () => {
  try {
    // Import these only AFTER dotenv has loaded
    const { default: connectDB } = await import("./config/db.js");
    const { default: app } = await import("./app.js");

    await connectDB();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("💒 MIRACLE & STEVE WEDDING API");
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
