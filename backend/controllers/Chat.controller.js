import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, helpId, eventId } = req.body;
    const senderId = req.user._id; // set by auth middleware

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, message: "Recipient and message are required" });
    }

    const chat = new Chat({
      sender: senderId,
      recipient: recipientId,
      message,
      helpId: helpId || undefined,
      eventId: eventId || undefined,
    });

    await chat.save();
    return res.status(201).json({ success: true, chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get message history between two users
export const getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user._id;

    const messages = await Chat.find({
      $or: [
        { sender: userId, recipient: partnerId },
        { sender: partnerId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("recipient", "name email");

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of active chats/conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all chats involving the user
    const chats = await Chat.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .populate("recipient", "name email");

    // Group chats by the other participant
    const conversationMap = new Map();

    for (const chat of chats) {
      const isSender = chat.sender._id.toString() === userId.toString();
      const partner = isSender ? chat.recipient : chat.sender;
      
      if (!partner) continue;
      
      const partnerId = partner._id.toString();

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
