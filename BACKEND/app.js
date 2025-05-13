// app.js (Integrated - ES Module)
import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import User from "./Model/UserModel.js"; // Assuming this is the newer model with bcrypt hook

// Routers (legacy + new modules)
import productRouter from "./Routes/ProductRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";
import eventRouter from "./Routes/EventRoutes.js";
import blogPostRouter from "./Routes/BlogPostRoutes.js";
import contactRouter from "./Routes/ContactRoutes.js";

// Replace old auth/user routes with new ones
import authRoutes from "./Routes/AuthRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import promotionRoutes from "./Routes/promotionRoutes.js";
import discountRoutes from "./Routes/discountRoutes.js";
import ticketRoutes from "./Routes/ticketRoutes.js";
import couponCodeRoutes from "./Routes/couponCodeRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import customizationRoutes from "./Routes/customizationRoutes.js";

import { requireAuth } from "./middleware/auth.js";

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;


// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/events', express.static(path.join(__dirname, 'uploads/events')));
app.use('/uploads/blog', express.static(path.join(__dirname, 'uploads/blog')));
console.log(`Static files served from: ${path.join(__dirname, 'uploads')}`);

// Routes
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/events", eventRouter);
app.use("/blogposts", blogPostRouter);
app.use("/contact", contactRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/coupons", couponCodeRoutes);
app.use("/api/reports", requireAuth, reportRoutes);
app.use("/api/customizations", customizationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running and fully integrated!");
});

// MongoDB connection
const connectToDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;
  console.log("--- Connecting to MongoDB ---");
  if (!mongoURI) {
    console.error("❌ MONGO_URI not defined in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Initial admin user creation
const createInitialAdmin = async () => {
  const adminName = 'mandiv';
  const adminEmail = 'mandivt@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || "securepassword123";
  const adminRole = 'admin';

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: adminRole,
        superAdmin: true
      });
      await adminUser.save();
      console.log(`✅ Admin user ${adminEmail} created`);
    } else if (existingAdmin.role !== adminRole) {
      existingAdmin.role = adminRole;
      await existingAdmin.save({ validateBeforeSave: false });
      console.log(`ℹ️ Updated ${adminEmail} to admin role`);
    } else {
      console.log(`✅ Admin user ${adminEmail} already exists`);
    }
  } catch (error) {
    console.error("⚠️ Error creating admin user:", error);
  }
};

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Server bootstrap
const startServer = () => {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

const bootstrap = async () => {
  await connectToDatabase();
  if (process.env.NODE_ENV !== 'production') {
    await createInitialAdmin();
  }
  startServer();
};

bootstrap();
