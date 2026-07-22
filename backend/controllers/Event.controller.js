import prisma from "../configs/prisma.js";

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

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        startTime,
        endTime,
        location,
        maxParticipants: parseInt(maxParticipants) || 0,
        requirements: requirements || "",
        creatorId: userId,
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { eventsCreatedCount: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: { select: { name: true, email: true } }
      },
      orderBy: { date: 'asc' }
    });

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: { select: { name: true, email: true } },
        participants: { select: { id: true, name: true, email: true } }
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ success: false, message: "Error fetching event", error: error.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const alreadyJoined = event.participants.some(p => p.id === userId);
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: "You are already registered for this event" });
    }

    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: "Event is already full" });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: { connect: { id: userId } }
      }
    });

    const pointsToAward = 10;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAward } }
    });

    await prisma.notification.create({
      data: {
        type: "application",
        title: "Joined Event",
        message: `You successfully joined ${event.title}.`,
        userId: userId
      }
    });

    // fetch updated event to return
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });

    res.status(200).json({
      success: true,
      message: `Successfully joined event and earned ${pointsToAward} points!`,
      event: updatedEvent,
      points: user.points,
    });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ success: false, message: "Error joining event", error: error.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const isInEvent = event.participants.some(p => p.id === userId);
    if (!isInEvent) {
      return res.status(400).json({ success: false, message: "You are not registered for this event" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: { disconnect: { id: userId } }
      },
      include: { participants: true }
    });

    res.status(200).json({
      success: true,
      message: "Successfully left event",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({ success: false, message: "Error leaving event", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const data = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.creatorId !== userId) {
      return res.status(403).json({ success: false, message: "You can't update this event because you didn't create it" });
    }
    
    if (data.date) data.date = new Date(data.date);
    if (data.maxParticipants) data.maxParticipants = parseInt(data.maxParticipants);

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: data
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Error updating event", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.creatorId !== userId) {
      return res.status(403).json({ success: false, message: "You can't delete this event because you didn't create it" });
    }

    await prisma.event.delete({ where: { id: eventId } });

    await prisma.user.update({
      where: { id: userId },
      data: { eventsCreatedCount: { decrement: 1 } }
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Error deleting event", error: error.message });
  }
};

export const completeEvent = async (req, res) => {
  try {
    const { eventId, hoursContributed } = req.body;
    const userId = req.user.id;

    const hours = Number(hoursContributed);
    if (isNaN(hours) || hours <= 0) {
      return res.status(400).json({ success: false, message: "Please provide valid volunteer hours" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const isParticipant = event.participants.some(p => p.id === userId);
    if (!isParticipant) {
      return res.status(400).json({ success: false, message: "You are not a participant in this event" });
    }

    const pendingHour = await prisma.pendingHour.create({
      data: {
        hours: hours,
        date: new Date(),
        status: "pending",
        verifications: "[]",
        userId: userId,
        eventId: eventId
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { pendingHours: true } });

    console.log(`User ${userId} submitted ${hours} volunteer hours for event ${eventId} for approval`);

    res.status(200).json({
      success: true,
      message: `You've logged ${hours} volunteer hours. They will be reviewed shortly!`,
      pendingHours: user.pendingHours,
    });
  } catch (error) {
    console.error("Error completing event:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
