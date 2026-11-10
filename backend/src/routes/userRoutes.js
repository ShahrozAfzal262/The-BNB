import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/authMiddleware.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isAdminUser } from "../utils/admin.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const [listings, bookings, savedStays] = await Promise.all([
      Listing.countDocuments({ host: req.user._id }),
      Booking.countDocuments({ guest: req.user._id, status: { $in: ["pending", "confirmed"] } }),
      User.findById(req.user._id).select("favorites").lean(),
    ]);
    res.json({
      user: { id: req.user._id, name: req.user.name, email: req.user.email, isAdmin: isAdminUser(req.user) },
      stats: { listings, bookings, favorites: savedStays.favorites.length },
    });
  }),
);

router.get(
  "/me/listings",
  asyncHandler(async (req, res) => {
    const listings = await Listing.find({ host: req.user._id }).sort({ createdAt: -1 });
    res.json({ listings });
  }),
);

router.get(
  "/me/favorites",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: { path: "host", select: "name" },
    });
    res.json({ listings: user.favorites });
  }),
);

router.put(
  "/me/favorites/:listingId",
  asyncHandler(async (req, res) => {
    const { listingId } = req.params;
    if (!mongoose.isValidObjectId(listingId)) {
      return res.status(400).json({ message: "Invalid listing identifier" });
    }
    const listingExists = await Listing.exists({ _id: listingId });
    if (!listingExists) return res.status(404).json({ message: "Stay not found" });

    const alreadySaved = req.user.favorites.some((id) => id.toString() === listingId);
    if (alreadySaved) {
      await User.updateOne({ _id: req.user._id }, { $pull: { favorites: listingId } });
    } else {
      await User.updateOne({ _id: req.user._id }, { $addToSet: { favorites: listingId } });
    }
    return res.json({ saved: !alreadySaved });
  }),
);

export default router;
