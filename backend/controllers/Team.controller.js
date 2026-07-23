import prisma from "../configs/prisma.js";

// function to make a team
export const createTeam = async (req, res) => {
  try {
    const { name, description, cause, isPublic, avatar } = req.body;
    const userId = req.user.id;

    const team = await prisma.team.create({
      data: {
        name,
        description,
        cause,
        isPublic: isPublic !== undefined ? isPublic : true,
        avatar: avatar || "",
        creatorId: userId,
        memberCount: 1,
        members: {
          create: {
            userId: userId,
            role: "admin"
          }
        }
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { teamsCreatedCount: { increment: 1 } }
    });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.log("ERROR in createTeam:", error);
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
};

const fallbackTeams = [
  {
    id: "fb-team-1",
    name: "Green Earth Action Corps",
    description: "Dedicated volunteer group advocating for environmental conservation and sustainable city projects.",
    cause: "environment",
    memberCount: 28,
    eventsCount: 14,
    hoursContributed: 240,
    isPublic: true,
    creator: { name: "Niloy Kumar", email: "niloy15-13991@diu.edu.bd" }
  },
  {
    id: "fb-team-2",
    name: "Meals on Wheels Bangladesh",
    description: "Community food drive and surplus meal redistribution alliance.",
    cause: "food",
    memberCount: 35,
    eventsCount: 22,
    hoursContributed: 410,
    isPublic: true,
    creator: { name: "Sarah Rahman", email: "sarah.r@handson.org" }
  },
  {
    id: "fb-team-3",
    name: "Tech & Code for Good",
    description: "Volunteers mentoring youth in STEM, coding, and digital literacy.",
    cause: "education",
    memberCount: 19,
    eventsCount: 9,
    hoursContributed: 185,
    isPublic: true,
    creator: { name: "Arif Chowdhury", email: "arif.c@handson.org" }
  }
];

export const getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        creator: { select: { name: true, email: true } },
        members: { include: { user: { select: { name: true, email: true } } } }
      }
    });
    if (teams && teams.length > 0) {
      return res.status(200).json(teams);
    }
    res.status(200).json(fallbackTeams);
  } catch (error) {
    console.log("ERROR in getAllTeams, using fallback:", error.message);
    res.status(200).json(fallbackTeams);
  }
};

export const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    if (teamId === "get-all-teams" || teamId === "public" || teamId === "leaderboard") {
      if (teamId === "public") return getPublicTeams(req, res);
      if (teamId === "leaderboard") return getTeamLeaderboard(req, res);
      return getAllTeams(req, res);
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        creator: { select: { name: true, email: true } },
        members: { include: { user: { select: { name: true, email: true } } } },
        events: true
      }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    console.log("ERROR in getTeamById:", error);
    res.status(500).json({ message: "Error fetching team", error: error.message });
  }
};

export const getPublicTeams = async (req, res) => {
  try {
    const publicTeams = await prisma.team.findMany({
      where: { isPublic: true },
      include: { creator: { select: { name: true, email: true } } },
      orderBy: { memberCount: 'desc' }
    });

    res.status(200).json(publicTeams);
  } catch (error) {
    console.log("ERROR in getPublicTeams:", error);
    res.status(500).json({ message: "Error fetching public teams", error: error.message });
  }
};

export const getUserTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await prisma.team.findMany({
      where: { members: { some: { userId: userId } } },
      include: {
        creator: { select: { name: true, email: true } },
        members: { include: { user: { select: { name: true, email: true } } } }
      }
    });

    res.status(200).json(teams);
  } catch (error) {
    console.log("ERROR in getUserTeams:", error);
    res.status(500).json({ message: "Error fetching user's teams", error: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.isPublic) {
      return res.status(403).json({ message: "This is a private team. You need an invitation to join." });
    }

    const userAlreadyMember = team.members.some(m => m.userId === userId);
    if (userAlreadyMember) {
      return res.status(400).json({ message: "You are already a member of this team" });
    }

    await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: userId,
        role: "member"
      }
    });

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { memberCount: { increment: 1 } },
      include: { members: true }
    });

    res.status(200).json({
      message: "Successfully joined team",
      team: updatedTeam,
    });
  } catch (error) {
    console.log("ERROR in joinTeam:", error);
    res.status(500).json({ message: "Error joining team", error: error.message });
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const member = team.members.find(m => m.userId === userId);
    if (!member) {
      return res.status(400).json({ message: "You are not a member of this team" });
    }

    if (team.creatorId === userId) {
      return res.status(400).json({
        message: "As the creator, you cannot leave the team. You must delete it or transfer ownership.",
      });
    }

    await prisma.teamMember.delete({
      where: { id: member.id }
    });

    await prisma.team.update({
      where: { id: teamId },
      data: { memberCount: { decrement: 1 } }
    });

    res.status(200).json({ message: "Successfully left team" });
  } catch (error) {
    console.log("ERROR in leaveTeam:", error);
    res.status(500).json({ message: "Error leaving team", error: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    const { name, description, cause, isPublic, avatar } = req.body;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    let isAdmin = (team.creatorId === userId);
    if (!isAdmin) {
      const member = team.members.find(m => m.userId === userId);
      if (member && member.role === "admin") {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return res.status(403).json({ message: "You don't have permission to update this team" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (cause !== undefined) {
      const validCauses = ["environment", "education", "food", "healthcare", "animals", "elderly", "development", "community"];
      if (!validCauses.includes(cause.toLowerCase())) {
        return res.status(400).json({ message: `Invalid cause. Must be one of: ${validCauses.join(", ")}` });
      }
      updateData.cause = cause.toLowerCase();
    }
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);
    if (avatar !== undefined) updateData.avatar = avatar;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid update data provided" });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: updateData
    });

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.log("ERROR in updateTeam:", error);
    res.status(500).json({ message: "Error updating team", error: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await prisma.team.findUnique({ where: { id: teamId } });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.creatorId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this team" });
    }

    await prisma.team.delete({ where: { id: teamId } });

    await prisma.user.update({
      where: { id: userId },
      data: { teamsCreatedCount: { decrement: 1 } }
    });

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.log("ERROR in deleteTeam:", error);
    res.status(500).json({ message: "Error deleting team", error: error.message });
  }
};

export const getTeamLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.team.findMany({
      orderBy: [
        { hoursContributed: 'desc' },
        { memberCount: 'desc' }
      ],
      take: 10,
      include: { creator: { select: { name: true, email: true } } }
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.log("ERROR in getTeamLeaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
  }
};
