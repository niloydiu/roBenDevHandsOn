import Help from "../models/Help.model.js";
import User from "../models/User.model.js";

// function to create a new help request
export const createHelp = async (req, res) => {
  try {
    // get all the stuff from request body
    const {
      title,
      description,
      location,
      urgencyLevel,
      category,
      contactInfo,
    } = req.body;

    // get user id from auth middleware
    const userId = req.user.id;

    console.log("User " + userId + " is creating a help request: " + title);

    // create new help object
    const helpRequest = new Help({
      title: title,
      description: description,
      location: location,
      urgencyLevel: urgencyLevel || "medium", // default to medium if not provided
      category: category || "general", // default to general if not provided
      contactInfo: contactInfo,
      createdBy: userId,
      helpers: [], // start with empty helpers
      offers: 0, // start with 0 offers
    });

    // save to database
    await helpRequest.save();
    console.log("Help request created with id: " + helpRequest._id);

    // add 1 to user's helpRequested count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { helpRequested: 1 } }, // increase by 1
      { new: true }
    );
    console.log("Updated user's helpRequested count");

    // return success
    res.status(201).json({
      success: true,
      message: "Help request created successfully",
      helpRequest: helpRequest,
    });
  } catch (error) {
    // if something breaks
    console.log("ERROR in createHelp:");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating help request",
      error: error.message,
    });
  }
};

// get all help requests
export const getAllHelp = async (req, res) => {
  try {
    console.log("Getting all help requests");

    // get all help requests with user info
    const helpRequests = await Help.find()
      .populate("createdBy", "name email")
      .populate("helpers", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log("Found " + helpRequests.length + " help requests");

    // Return with success flag and helpRequests array
    res.status(200).json({
      success: true,
      helpRequests: helpRequests,
    });
  } catch (error) {
    console.log("ERROR in getAllHelp:");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching help requests",
      error: error.message,
    });
  }
};

// get a single help request by id
export const getHelpById = async (req, res) => {
  try {
    // get id from url
    const helpId = req.params.id;
    console.log("Getting help request with id: " + helpId);

    // find help request with user info
    const helpRequest = await Help.findById(helpId)
      .populate("createdBy", "name email")
      .populate("helpers", "name email");

    // check if it exists
    if (!helpRequest) {
      console.log("No help request found with that ID!");
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    console.log("Found help request: " + helpRequest.title);
    res.status(200).json({
      success: true,
      helpRequest: helpRequest,
    });
  } catch (error) {
    console.log("ERROR in getHelpById:");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching help request",
      error: error.message,
    });
  }
};

// offer or withdraw help for a request - UPDATED
export const offerHelp = async (req, res) => {
  try {
    // get ids - support both 'id' and 'requestId' in URL parameters
    const requestId = req.params.id || req.params.requestId;
    const userId = req.user.id;
    console.log(`User ${userId} is toggling help for request ${requestId}`);

    // find the request
    const helpRequest = await Help.findById(requestId);

    // check if it exists
    if (!helpRequest) {
      console.log("Help request not found!");
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // check if user already offered help
    let hasOffered = false;
    let helperIndex = -1;

    for (let i = 0; i < helpRequest.helpers.length; i++) {
      if (helpRequest.helpers[i].toString() === userId.toString()) {
        hasOffered = true;
        helperIndex = i;
        break;
      }
    }

    // Toggle the help offer status
    if (hasOffered) {
      // WITHDRAW HELP: Remove user from helpers array
      console.log(`User ${userId} is withdrawing help`);
      helpRequest.helpers.splice(helperIndex, 1);

      // update offers count
      helpRequest.offers = helpRequest.helpers.length;
      await helpRequest.save();
      console.log(
        `User removed from helpers list. Now has ${helpRequest.offers} offers`
      );

      // decrease user's help offered count
      await User.findByIdAndUpdate(
        userId,
        { $inc: { helpOffered: -1 } }, // decrease by 1
        { new: true }
      );
      console.log("Updated user's helpOffered count (decreased)");

      // return success
      return res.status(200).json({
        success: true,
        message: "Help withdrawn successfully",
        helpRequest: helpRequest,
        hasOffered: false,
      });
    } else {
      // OFFER HELP: Add user to helpers
      console.log(`User ${userId} is offering help`);
      helpRequest.helpers.push(userId);

      // update offers count
      helpRequest.offers = helpRequest.helpers.length;
      await helpRequest.save();
      console.log(
        `User added to helpers list. Now has ${helpRequest.offers} offers`
      );

      // increase user's help offered count
      await User.findByIdAndUpdate(
        userId,
        { $inc: { helpOffered: 1 } }, // increase by 1
        { new: true }
      );
      console.log("Updated user's helpOffered count (increased)");

      // return success
      return res.status(200).json({
        success: true,
        message: "Help offered successfully",
        helpRequest: helpRequest,
        hasOffered: true,
      });
    }
  } catch (error) {
    console.log("ERROR in offerHelp:");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error processing help request",
      error: error.message,
    });
  }
};

// withdraw an offer of help - kept for compatibility
export const withdrawHelp = async (req, res) => {
  try {
    // get ids
    const requestId = req.params.requestId;
    const userId = req.user.id;
    console.log(
      "User " + userId + " is withdrawing help from request " + requestId
    );

    // find request
    const helpRequest = await Help.findById(requestId);

    // check if it exists
    if (!helpRequest) {
      console.log("Help request not found!");
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // check if user has offered help
    let hasOffered = false;
    let helperIndex = -1;

    for (let i = 0; i < helpRequest.helpers.length; i++) {
      if (helpRequest.helpers[i].toString() === userId.toString()) {
        hasOffered = true;
        helperIndex = i;
        break;
      }
    }

    if (!hasOffered) {
      console.log("User hasn't offered help");
      return res.status(400).json({
        success: false,
        message: "You haven't offered help for this request",
      });
    }

    // remove user from helpers
    helpRequest.helpers.splice(helperIndex, 1);

    // update offers count
    helpRequest.offers = helpRequest.helpers.length;
    await helpRequest.save();
    console.log("User removed from helpers list");
    console.log("Request now has " + helpRequest.offers + " offers");

    // decrease user's help offered count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { helpOffered: -1 } }, // decrease by 1
      { new: true }
    );
    console.log("Updated user's helpOffered count");

    // return success
    res.status(200).json({
      success: true,
      message: "Help withdrawn successfully",
      helpRequest: helpRequest,
      hasOffered: false,
    });
  } catch (error) {
    console.log("ERROR in withdrawHelp:");
    console.log(error);
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
    // get ids
    const helpId = req.params.id;
    const userId = req.user.id;
    console.log("User " + userId + " is updating help request " + helpId);

    // find request
    const helpRequest = await Help.findById(helpId);

    // check if it exists
    if (!helpRequest) {
      console.log("Help request not found!");
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // check if user is the creator
    if (helpRequest.createdBy.toString() !== userId.toString()) {
      console.log("User is not the creator!");
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this help request",
      });
    }

    // update the request
    const updatedHelp = await Help.findByIdAndUpdate(helpId, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate the update
    });

    console.log("Help request updated successfully");
    res.status(200).json({
      success: true,
      message: "Help request updated successfully",
      helpRequest: updatedHelp,
    });
  } catch (error) {
    console.log("ERROR in updateHelp:");
    console.log(error);
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
    // get ids
    const helpId = req.params.id;
    const userId = req.user.id;
    console.log("User " + userId + " is deleting help request " + helpId);

    // find request
    const helpRequest = await Help.findById(helpId);

    // check if it exists
    if (!helpRequest) {
      console.log("Help request not found!");
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // check if user is the creator
    if (helpRequest.createdBy.toString() !== userId.toString()) {
      console.log("User is not the creator!");
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this help request",
      });
    }

    // get all helpers to update their stats
    const helperIds = [];
    for (let i = 0; i < helpRequest.helpers.length; i++) {
      helperIds.push(helpRequest.helpers[i].toString());
    }
    console.log("Request has " + helperIds.length + " helpers to update");

    // delete the request
    await Help.findByIdAndDelete(helpId);
    console.log("Help request deleted");

    // decrease creator's help requested count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { helpRequested: -1 } }, // decrease by 1
      { new: true }
    );
    console.log("Updated creator's helpRequested count");

    // decrease all helpers' helpOffered count
    if (helperIds.length > 0) {
      const updateResult = await User.updateMany(
        { _id: { $in: helperIds } },
        { $inc: { helpOffered: -1 } } // decrease by 1
      );
      console.log("Updated " + updateResult.modifiedCount + " helpers' stats");
    }

    // return success
    res.status(200).json({
      success: true,
      message: "Help request deleted successfully",
    });
  } catch (error) {
    console.log("ERROR in deleteHelp:");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting help request",
      error: error.message,
    });
  }
};
