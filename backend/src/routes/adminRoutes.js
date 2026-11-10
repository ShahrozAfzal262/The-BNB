import { Router } from "express";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { platformFeePercent } from "../utils/admin.js";

const router = Router();
router.use(requireAuth, requireAdmin);

const money = (value) => Math.round(value * 100) / 100;

// Profit / loss overview.
//  - profit  = platform share (fee %) of confirmed bookings, the rest is the host's share
//  - loss    = money from cancelled bookings that was never earned (and the fee lost on it)
//  - pending = booked but not confirmed by the host yet
router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const fee = platformFeePercent();
    const [bookings, listingCounts] = await Promise.all([
      Booking.find()
        .populate({ path: "listing", select: "title host kind", populate: { path: "host", select: "name email" } })
        .populate("guest", "name email")
        .sort({ createdAt: -1 }),
      Listing.aggregate([{ $group: { _id: "$host", listings: { $sum: 1 } } }]),
    ]);

    const totals = { confirmed: 0, pending: 0, cancelled: 0, confirmedCount: 0, pendingCount: 0, cancelledCount: 0 };
    const hosts = new Map();
    const months = new Map();

    const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - i);
      months.set(monthKey(date), {
        label: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        gross: 0,
        profit: 0,
        cancelled: 0,
      });
    }

    for (const count of listingCounts) {
      hosts.set(String(count._id), { id: String(count._id), name: "", email: "", listings: count.listings, bookings: 0, gross: 0, pending: 0, cancelled: 0 });
    }

    for (const booking of bookings) {
      const amount = booking.totalPrice || 0;
      const host = booking.listing?.host;
      const hostKey = host ? String(host._id) : null;

      if (hostKey) {
        if (!hosts.has(hostKey)) hosts.set(hostKey, { id: hostKey, name: "", email: "", listings: 0, bookings: 0, gross: 0, pending: 0, cancelled: 0 });
        const row = hosts.get(hostKey);
        row.name = host.name;
        row.email = host.email;
        if (booking.status === "confirmed") {
          row.gross += amount;
          row.bookings += 1;
        } else if (booking.status === "pending") row.pending += amount;
        else row.cancelled += amount;
      }

      const month = months.get(monthKey(booking.createdAt));
      if (booking.status === "confirmed") {
        totals.confirmed += amount;
        totals.confirmedCount += 1;
        if (month) {
          month.gross += amount;
          month.profit += (amount * fee) / 100;
        }
      } else if (booking.status === "pending") {
        totals.pending += amount;
        totals.pendingCount += 1;
      } else {
        totals.cancelled += amount;
        totals.cancelledCount += 1;
        if (month) month.cancelled += amount;
      }
    }

    const profit = money((totals.confirmed * fee) / 100);
    const hostRows = [...hosts.values()]
      .map((row) => ({
        ...row,
        gross: money(row.gross),
        platformShare: money((row.gross * fee) / 100),
        hostShare: money(row.gross - (row.gross * fee) / 100),
        pending: money(row.pending),
        cancelled: money(row.cancelled),
      }))
      .filter((row) => row.name)
      .sort((a, b) => b.gross - a.gross || b.listings - a.listings);

    res.json({
      feePercent: fee,
      totals: {
        grossBookings: money(totals.confirmed),
        platformProfit: profit,
        hostsShare: money(totals.confirmed - profit),
        pendingAmount: money(totals.pending),
        cancelledAmount: money(totals.cancelled),
        lostPlatformFee: money((totals.cancelled * fee) / 100),
        confirmedCount: totals.confirmedCount,
        pendingCount: totals.pendingCount,
        cancelledCount: totals.cancelledCount,
        listings: listingCounts.reduce((sum, item) => sum + item.listings, 0),
      },
      hosts: hostRows,
      months: [...months.values()].map((month) => ({
        ...month,
        gross: money(month.gross),
        profit: money(month.profit),
        cancelled: money(month.cancelled),
      })),
      recent: bookings.slice(0, 12).map((booking) => ({
        id: booking._id,
        status: booking.status,
        amount: booking.totalPrice,
        createdAt: booking.createdAt,
        listing: booking.listing?.title || "Deleted stay",
        host: booking.listing?.host?.name || "",
        guest: booking.guest?.name || "",
      })),
    });
  }),
);

export default router;
