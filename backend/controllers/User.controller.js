import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.model.js";

// this function lets users register
const registerUser = async (req, res) => {
  try {
    // get stuff from request body
    const { name, email, password } = req.body;

    // check if all fields are there
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // find if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // password needs to be 6+ chars
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // make password secure with bcrypt
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      // adding zeros for counting stuff
      eventsCreated: 0,
      teamsCreated: 0,
      helpRequested: 0,
      helpOffered: 0,
    };

    // save user to db
    const newUser = await User(userData);
    const user = await newUser.save();
    console.log("User saved with id: " + user._id);

    // make a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ success: true, token });
  } catch (error) {
    // if something breaks
    console.log("ERROR in registerUser:");
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// this lets users login
const loginUser = async (req, res) => {
  try {
    // get email and password
    const { email, password } = req.body;

    // make sure they're not empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // check email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // look for user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    } else {
      // if password is right, make token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    // if something breaks
    console.log("ERROR in loginUser:");
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// this gets user profile
const userProfile = async (req, res) => {
  try {
    // this is how to get related data
    const user = await User.findById(req.user.id)
      .select("-password") // don't include password
      .populate("teams", "name avatar description cause memberCount")
      .populate("eventsJoined", "title date location")
      .populate("pendingHours.event", "title date location"); // Added population for pending hours events

    if (!user) {
      console.log("No user found with that ID!");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // return the user
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("ERROR in userProfile:");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// this lets user update their profile
const updateUser = async (req, res) => {
  try {
    // get the fields to update
    const { name, email, skills, causes } = req.body;

    // check required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    // save updated user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // user ID from auth middleware
      {
        name: name, // setting each field
        email: email,
        skills: skills, // skills array
        causes: causes, // causes array
      },
      { new: true, runValidators: true } // options to return new doc and validate
    ).select("-password"); // don't return password

    // check if user exists
    if (!updatedUser) {
      console.log("No user found to update!");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("User updated: " + updatedUser._id);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("ERROR in updateUser:");
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all pending hours (admin function)
const getPendingHours = async (req, res) => {
  try {
    // Only admins or team leaders should access this
    // TODO: Add role check here

    // Get all users with pending hours
    const users = await User.find({ "pendingHours.status": "pending" })
      .select("name email pendingHours")
      .populate("pendingHours.event");

    res.status(200).json({
      success: true,
      pendingHours: users,
    });
  } catch (error) {
    console.error("Error getting pending hours:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving pending hours",
      error: error.message,
    });
  }
};

// Approve pending hours
const approveHours = async (req, res) => {
  try {
    const { userId, pendingHourId } = req.params;
    const approverId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the pending hour entry
    const pendingHourEntry = user.pendingHours.id(pendingHourId);
    if (!pendingHourEntry) {
      return res.status(404).json({
        success: false,
        message: "Pending hour entry not found",
      });
    }

    // Add the approver to verifications
    pendingHourEntry.verifications.push(approverId);

    // Update status to approved
    pendingHourEntry.status = "approved";

    // Add hours to user's total volunteer hours
    user.volunteerHours = (user.volunteerHours || 0) + pendingHourEntry.hours;

    // Award points (20 points per hour)
    const pointsEarned = pendingHourEntry.hours * 20;
    user.points = (user.points || 0) + pointsEarned;

    // Save the user
    await user.save();

    res.status(200).json({
      success: true,
      message: `Hours approved and ${pointsEarned} points awarded`,
      user: {
        volunteerHours: user.volunteerHours,
        points: user.points,
        pendingHours: user.pendingHours,
      },
    });
  } catch (error) {
    console.error("Error approving hours:", error);
    res.status(500).json({
      success: false,
      message: "Error approving hours",
      error: error.message,
    });
  }
};

// Reject pending hours
const rejectHours = async (req, res) => {
  try {
    const { userId, pendingHourId } = req.params;
    const reviewerId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the pending hour entry
    const pendingHourEntry = user.pendingHours.id(pendingHourId);
    if (!pendingHourEntry) {
      return res.status(404).json({
        success: false,
        message: "Pending hour entry not found",
      });
    }

    // Update status to rejected
    pendingHourEntry.status = "rejected";

    // Add the reviewer to verifications
    pendingHourEntry.verifications.push(reviewerId);

    // Save the user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Hours have been rejected",
      pendingHours: user.pendingHours,
    });
  } catch (error) {
    console.error("Error rejecting hours:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting hours",
      error: error.message,
    });
  }
};

// export all the functions
export {
  approveHours,
  getPendingHours,
  loginUser,
  registerUser,
  rejectHours,
  updateUser,
  userProfile,
};
