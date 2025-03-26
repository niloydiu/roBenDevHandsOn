import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("No auth header found!");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2) {
    console.log("Invalid auth header format");
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization format" });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found in database!");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = { id: user._id };

    next();
  } catch (error) {
    console.log("AUTH ERROR TYPE:", error.name);
    console.log("AUTH ERROR MESSAGE:", error.message);
    console.log("FULL ERROR:", error);

    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
