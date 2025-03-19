import Event from "../models/Event.model.js";

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
    // Ensure the user is authenticated
    const userId = req.user.id; // `req.user` is populated by the authUser middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Create the event
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
    // Fetch all events from the database
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
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
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already a participant
    const isParticipant = event.participants.some(
      (participant) => participant.toString() === userId.toString()
    );

    if (isParticipant) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    // Check if event is full
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is already full" });
    }

    // Add user to participants
    event.participants.push(userId);
    await event.save();

    res.status(200).json({ message: "Successfully joined event" });
  } catch (error) {
    console.error("Error joining event:", error);
    res
      .status(500)
      .json({ message: "Error joining event", error: error.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is a participant
    const isParticipant = event.participants.some(
      (participant) => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res
        .status(400)
        .json({ message: "You are not registered for this event" });
    }

    // Remove user from participants
    event.participants = event.participants.filter(
      (participant) => participant.toString() !== userId.toString()
    );
    await event.save();

    res.status(200).json({ message: "Successfully left event" });
  } catch (error) {
    console.error("Error leaving event:", error);
    res
      .status(500)
      .json({ message: "Error leaving event", error: error.message });
  }
};

// ADD NEW FUNCTIONS BELOW

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Find the event
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the creator of the event
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized. Only the event creator can update this event",
      });
    }

    // Update the event with the new data
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Find the event
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the creator of the event
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized. Only the event creator can delete this event",
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
};
