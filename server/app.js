import express from "express";
import cors from "cors";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import asoebiRoutes from "./routes/asoebiRoutes.js";
import giftRoutes from "./routes/giftRoutes.js";
import galleryRoutes from "./routes/gallery.js";
import submissionsRouter from "./routes/submissions.js";
import wishesRouter from "./routes/wishes.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "server", "uploads")),
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Miracle & Steve Wedding API is running ❤️",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Miracle & Steve Wedding API is running ❤️",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/asoebi", asoebiRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/submissions", submissionsRouter);
app.use("/api/wishes", wishesRouter);

export default app;
