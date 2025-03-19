import Team from "../models/Team.model.js";

// Create a new team
export const createTeam = async (req, res) => {
  try {
    const { name, description, cause, isPublic, avatar } = req.body;
    const creator = req.user.id; // This comes from the auth middleware

    const newTeam = new Team({
      name,
      description,
      cause,
      isPublic,
      avatar,
      creator,
      members: [{ user: creator, role: "admin" }],
    });

    const savedTeam = await newTeam.save();

    // Populate the creator information for the response
    const populatedTeam = await Team.findById(savedTeam._id)
      .populate("creator", "name email")
      .populate("members.user", "name email");

    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error("Error in team creation:", error);
    res
      .status(500)
      .json({ message: "Error creating team", error: error.message });
  }
};

// Get my teams
export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Team.find({
      "members.user": userId,
    })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching my teams:", error);
    res
      .status(500)
      .json({ message: "Error fetching teams", error: error.message });
  }
};

// Get public teams
export const getPublicTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isPublic: true })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching public teams:", error);
    res
      .status(500)
      .json({ message: "Error fetching teams", error: error.message });
  }
};

// Get team leaderboard
export const getTeamLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("creator", "name email")
      .sort({ hoursContributed: -1, memberCount: -1 })
      .limit(10);

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching team leaderboard:", error);
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: error.message });
  }
};

// Join a team
export const joinTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    // Check if team exists and is public
    const team = await Team.findById(teamId);

    if (!team) {
      console.log("Team not found:", teamId);
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.isPublic) {
      console.log("Team is private:", teamId);
      return res.status(403).json({ message: "This team is private" });
    }

    // Check if user is already a member
    const isMember = team.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this team",
      });
    }

    // Add user to team members
    team.members.push({ user: userId });
    team.memberCount += 1;
    const updatedTeam = await team.save();

    res.status(200).json({
      message: "Successfully joined team",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error joining team:", error);
    res
      .status(500)
      .json({ message: "Error joining team", error: error.message });
  }
};

// Leave a team
export const leaveTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    // Check if team exists
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is a member
    const memberIndex = team.members.findIndex(
      (member) => member.user.toString() === userId.toString()
    );

    if (memberIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not a member of this team" });
    }

    // Check if user is the only admin
    const isAdmin = team.members[memberIndex].role === "admin";
    const adminCount = team.members.filter(
      (member) => member.role === "admin"
    ).length;

    if (isAdmin && adminCount === 1) {
      return res.status(400).json({
        message:
          "You are the only admin. Please assign another admin before leaving.",
      });
    }

    // Remove user from team members
    team.members.splice(memberIndex, 1);
    team.memberCount -= 1;
    await team.save();

    res.status(200).json({ message: "Successfully left team" });
  } catch (error) {
    console.error("Error leaving team:", error);
    res
      .status(500)
      .json({ message: "Error leaving team", error: error.message });
  }
};

// NEW FUNCTIONS ADDED BELOW

// Get team by ID
export const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId)
      .populate("creator", "name email")
      .populate("members.user", "name email")
      .populate("events");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).json({
      message: "Error fetching team details",
      error: error.message,
    });
  }
};

// Update team
export const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is creator
    if (team.creator.toString() !== userId) {
      return res.status(403).json({
        message: "Only the team creator can update this team",
      });
    }

    const { name, description, cause, isPublic, avatar } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { name, description, cause, isPublic, avatar },
      { new: true }
    )
      .populate("creator", "name email")
      .populate("members.user", "name email");

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({
      message: "Error updating team",
      error: error.message,
    });
  }
};

// Delete team
export const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is creator
    if (team.creator.toString() !== userId) {
      return res.status(403).json({
        message: "Only the team creator can delete this team",
      });
    }

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({
      message: "Error deleting team",
      error: error.message,
    });
  }
};
