import prisma from "../configs/prisma.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, helpId, eventId } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, message: "Recipient and message are required" });
    }

    const chatMessage = await prisma.message.create({
      data: {
        senderId: senderId,
        recipientId: recipientId,
        message: message,
        ...(helpId && { helpId }),
        ...(eventId && { eventId })
      }
    });

    await prisma.notification.create({
      data: {
        type: "message",
        title: "New Message",
        message: `You have a new message from ${req.user.name || "someone"}`,
        userId: recipientId
      }
    });

    return res.status(201).json({ success: true, chat: chatMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get message history between two users
export const getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: partnerId },
          { senderId: partnerId, recipientId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true } }
      }
    });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of active chats/conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        recipient: { select: { id: true, name: true, email: true } }
      }
    });

    const conversationMap = new Map();

    for (const chat of chats) {
      const isSender = chat.sender.id === userId;
      const partner = isSender ? chat.recipient : chat.sender;
      
      if (!partner) continue;
      
      const partnerId = partner.id;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner,
          lastMessage: chat.message,
          timestamp: chat.createdAt,
        });
      }
    }

    return res.status(200).json({ success: true, conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
