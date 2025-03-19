import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = { id: user._id }; // Attach user info to the request
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
