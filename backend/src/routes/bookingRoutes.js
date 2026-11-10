import { Router } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { platformFeePercent } from "../utils/admin.js";

const router = Router();
const MAX_GUESTS = 12;

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate({ path: "listing", select: "title location image price host kind priceUnit" })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  }),
);


router.get(
  "/host",
  asyncHandler(async (req, res) => {
    const listings = await Listing.find({ host: req.user._id }).select("_id");

    const listingIds = listings.map((listing) => listing._id);

    const bookings = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate("guest", "name email")
      .populate("listing", "title location image price")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  }),
);

router.get(
  "/host/earnings",
  asyncHandler(async (req, res) => {
    const listings = await Listing.find({ host: req.user._id }).select("_id");

    const listingIds = listings.map((listing) => listing._id);

    const bookings = await Booking.find({
      listing: { $in: listingIds },
      status: "confirmed",
    }).select("totalPrice");

    const gross = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
    const fee = platformFeePercent();
    const platformFee = Math.round(gross * fee) / 100;
    const totalEarnings = Math.round((gross - platformFee) * 100) / 100;

    res.json({
      totalEarnings,
      grossBookings: gross,
      platformFee,
      platformFeePercent: fee,
      confirmedBookings: bookings.length,
    });
  }),
);

router.patch(
  "/host/:id/status",
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking identifier" });
    }

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const listing = await Listing.findOne({
      _id: booking.listing,
      host: req.user._id,
    });

    if (!listing) {
      return res.status(403).json({ message: "You cannot manage this booking" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be updated" });
    }

    if (status === "confirmed") {
      const conflict = await Booking.exists({
        _id: { $ne: booking._id },
        listing: booking.listing,
        status: "confirmed",
        checkIn: { $lt: booking.checkOut },
        checkOut: { $gt: booking.checkIn },
      });

      if (conflict) {
        return res.status(409).json({
          message: "These dates are already confirmed for another booking",
        });
      }
    }

    booking.status = status;
    await booking.save();

    await booking.populate("guest", "name email");
    await booking.populate("listing", "title location image price");

    return res.json({ booking });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { listingId, checkIn, checkOut, guests } = req.body;
    if (!mongoose.isValidObjectId(listingId)) {
      return res.status(400).json({ message: "Choose a valid stay" });
    }

    const numberOfGuests = Number(guests);
    const start = new Date(checkIn);
    if (
      Number.isNaN(start.getTime()) ||
      start < new Date(new Date().toDateString()) ||
      !Number.isInteger(numberOfGuests) ||
      numberOfGuests < 1
    ) {
      return res.status(400).json({ message: "Choose valid dates and a guest count" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Stay not found" });
    if (listing.host.equals(req.user._id)) {
      return res.status(400).json({ message: "You cannot book your own stay" });
    }
    if (listing.comingSoon) {
      return res.status(400).json({ message: "This is not open for booking yet" });
    }
    if (numberOfGuests > MAX_GUESTS) {
      return res.status(400).json({ message: `You can book for up to ${MAX_GUESTS} guests` });
    }

    const isActivity = listing.kind === "Experience" || listing.kind === "Service";
    let end;
    let totalPrice;

    if (isActivity) {
      // One date, many guests can share the same activity: no date conflict check.
      end = new Date(start.getTime() + 86400000);
      totalPrice = listing.priceUnit === "guest" ? listing.price * numberOfGuests : listing.price;
      if (listing.minimumSpend) totalPrice = Math.max(totalPrice, listing.minimumSpend);
    } else {
      end = new Date(checkOut);
      if (Number.isNaN(end.getTime()) || end <= start) {
        return res.status(400).json({ message: "Check-out must be after check-in" });
      }

      const conflict = await Booking.exists({
        listing: listing._id,
        status: { $in: ["pending", "confirmed"] },
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      });
      if (conflict) return res.status(409).json({ message: "Those dates are already booked" });

      const nights = Math.ceil((end - start) / 86400000);
      totalPrice = listing.price * nights;
    }

    const booking = await Booking.create({
      listing: listing._id,
      guest: req.user._id,
      checkIn: start,
      checkOut: end,
      guests: numberOfGuests,
      totalPrice,
      status: "pending",
    });
    const populatedBooking = await booking.populate("listing", "title location image price kind priceUnit");
    return res.status(201).json({ booking: populatedBooking });
  }),
);

router.patch(
  "/:id/cancel",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking identifier" });
    }
    const booking = await Booking.findOneAndUpdate(
     {
  _id: req.params.id,
  guest: req.user._id,
  status: { $in: ["pending", "confirmed"] },
},
      { status: "cancelled" },
      { new: true },
    ).populate("listing", "title location image price");
    if (!booking) return res.status(404).json({ message: "Booking not found or already cancelled" });
    return res.json({ booking });
  }),
);

export default router;
