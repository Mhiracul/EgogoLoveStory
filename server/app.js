import express from "express";
import cors from "cors";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import asoebiRoutes from "./routes/asoebiRoutes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

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

export default app;
