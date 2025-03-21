import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

// this function creates a new event
export const createEvent = async (req, res) => {
  // getting all the data from request body
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
    // checking if user is logged in
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // making new event object
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

    // save to database
    await newEvent.save();

    // increase user's event count by 1
    await User.findByIdAndUpdate(
      userId,
      { $inc: { eventsCreated: 1 } },
      { new: true }
    );

    // send back success message
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    // if there's an error, log it
    console.error("Error creating event:", error);
    // return error message
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// gets all events from database
export const getAllEvents = async (req, res) => {
  try {
    // get all events and include creator info
    const events = await Event.find().populate("createdBy", "name email");

    // return events
    res.status(200).json(events);
  } catch (error) {
    // if error happens
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get single event by ID
export const getEventById = async (req, res) => {
  try {
    // get event id from url
    const eventId = req.params.id;

    // find event in database with that id
    const event = await Event.findById(eventId)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    // check if event exists
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // return event
    res.status(200).json(event);
  } catch (error) {
    // log error and return error message
    console.error("Error fetching event by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

// lets a user join an event
export const joinEvent = async (req, res) => {
  try {
    // get event id and user id
    const eventId = req.params.id;
    const userId = req.user.id;

    // find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check if user already joined - this prevents duplicate entries
    let alreadyJoined = false;
    for (let i = 0; i < event.participants.length; i++) {
      if (event.participants[i].toString() === userId.toString()) {
        alreadyJoined = true;
        break;
      }
    }

    // if already joined, return error
    if (alreadyJoined) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    // check if event is full
    if (
      event.maxParticipants &&
      event.participants.length >= event.maxParticipants
    ) {
      return res.status(400).json({ message: "Event is already full" });
    }

    // add user to event
    event.participants.push(userId);
    await event.save();

    // add event to user
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { eventsJoined: eventId } },
      { new: true }
    );

    // return success
    res.status(200).json({ message: "Successfully joined event" });
  } catch (error) {
    // if error
    console.error("Error joining event:", error);
    res
      .status(500)
      .json({ message: "Error joining event", error: error.message });
  }
};

// lets user leave an event they joined
export const leaveEvent = async (req, res) => {
  try {
    // get event id and user id
    const eventId = req.params.id;
    const userId = req.user.id;

    // find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check if user is in the event
    let isInEvent = false;
    for (let i = 0; i < event.participants.length; i++) {
      if (event.participants[i].toString() === userId.toString()) {
        isInEvent = true;
        break;
      }
    }

    // if not in event, return error
    if (!isInEvent) {
      return res
        .status(400)
        .json({ message: "You are not registered for this event" });
    }

    // remove user from event participants
    event.participants = event.participants.filter(
      (participant) => participant.toString() !== userId.toString()
    );
    await event.save();

    // remove event from user's joined events
    await User.findByIdAndUpdate(
      userId,
      { $pull: { eventsJoined: eventId } },
      { new: true }
    );

    // return success
    res.status(200).json({ message: "Successfully left event" });
  } catch (error) {
    console.error("Error leaving event:", error);
    res
      .status(500)
      .json({ message: "Error leaving event", error: error.message });
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
      return res.status(404).json({ message: "Event not found" });
    }

    // make sure the user is the creator
    // converting to string because mongodb ObjectIds aren't strings
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
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
      return res.status(404).json({ message: "Event not found" });
    }

    // check if user is the creator
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
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
      message: "Error deleting event",
      error: error.message,
    });
  }
};
