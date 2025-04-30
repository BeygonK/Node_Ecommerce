import jwt from "jsonwebtoken";
import User from "../models/User.js";

//import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
//import User from "../models/User.js";

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header OR cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2. If no token, block access
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 4. Attach user to request (omit password)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Token error:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};
