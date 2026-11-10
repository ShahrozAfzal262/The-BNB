import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isAdminUser } from "../utils/admin.js";

export async function requireAuth(req, _res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(Object.assign(new Error("Please sign in to continue"), { status: 401 }));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return next(Object.assign(new Error("Account not found"), { status: 401 }));
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(Object.assign(new Error("Your session has expired. Please sign in again."), { status: 401 }));
    }
    return next(error);
  }
}

export function requireAdmin(req, _res, next) {
  if (!isAdminUser(req.user)) {
    return next(Object.assign(new Error("Only admins can open this page"), { status: 403 }));
  }
  return next();
}
