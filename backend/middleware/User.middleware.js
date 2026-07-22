import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.js";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("No authorization header found!");
      return res.status(401).json({ message: "Authorization token required" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Authorization header doesn't start with Bearer!");
      return res.status(401).json({ message: "Token must be Bearer token" });
    }

    const token = authHeader.split(" ")[1];

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

      return res.status(401).json({ message: "Problem with token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      console.log("No user found with id", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    // Omit password from req.user
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.log("CRITICAL AUTH ERROR:");
    console.log(error);

    res.status(401).json({ message: "Request not authorized" });
  }
};

export default authUser;
