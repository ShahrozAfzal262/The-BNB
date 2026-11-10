import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDatabase } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import listingRoutes from "./src/routes/listingRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { seedIfEmpty } from "./seed.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in backend/.env");
}

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://the-bnb.vercel.app",
  "https://the-ms1cc5ily-shahrozs-projects-8183a1f3.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json({ limit: "1mb" }));

// Always send fresh data (no stale bookings after switching accounts)
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "airbnb-api" });
});
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

try {
  await connectDatabase(process.env.MONGODB_URI);
  await seedIfEmpty().catch((error) => console.error("Auto-seed failed:", error.message));
  const server = app.listen(port, () => {
    console.log(`Airbnb Clone API listening on http://localhost:${port}`);
  });
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`\nPort ${port} is already in use: an old backend is still running.`);
      console.error(`Windows: run  netstat -ano | findstr :${port}  then  taskkill /PID <number> /F\n`);
    } else {
      console.error(error);
    }
    process.exit(1);
  });
} catch (error) {
  console.error("Could not start the API server:", error);
  process.exitCode = 1;
}
