import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

export const createEvent = async (req, res) => {
  const {
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    location,
    maxParticipants,
    requirements,
  } = req.body;

  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newEvent = new Event({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      maxParticipants,
      requirements,
      createdBy: userId,
    });

    await newEvent.save();

    await User.findByIdAndUpdate(
      userId,
      { $inc: { eventsCreated: 1 } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      events: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let alreadyJoined = false;
    for (let i = 0; i < event.participants.length; i++) {
      if (event.participants[i].toString() === userId.toString()) {
        alreadyJoined = true;
        break;
      }
    }

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    if (
      event.maxParticipants &&
      event.participants.length >= event.maxParticipants
    ) {
      return res.status(400).json({
        success: false,
        message: "Event is already full",
      });
    }

    event.participants.push(userId);
    await event.save();

    const user = await User.findById(userId);

    if (!user.eventsJoined) {
      user.eventsJoined = [];
    }

    user.eventsJoined.push(eventId);

    const pointsToAward = 10;
    user.points = (user.points || 0) + pointsToAward;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully joined event and earned ${pointsToAward} points!`,
      event: event,
      points: user.points,
    });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({
      success: false,
      message: "Error joining event",
      error: error.message,
    });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let isInEvent = false;
    for (let i = 0; i < event.participants.length; i++) {
      if (event.participants[i].toString() === userId.toString()) {
        isInEvent = true;
        break;
      }
    }

    if (!isInEvent) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      });
    }

    event.participants = event.participants.filter(
      (participant) => participant.toString() !== userId.toString()
    );
    await event.save();

    await User.findByIdAndUpdate(
      userId,
      { $pull: { eventsJoined: eventId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully left event",
      event: event,
    });
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({
      success: false,
      message: "Error leaving event",
      error: error.message,
    });
  }
};

// update event info
export const updateEvent = async (req, res) => {
  try {
    // get ids
    const eventId = req.params.id;
    const userId = req.user.id;

    // find event
    const event = await Event.findById(eventId);

    // if no event found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // make sure the user is the creator
    // converting to string because mongodb ObjectIds aren't strings
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can't update this event because you didn't create it",
      });
    }

    // update the event and get the updated version
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true, // this returns the updated document
      runValidators: true, // this makes sure our validation runs
    });

    // send back the updated event
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    // if error happens
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

// delete an event
export const deleteEvent = async (req, res) => {
  try {
    // get ids
    const eventId = req.params.id;
    const userId = req.user.id;

    // find event
    const event = await Event.findById(eventId);

    // if event doesn't exist
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // check if user is the creator
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can't delete this event because you didn't create it",
      });
    }

    // delete the event
    await Event.findByIdAndDelete(eventId);

    // decrease user's created events count
    await User.findByIdAndUpdate(
      userId,
      { $inc: { eventsCreated: -1 } },
      { new: true }
    );

    // remove event from all users who joined it
    await User.updateMany(
      { eventsJoined: eventId },
      { $pull: { eventsJoined: eventId } }
    );

    // return success
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    // if error
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};

// UPDATED: Modified to use pendingHours instead of directly adding hours
export const completeEvent = async (req, res) => {
  try {
    const { eventId, hoursContributed } = req.body;
    const userId = req.user.id;

    // Validate hours contributed
    const hours = Number(hoursContributed);
    if (isNaN(hours) || hours <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid volunteer hours",
      });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is a participant
    const isParticipant = event.participants.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(400).json({
        success: false,
        message: "You are not a participant in this event",
      });
    }

    // Find the user
    const user = await User.findById(userId);

    // Add to pendingHours instead of directly to volunteerHours
    user.pendingHours.push({
      event: eventId,
      hours: hours,
      date: new Date(),
      status: "pending",
      verifications: [],
    });

    await user.save();

    // If the event has a team, you could record this as pending for the team as well
    // This is optional based on your requirements

    console.log(
      `User ${userId} submitted ${hours} volunteer hours for event ${eventId} for approval`
    );

    res.status(200).json({
      success: true,
      message: `You've logged ${hours} volunteer hours. They will be reviewed shortly!`,
      pendingHours: user.pendingHours,
    });
  } catch (error) {
    console.error("Error completing event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
