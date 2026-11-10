import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    // Stay = homes, Hotel = hotel rooms, Experience / Service = bookable activities
    kind: { type: String, enum: ["Stay", "Hotel", "Experience", "Service"], default: "Stay", index: true },
    category: {
      type: String,
      required: true,
      enum: ["Beachfront", "Cabins", "Design", "Countryside", "Pools", "Mountains", "City", "Hotel", "Experience", "Service"],
    },
    propertyType: { type: String, trim: true, maxlength: 40 },
    city: { type: String, trim: true, maxlength: 80 },
    price: { type: Number, required: true, min: 0, max: 100000 },
    // night = per night (stays / hotels), guest = per person, group = flat price
    priceUnit: { type: String, enum: ["night", "guest", "group"], default: "night" },
    minimumSpend: { type: Number, min: 0 },
    comingSoon: { type: Boolean, default: false },
    badge: { type: String, trim: true, maxlength: 30 },
    guests: { type: Number, required: true, min: 1, max: 30, default: 2 },
    bedrooms: { type: Number, required: true, min: 0, max: 30, default: 1 },
    bathrooms: { type: Number, required: true, min: 1, max: 30, default: 1 },
    image: { type: String, required: true, trim: true, maxlength: 1000 },
    images: [{ type: String, trim: true, maxlength: 1000 }],
    amenities: [{ type: String, trim: true, maxlength: 60 }],
    instantBook: { type: Boolean, default: false },
    freeCancellation: { type: Boolean, default: false },
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    // Which home-page rows this listing belongs to (bahria, free-cancellation, hotels-paris ...)
    collections: [{ type: String, trim: true, lowercase: true, maxlength: 60 }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    reviews: { type: Number, min: 0, default: 0 },
    rank: { type: Number, default: 0 },
    seedKey: { type: String, index: true },
  },
  { timestamps: true },
);

listingSchema.index({ location: "text", title: "text", description: "text" });
listingSchema.index({ collections: 1, rank: 1 });
listingSchema.index({ city: 1, kind: 1 });

export default mongoose.model("Listing", listingSchema);
