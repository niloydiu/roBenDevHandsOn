import prisma from "../configs/prisma.js";

const fallbackEvents = [
  {
    id: "fb-event-1",
    title: "Dhanmondi Lake Clean-Up & Recycling Drive",
    description: "Join us this Saturday to clear plastic waste along Dhanmondi lakefront and sort items for recycling.",
    category: "Environment",
    urgency: "Medium",
    location: "Dhanmondi, Dhaka",
    date: new Date().toISOString(),
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    maxParticipants: 35,
    requirements: "Bring a water bottle and wear comfortable outdoor footwear.",
    creator: { name: "Niloy Kumar", email: "niloy15-13991@diu.edu.bd" }
  },
  {
    id: "fb-event-2",
    title: "Youth STEM & Coding Workshop",
    description: "Interactive computer science and robotics workshop for underrepresented middle school students.",
    category: "Education",
    urgency: "Low",
    location: "Uttara, Dhaka",
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    maxParticipants: 25,
    requirements: "Laptops provided.",
    creator: { name: "Sarah Rahman", email: "sarah.r@handson.org" }
  },
  {
    id: "fb-event-3",
    title: "Community Food Pantry & Surplus Distribution",
    description: "Packing and distributing fresh produce and essential groceries to 200 local families in need.",
    category: "Food",
    urgency: "High",
    location: "Mirpur, Dhaka",
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    maxParticipants: 40,
    requirements: "Face masks required.",
    creator: { name: "Arif Chowdhury", email: "arif.c@handson.org" }
  },
  {
    id: "fb-event-4",
    title: "Free Neighborhood Health & Eye Checkup Camp",
    description: "Volunteer medical doctors and assistants providing free basic checkups, vision tests, and medicine.",
    category: "Healthcare",
    urgency: "Emergency",
    location: "Banani, Dhaka",
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    startTime: "08:30 AM",
    endTime: "04:00 PM",
    maxParticipants: 50,
    requirements: "Medical ID required for volunteer practitioners.",
    creator: { name: "Maria Santos", email: "maria.s@handson.org" }
  }
];

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

    if (events && events.length > 0) {
      return res.status(200).json({ success: true, events });
    }
    return res.status(200).json({ success: true, events: fallbackEvents });
  } catch (error) {
    console.error("Error fetching events, using fallback dataset:", error.message);
    res.status(200).json({ success: true, events: fallbackEvents });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (eventId === "get-all-events") {
      return getAllEvents(req, res);
    }

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
