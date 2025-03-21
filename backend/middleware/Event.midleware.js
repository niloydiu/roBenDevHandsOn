import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// this middleware checks if the user is authenticated for event routes
export const authenticateUser = async (req, res, next) => {
  console.log("Starting authentication for event routes...");

  // this gets the auth header
  const authHeader = req.headers.authorization;
  console.log("Auth header exists:", !!authHeader);

  // check if there's an auth header
  if (!authHeader) {
    console.log("No auth header found!");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  // split the token from "Bearer token"
  const tokenParts = authHeader.split(" ");
  console.log("Auth header parts:", tokenParts.length);

  // make sure we have Bearer and token
  if (tokenParts.length !== 2) {
    console.log("Invalid auth header format");
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization format" });
  }

  // get the token part
  const token = tokenParts[1];
  console.log("Token length:", token.length);

  try {
    // check if token is valid with jwt.verify
    console.log("Verifying JWT token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token is valid! User ID:", decoded.id);

    // look up user in database
    console.log("Looking up user...");
    const user = await User.findById(decoded.id);

    // if user doesn't exist
    if (!user) {
      console.log("User not found in database!");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    console.log("User found:", user.name);

    // add user to req object so we can use it later
    // only adding id to save memory
    req.user = { id: user._id };

    console.log("Authentication successful");

    // go to the next function
    next();
  } catch (error) {
    // if anything goes wrong
    console.log("AUTH ERROR TYPE:", error.name);
    console.log("AUTH ERROR MESSAGE:", error.message);

    // print full error for debugging
    console.log("FULL ERROR:", error);

    // send error response
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
