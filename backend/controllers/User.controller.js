import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import prisma from "../configs/prisma.js";

const parseJsonField = (field) => {
  try {
    return JSON.parse(field);
  } catch (e) {
    return [];
  }
};

// this function lets users register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        eventsCreatedCount: 0,
        teamsCreatedCount: 0,
        helpRequestedCount: 0,
        helpOfferedCount: 0,
        skills: "[]",
        causes: "[]"
      }
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log("ERROR in registerUser:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// this lets users login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ success: false, message: "User not found or invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.log("ERROR in loginUser:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// this gets user profile
const userProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        teamsJoined: {
          include: {
            team: {
              select: { name: true, avatar: true, description: true, cause: true, memberCount: true }
            }
          }
        },
        joinedEvents: {
          select: { title: true, date: true, location: true }
        },
        pendingHours: {
          include: {
            event: { select: { title: true, date: true, location: true } }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.skills = parseJsonField(user.skills);
    userWithoutPassword.causes = parseJsonField(user.causes);
    
    // Format teams to match previous behavior
    userWithoutPassword.teams = user.teamsJoined.map(tj => tj.team);
    delete userWithoutPassword.teamsJoined;

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log("ERROR in userProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// this lets user update their profile
const updateUser = async (req, res) => {
  try {
    const { name, email, skills, causes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        ...(skills && { skills: JSON.stringify(skills) }),
        ...(causes && { causes: JSON.stringify(causes) })
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;
    userWithoutPassword.skills = parseJsonField(updatedUser.skills);
    userWithoutPassword.causes = parseJsonField(updatedUser.causes);

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log("ERROR in updateUser:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all pending hours (admin function)
const getPendingHours = async (req, res) => {
  try {
    const pendingHours = await prisma.pendingHour.findMany({
      where: { status: "pending" },
      include: {
        user: { select: { name: true, email: true } },
        event: true
      }
    });

    // Formatting it nicely to roughly match old behavior where it returned users
    // But returning pending hours directly is cleaner.
    res.status(200).json({
      success: true,
      pendingHours: pendingHours,
    });
  } catch (error) {
    console.error("Error getting pending hours:", error);
    res.status(500).json({ success: false, message: "Error retrieving pending hours", error: error.message });
  }
};

// Approve pending hours
const approveHours = async (req, res) => {
  try {
    const { userId, pendingHourId } = req.params;
    const approverId = req.user.id;

    const pendingHour = await prisma.pendingHour.findUnique({
      where: { id: pendingHourId }
    });

    if (!pendingHour || pendingHour.userId !== userId) {
      return res.status(404).json({ success: false, message: "Pending hour entry not found" });
    }

    let verifications = parseJsonField(pendingHour.verifications);
    if (!verifications.includes(approverId)) {
      verifications.push(approverId);
    }

    const pointsEarned = pendingHour.hours * 20;

    const [updatedPendingHour, updatedUser] = await prisma.$transaction([
      prisma.pendingHour.update({
        where: { id: pendingHourId },
        data: {
          status: "approved",
          verifications: JSON.stringify(verifications)
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          volunteerHours: { increment: pendingHour.hours },
          points: { increment: pointsEarned }
        },
        include: { pendingHours: true }
      })
    ]);

    await prisma.notification.create({
      data: {
        type: "application",
        title: "Hours Approved",
        message: `Your pending hours have been approved! You earned ${pointsEarned} points.`,
        userId: userId
      }
    });

    res.status(200).json({
      success: true,
      message: `Hours approved and ${pointsEarned} points awarded`,
      user: {
        volunteerHours: updatedUser.volunteerHours,
        points: updatedUser.points,
        pendingHours: updatedUser.pendingHours,
      },
    });
  } catch (error) {
    console.error("Error approving hours:", error);
    res.status(500).json({ success: false, message: "Error approving hours", error: error.message });
  }
};

// Reject pending hours
const rejectHours = async (req, res) => {
  try {
    const { userId, pendingHourId } = req.params;
    const reviewerId = req.user.id;

    const pendingHour = await prisma.pendingHour.findUnique({
      where: { id: pendingHourId }
    });

    if (!pendingHour || pendingHour.userId !== userId) {
      return res.status(404).json({ success: false, message: "Pending hour entry not found" });
    }

    let verifications = parseJsonField(pendingHour.verifications);
    if (!verifications.includes(reviewerId)) {
      verifications.push(reviewerId);
    }

    const updatedPendingHour = await prisma.pendingHour.update({
      where: { id: pendingHourId },
      data: {
        status: "rejected",
        verifications: JSON.stringify(verifications)
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { pendingHours: true } });

    await prisma.notification.create({
      data: {
        type: "application",
        title: "Hours Rejected",
        message: `Your pending hours have been rejected.`,
        userId: userId
      }
    });

    res.status(200).json({
      success: true,
      message: "Hours have been rejected",
      pendingHours: user.pendingHours,
    });
  } catch (error) {
    console.error("Error rejecting hours:", error);
    res.status(500).json({ success: false, message: "Error rejecting hours", error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Google token is required" });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ success: false, message: "Invalid Google token payload" });
    }

    const { email, name, sub: googleId } = decoded;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          emailVerified: true,
          verificationLevel: "Bronze"
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId }
      });
    }

    const backendToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token: backendToken, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  approveHours,
  getPendingHours,
  loginUser,
  registerUser,
  rejectHours,
  updateUser,
  userProfile,
  googleLogin,
};
