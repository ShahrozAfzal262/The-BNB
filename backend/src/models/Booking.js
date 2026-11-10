import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1, max: 30 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
  type: String,
  enum: ["pending", "confirmed", "cancelled"],
  default: "pending",
},
  },
  { timestamps: true },
);

bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);
