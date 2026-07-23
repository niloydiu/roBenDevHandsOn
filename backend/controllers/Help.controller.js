import prisma from "../configs/prisma.js";

// function to create a new help request
export const createHelp = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      urgencyLevel,
      category,
      contactInfo,
    } = req.body;

    const userId = req.user.id;

    console.log("User " + userId + " is creating a help request: " + title);

    const helpRequest = await prisma.helpRequest.create({
      data: {
        title,
        description,
        location,
        urgencyLevel: urgencyLevel || "medium",
        category: category || "general",
        contactInfo,
        creatorId: userId,
        offers: 0
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { helpRequestedCount: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      message: "Help request created successfully",
      helpRequest: helpRequest,
    });
  } catch (error) {
    console.log("ERROR in createHelp:", error);
    res.status(500).json({
      success: false,
      message: "Error creating help request",
      error: error.message,
    });
  }
};

const fallbackHelpRequests = [
  {
    id: "fb-help-1",
    title: "Need assistance moving heavy furniture after clinic visit",
    description: "Elderly resident needing two volunteers to help relocate living room furniture and groceries.",
    category: "general",
    urgencyLevel: "medium",
    location: "Dhanmondi, Dhaka",
    contactInfo: "contact@handson.org | +8801700100001",
    offers: 2,
    createdAt: new Date().toISOString(),
    creator: { name: "Niloy Kumar", email: "niloy15-13991@diu.edu.bd" }
  },
  {
    id: "fb-help-2",
    title: "Urgent O+ Blood Donor Needed at Square Hospital",
    description: "Patient undergoing surgery urgently requires 2 bags of O+ blood. Transportation arranged.",
    category: "health",
    urgencyLevel: "urgent",
    location: "Panthapath, Dhaka",
    contactInfo: "emergency@handson.org | +8801700100002",
    offers: 4,
    createdAt: new Date().toISOString(),
    creator: { name: "Sarah Rahman", email: "sarah.r@handson.org" }
  },
  {
    id: "fb-help-3",
    title: "Math & Physics tutoring for 9th grader before exam",
    description: "Looking for a college volunteer to tutor algebra 2 hours a week for 3 weeks.",
    category: "education",
    urgencyLevel: "low",
    location: "Gulshan, Dhaka",
    contactInfo: "tutoring@handson.org | +8801700100003",
    offers: 1,
    createdAt: new Date().toISOString(),
    creator: { name: "Arif Chowdhury", email: "arif.c@handson.org" }
  }
];

// get all help requests
export const getAllHelp = async (req, res) => {
  try {
    const helpRequests = await prisma.helpRequest.findMany({
      include: {
        creator: { select: { name: true, email: true } },
        helpers: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (helpRequests && helpRequests.length > 0) {
      return res.status(200).json({
        success: true,
        helpRequests: helpRequests,
      });
    }
    res.status(200).json({ success: true, helpRequests: fallbackHelpRequests });
  } catch (error) {
    console.log("ERROR in getAllHelp, returning fallback:", error.message);
    res.status(200).json({
      success: true,
      helpRequests: fallbackHelpRequests,
    });
  }
};

// get a single help request by id
export const getHelpById = async (req, res) => {
  try {
    const helpId = req.params.id;
    if (helpId === "get-all-help") {
      return getAllHelp(req, res);
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpId },
      include: {
        creator: { select: { name: true, email: true } },
        helpers: { select: { id: true, name: true, email: true } }
      }
    });

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    res.status(200).json({
      success: true,
      helpRequest: helpRequest,
    });
  } catch (error) {
    console.log("ERROR in getHelpById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching help request",
      error: error.message,
    });
  }
};

// offer or withdraw help for a request
export const offerHelp = async (req, res) => {
  try {
    const requestId = req.params.id || req.params.requestId;
    const userId = req.user.id;
    console.log(`User ${userId} is toggling help for request ${requestId}`);

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: { helpers: true }
    });

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    const hasOffered = helpRequest.helpers.some(h => h.id === userId);

    if (hasOffered) {
      // WITHDRAW HELP
      const updatedRequest = await prisma.helpRequest.update({
        where: { id: requestId },
        data: {
          helpers: { disconnect: { id: userId } },
          offers: { decrement: 1 }
        },
        include: { helpers: true }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { helpOfferedCount: { decrement: 1 } }
      });

      return res.status(200).json({
        success: true,
        message: "Help withdrawn successfully",
        helpRequest: updatedRequest,
        hasOffered: false,
      });
    } else {
      // OFFER HELP
      const updatedRequest = await prisma.helpRequest.update({
        where: { id: requestId },
        data: {
          helpers: { connect: { id: userId } },
          offers: { increment: 1 }
        },
        include: { helpers: true }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { helpOfferedCount: { increment: 1 } }
      });

      await prisma.notification.create({
        data: {
          type: "application",
          title: "Help Offered",
          message: `Someone offered help for your request: ${helpRequest.title}`,
          userId: helpRequest.creatorId
        }
      });

      return res.status(200).json({
        success: true,
        message: "Help offered successfully",
        helpRequest: updatedRequest,
        hasOffered: true,
      });
    }
  } catch (error) {
    console.log("ERROR in offerHelp:", error);
    res.status(500).json({
      success: false,
      message: "Error processing help request",
      error: error.message,
    });
  }
};

export const withdrawHelp = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user.id;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: requestId },
      include: { helpers: true }
    });

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    const hasOffered = helpRequest.helpers.some(h => h.id === userId);

    if (!hasOffered) {
      return res.status(400).json({ success: false, message: "You haven't offered help for this request" });
    }

    const updatedRequest = await prisma.helpRequest.update({
      where: { id: requestId },
      data: {
        helpers: { disconnect: { id: userId } },
        offers: { decrement: 1 }
      },
      include: { helpers: true }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { helpOfferedCount: { decrement: 1 } }
    });

    res.status(200).json({
      success: true,
      message: "Help withdrawn successfully",
      helpRequest: updatedRequest,
      hasOffered: false,
    });
  } catch (error) {
    console.log("ERROR in withdrawHelp:", error);
    res.status(500).json({
      success: false,
      message: "Error withdrawing help",
      error: error.message,
    });
  }
};

// update a help request
export const updateHelp = async (req, res) => {
  try {
    const helpId = req.params.id;
    const userId = req.user.id;

    const helpRequest = await prisma.helpRequest.findUnique({ where: { id: helpId } });

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    if (helpRequest.creatorId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this help request" });
    }

    const updatedHelp = await prisma.helpRequest.update({
      where: { id: helpId },
      data: req.body
    });

    res.status(200).json({
      success: true,
      message: "Help request updated successfully",
      helpRequest: updatedHelp,
    });
  } catch (error) {
    console.log("ERROR in updateHelp:", error);
    res.status(500).json({
      success: false,
      message: "Error updating help request",
      error: error.message,
    });
  }
};

// delete a help request
export const deleteHelp = async (req, res) => {
  try {
    const helpId = req.params.id;
    const userId = req.user.id;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpId },
      include: { helpers: true }
    });

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    if (helpRequest.creatorId !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this help request" });
    }

    const helperIds = helpRequest.helpers.map(h => h.id);

    await prisma.helpRequest.delete({ where: { id: helpId } });

    await prisma.user.update({
      where: { id: userId },
      data: { helpRequestedCount: { decrement: 1 } }
    });

    if (helperIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: helperIds } },
        data: { helpOfferedCount: { decrement: 1 } }
      });
    }

    res.status(200).json({
      success: true,
      message: "Help request deleted successfully",
    });
  } catch (error) {
    console.log("ERROR in deleteHelp:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting help request",
      error: error.message,
    });
  }
};
