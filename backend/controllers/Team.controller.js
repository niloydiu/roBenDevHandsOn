import mongoose from "mongoose";
import Team from "../models/Team.model.js";
import User from "../models/User.model.js";

// function to make a team
export const createTeam = async (req, res) => {
  try {
    // get stuff from request
    const { name, description, cause, isPublic, avatar } = req.body;
    const userId = req.user.id;

    // print some debug info
    console.log("Making new team called: " + name);
    console.log("User creating team: " + userId);

    // find the user first
    const user = await User.findById(userId);
    if (!user) {
      console.log("Can't find user!");
      return res.status(404).json({ message: "User not found" });
    }

    // print some user stats
    console.log(
      "User " +
        user.name +
        " has created " +
        user.teamsCreated +
        " teams before"
    );

    // create a new team object
    const team = new Team({
      name: name,
      description: description,
      cause: cause,
      isPublic: isPublic !== undefined ? isPublic : true, // default to true
      avatar: avatar,
      creator: userId,
      members: [
        {
          user: userId,
          role: "admin", // creator is admin
          joinedAt: new Date(),
        },
      ],
      memberCount: 1, // start with 1 member (the creator)
    });

    // save to database
    await team.save();
    console.log("Saved new team with id: " + team._id);

    // add team to user's teams list and increase count
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { teams: team._id }, // add to array without duplicates
        $inc: { teamsCreated: 1 }, // increase count by 1
      },
      { new: true } // return updated document
    );

    console.log("Updated user stats:");
    console.log("Teams created: " + updatedUser.teamsCreated);
    console.log("Teams joined count: " + updatedUser.teams.length);

    // return success
    res.status(201).json({
      message: "Team created successfully",
      team: team,
    });
  } catch (error) {
    // if it breaks
    console.log("ERROR in createTeam:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating team", error: error.message });
  }
};

// get all teams
export const getAllTeams = async (req, res) => {
  try {
    // find all teams and populate creator and member info
    const teams = await Team.find()
      .populate("creator", "name email")
      .populate("members.user", "name email");

    console.log("Found " + teams.length + " teams total");
    res.status(200).json(teams);
  } catch (error) {
    console.log("ERROR in getAllTeams:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching teams", error: error.message });
  }
};

// get one team by id
export const getTeamById = async (req, res) => {
  try {
    // get team id from url params
    const teamId = req.params.id;
    console.log("Looking for team with id: " + teamId);

    // find team and include creator, members and events info
    const team = await Team.findById(teamId)
      .populate("creator", "name email")
      .populate("members.user", "name email")
      .populate("events");

    // if no team found
    if (!team) {
      console.log("No team with that ID!");
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("Found team: " + team.name);
    res.status(200).json(team);
  } catch (error) {
    console.log("ERROR in getTeamById:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching team", error: error.message });
  }
};

// get all public teams
export const getPublicTeams = async (req, res) => {
  try {
    console.log("Getting all public teams");

    // find teams where isPublic is true
    const publicTeams = await Team.find({ isPublic: true })
      .populate("creator", "name email")
      .sort({ memberCount: -1 }); // sort by most members first

    console.log("Found " + publicTeams.length + " public teams");
    res.status(200).json(publicTeams);
  } catch (error) {
    console.log("ERROR in getPublicTeams:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching public teams", error: error.message });
  }
};

// get teams for logged-in user
export const getUserTeams = async (req, res) => {
  try {
    // get user id from auth middleware
    const userId = req.user.id;
    console.log("Finding teams for user: " + userId);

    // find teams where user is a member
    const teams = await Team.find({
      "members.user": mongoose.Types.ObjectId.createFromHexString(userId),
    })
      .populate("creator", "name email")
      .populate("members.user", "name email");

    console.log("User is in " + teams.length + " teams");
    res.status(200).json(teams);
  } catch (error) {
    console.log("ERROR in getUserTeams:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user's teams", error: error.message });
  }
};

// join a team
export const joinTeam = async (req, res) => {
  try {
    // get team id from url params and user id from auth
    const teamId = req.params.id;
    const userId = req.user.id;
    console.log("User " + userId + " wants to join team " + teamId);

    // find the team
    const team = await Team.findById(teamId);
    if (!team) {
      console.log("Team not found!");
      return res.status(404).json({ message: "Team not found" });
    }

    // check if team is public
    if (!team.isPublic) {
      console.log("Team is private, can't join without invite");
      return res.status(403).json({
        message: "This is a private team. You need an invitation to join.",
      });
    }

    // check if user is already in team
    let userAlreadyMember = false;
    for (let i = 0; i < team.members.length; i++) {
      if (team.members[i].user.toString() === userId.toString()) {
        userAlreadyMember = true;
        break;
      }
    }

    if (userAlreadyMember) {
      console.log("User already in team");
      return res
        .status(400)
        .json({ message: "You are already a member of this team" });
    }

    // add user to members array
    team.members.push({
      user: userId,
      role: "member",
      joinedAt: new Date(),
    });

    // update member count
    team.memberCount = team.members.length;
    await team.save();
    console.log("User added to team successfully");
    console.log("Team now has " + team.memberCount + " members");

    // add team to user's teams
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { teams: teamId } }, // add to array without duplicates
      { new: true }
    );

    console.log("User now has " + updatedUser.teams.length + " teams");

    res.status(200).json({
      message: "Successfully joined team",
      team: team,
    });
  } catch (error) {
    console.log("ERROR in joinTeam:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error joining team", error: error.message });
  }
};

// leave a team
export const leaveTeam = async (req, res) => {
  try {
    // get ids
    const teamId = req.params.id;
    const userId = req.user.id;
    console.log("User " + userId + " wants to leave team " + teamId);

    // find team
    const team = await Team.findById(teamId);
    if (!team) {
      console.log("Team not found!");
      return res.status(404).json({ message: "Team not found" });
    }

    // check if user is a member
    let foundMember = false;
    for (let i = 0; i < team.members.length; i++) {
      if (team.members[i].user.toString() === userId.toString()) {
        foundMember = true;
        break;
      }
    }

    if (!foundMember) {
      console.log("User not in team");
      return res
        .status(400)
        .json({ message: "You are not a member of this team" });
    }

    // check if user is the creator
    if (team.creator.toString() === userId.toString()) {
      console.log("Creator can't leave their team!");
      return res.status(400).json({
        message:
          "As the creator, you cannot leave the team. You must delete it or transfer ownership.",
      });
    }

    // remove user from team
    team.members = team.members.filter(
      (member) => member.user.toString() !== userId.toString()
    );

    // update member count
    team.memberCount = team.members.length;
    await team.save();
    console.log("User removed from team");
    console.log("Team now has " + team.memberCount + " members");

    // remove team from user's teams
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { teams: teamId } }, // remove from array
      { new: true }
    );

    console.log("User now has " + updatedUser.teams.length + " teams");

    res.status(200).json({
      message: "Successfully left team",
    });
  } catch (error) {
    console.log("ERROR in leaveTeam:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error leaving team", error: error.message });
  }
};

// update team info
export const updateTeam = async (req, res) => {
  try {
    // get ids and data
    const teamId = req.params.id;
    const userId = req.user.id;
    const { name, description, cause, isPublic, avatar } = req.body;

    console.log("User " + userId + " is updating team " + teamId);

    // find team
    const team = await Team.findById(teamId);
    if (!team) {
      console.log("Team not found!");
      return res.status(404).json({ message: "Team not found" });
    }

    // check if user is admin or creator
    let isAdmin = false;

    // check if user is creator
    if (team.creator.toString() === userId.toString()) {
      isAdmin = true;
    }

    // check if user is admin
    for (let i = 0; i < team.members.length; i++) {
      const member = team.members[i];
      if (
        member.user.toString() === userId.toString() &&
        member.role === "admin"
      ) {
        isAdmin = true;
        break;
      }
    }

    if (!isAdmin) {
      console.log("User not authorized to update team");
      return res
        .status(403)
        .json({ message: "You don't have permission to update this team" });
    }

    // update team info
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        name: name,
        description: description,
        cause: cause,
        isPublic: isPublic,
        avatar: avatar,
      },
      { new: true, runValidators: true } // return updated doc and validate
    );

    console.log("Team updated successfully");
    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.log("ERROR in updateTeam:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating team", error: error.message });
  }
};

// delete a team
export const deleteTeam = async (req, res) => {
  try {
    // get ids
    const teamId = req.params.id;
    const userId = req.user.id;
    console.log("User " + userId + " wants to delete team " + teamId);

    // find team
    const team = await Team.findById(teamId);

    if (!team) {
      console.log("Team not found!");
      return res.status(404).json({ message: "Team not found" });
    }

    // check if user is creator
    if (team.creator.toString() !== userId.toString()) {
      console.log("User is not the creator!");
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this team" });
    }

    // get all member ids to update them later
    const memberIds = [];
    for (let i = 0; i < team.members.length; i++) {
      memberIds.push(team.members[i].user.toString());
    }
    console.log("Team has " + memberIds.length + " members to update");

    // delete team
    await Team.findByIdAndDelete(teamId);
    console.log("Team deleted from database");

    // decrease creator's team count
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { teamsCreated: -1 } }, // decrease by 1
      { new: true }
    );

    console.log("Creator's teamsCreated is now " + updatedUser.teamsCreated);

    // remove team from all members' teams lists
    const updateResult = await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { teams: teamId } } // remove from array
    );

    console.log("Updated " + updateResult.modifiedCount + " users");

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.log("ERROR in deleteTeam:");
    console.log(error);
    res
      .status(500)
      .json({ message: "Error deleting team", error: error.message });
  }
};

// get top teams for leaderboard
export const getTeamLeaderboard = async (req, res) => {
  try {
    console.log("Getting top teams for leaderboard");

    // get top teams sorted by hours and members
    const leaderboard = await Team.find()
      .sort({ hoursContributed: -1, memberCount: -1 }) // sort by most hours first, then members
      .limit(10) // top 10 only
      .populate("creator", "name email");

    console.log("Found " + leaderboard.length + " teams for leaderboard");
    res.status(200).json(leaderboard);
  } catch (error) {
    console.log("ERROR in getTeamLeaderboard:");
    console.log(error);
    res.status(500).json({
      message: "Error fetching team leaderboard",
      error: error.message,
    });
  }
};
