import { Router } from "express";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findCoordinates } from "../utils/geo.js";

const router = Router();
const categories = ["Beachfront", "Cabins", "Design", "Countryside", "Pools", "Mountains", "City", "Hotel", "Experience", "Service"];
const kinds = ["Stay", "Hotel", "Experience", "Service"];

function validNumber(value, min, max) {
  if (value === undefined || value === null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined;
}

function listingInput(body) {
  const location = body.location;
  const guessed = findCoordinates(location);
  const lat = validNumber(body.lat, -90, 90) ?? guessed?.lat;
  const lng = validNumber(body.lng, -180, 180) ?? guessed?.lng;
  const image = body.image || (Array.isArray(body.images) ? body.images[0] : undefined);

  return {
    title: body.title,
    description: body.description,
    location,
    city: typeof location === "string" ? location.split(",")[0].trim() : undefined,
    category: body.category,
    price: body.price,
    guests: body.guests,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    image,
    images: Array.isArray(body.images) ? body.images.filter(Boolean).slice(0, 10) : image ? [image] : [],
    amenities: Array.isArray(body.amenities) ? body.amenities.slice(0, 20) : [],
    instantBook: body.instantBook === true,
    freeCancellation: body.freeCancellation === true,
    lat,
    lng,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Every word typed in the search box has to appear somewhere in the listing.
function searchFilter(text) {
  const words = text
    .trim()
    .slice(0, 100)
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 6);
  return words.map((word) => {
    const pattern = { $regex: escapeRegex(word), $options: "i" };
    return { $or: [{ title: pattern }, { location: pattern }, { city: pattern }, { description: pattern }] };
  });
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = {};
    const and = [];
    const { category, kind, collection, city, search, minPrice, maxPrice, freeCancellation, instantBook } = req.query;

    if (typeof category === "string" && categories.includes(category)) filter.category = category;
    if (typeof kind === "string") {
      // "Stay,Hotel" is allowed so a search can show homes and hotels together.
      const wanted = kind.split(",").map((item) => item.trim()).filter((item) => kinds.includes(item));
      if (wanted.length) filter.kind = { $in: wanted };
    }
    if (typeof collection === "string" && collection.trim()) filter.collections = collection.trim().toLowerCase();
    if (typeof city === "string" && city.trim()) {
      filter.city = { $regex: `^${escapeRegex(city.trim().slice(0, 80))}$`, $options: "i" };
    }
    if (typeof search === "string" && search.trim()) and.push(...searchFilter(search));
    if (freeCancellation === "true") filter.freeCancellation = true;
    if (instantBook === "true") filter.instantBook = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (Number.isFinite(Number(minPrice))) filter.price.$gte = Number(minPrice);
      if (Number.isFinite(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    }
    if (and.length) filter.$and = and;

    const requested = Number(req.query.limit);
    const limit = Number.isInteger(requested) && requested > 0 ? Math.min(requested, 400) : 100;

    // Listings added by hosts (rank 0) come first, then the seeded rows in their original order.
    const listings = await Listing.find(filter)
      .populate("host", "name")
      .sort({ rank: 1, createdAt: -1 })
      .limit(limit);
    res.json({ listings });
  }),
);

router.get(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing identifier" });
    }
    const today = new Date(new Date().toDateString());
    const bookings = await Booking.find({
      listing: req.params.id,
      status: { $in: ["pending", "confirmed"] },
      checkOut: { $gt: today },
    }).select("checkIn checkOut");
    return res.json({
      booked: bookings.map((booking) => ({ checkIn: booking.checkIn, checkOut: booking.checkOut })),
    });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing identifier" });
    }
    const listing = await Listing.findById(req.params.id).populate("host", "name");
    if (!listing) return res.status(404).json({ message: "Stay not found" });
    return res.json({ listing });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = await Listing.create({ ...listingInput(req.body), host: req.user._id });
    return res.status(201).json({ listing });
  }),
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing identifier" });
    }
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, host: req.user._id },
      listingInput(req.body),
      { new: true, runValidators: true },
    );
    if (!listing) return res.status(404).json({ message: "Stay not found or you do not own it" });
    return res.json({ listing });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid listing identifier" });
    }
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, host: req.user._id });
    if (!listing) return res.status(404).json({ message: "Stay not found or you do not own it" });
    await Booking.deleteMany({ listing: listing._id });
    return res.json({ message: "Stay deleted" });
  }),
);

export default router;
