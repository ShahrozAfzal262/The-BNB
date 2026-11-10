import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI must be set in backend/.env");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
