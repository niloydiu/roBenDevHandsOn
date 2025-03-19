import Help from "../models/Help.model.js";

export const createHelpRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      urgencyLevel,
      category,
      contactInfo,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !urgencyLevel ||
      !category ||
      !contactInfo
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Get user data from authenticated user
    const userId = req.user.id;

    // Create new help request with user data
    const helpRequest = new Help({
      title,
      description,
      location,
      urgencyLevel,
      category,
      contactInfo,
      createdBy: userId,
      helpers: [],
      offers: 0,
    });

    // Save to database
    await helpRequest.save();

    // Fetch the populated help request to return
    const populatedRequest = await Help.findById(helpRequest._id).populate(
      "createdBy",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Help request created successfully",
      helpRequest: populatedRequest,
    });
  } catch (error) {
    console.error("Error creating help request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create help request",
      error: error.message,
    });
  }
};

export const getAllHelpRequests = async (req, res) => {
  try {
    // Fetch all help requests with creator information
    const helpRequests = await Help.find()
      .populate("createdBy", "name email")
      .populate("helpers", "_id name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      helpRequests,
    });
  } catch (error) {
    console.error("Error fetching help requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch help requests",
      error: error.message,
    });
  }
};

export const offerHelp = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Find the help request
    const helpRequest = await Help.findById(requestId);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // Check if the user has already offered help
    const userIndex = helpRequest.helpers.findIndex(
      (helper) => helper.toString() === userId
    );
    const hasOffered = userIndex !== -1;

    let message;
    let updatedRequest;

    if (hasOffered) {
      // Remove the user from helpers array and decrement offers count
      updatedRequest = await Help.findByIdAndUpdate(
        requestId,
        {
          $pull: { helpers: userId },
          $inc: { offers: -1 },
        },
        { new: true }
      )
        .populate("createdBy", "name email")
        .populate("helpers", "_id name email");

      message = "You have withdrawn your offer to help.";
    } else {
      // Add the user to helpers array and increment offers count
      updatedRequest = await Help.findByIdAndUpdate(
        requestId,
        {
          $addToSet: { helpers: userId },
          $inc: { offers: 1 },
        },
        { new: true }
      )
        .populate("createdBy", "name email")
        .populate("helpers", "_id name email");

      message = "You have successfully offered to help!";
    }

    return res.status(200).json({
      success: true,
      message,
      helpRequest: updatedRequest,
      hasOffered: !hasOffered, // Return the new offer status
    });
  } catch (error) {
    console.error("Error offering help:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record help offer",
      error: error.message,
    });
  }
};

export const deleteHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the help request
    const helpRequest = await Help.findById(id);

    // Check if the help request exists
    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // Check if the user is the creator of the help request
    if (helpRequest.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this help request",
      });
    }

    // Delete the help request
    await Help.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Help request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting help request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete help request",
      error: error.message,
    });
  }
};
