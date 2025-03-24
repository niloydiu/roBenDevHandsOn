import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// this function checks if user is logged in
const authUser = async (req, res, next) => {
  try {
    // get the auth header from the request
    const authHeader = req.headers.authorization;

    // check if auth header exists and starts with Bearer
    if (!authHeader) {
      console.log("No authorization header found!");
      return res.status(401).json({ message: "Authorization token required" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Authorization header doesn't start with Bearer!");
      return res.status(401).json({ message: "Token must be Bearer token" });
    }

    // split the token from Bearer
    const token = authHeader.split(" ")[1];

    // Verify the token - this checks if it's valid
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.log("JWT ERROR:", jwtError.name);
      console.log("JWT ERROR message:", jwtError.message);

      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }

      // if other JWT error
      return res.status(401).json({ message: "Problem with token" });
    }

    // find user in database - don't include password
    const user = await User.findById(decoded.id).select("-password");

    // if user not found
    if (!user) {
      console.log("No user found with id", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    // store user in req.user so we can use it in other functions
    req.user = user;
    next();
  } catch (error) {
    // something else went wrong
    console.log("CRITICAL AUTH ERROR:");
    console.log(error);

    // send error message
    res.status(401).json({ message: "Request not authorized" });
  }
};

export default authUser;
