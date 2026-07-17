import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://ro-ben-dev-hands-on.vercel.app";
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner._id);
    }
  }, [activePartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/chat/conversations`, config);
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activePartner) {
          setActivePartner(res.data.conversations[0].partner);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (partnerId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/chat/messages/${partnerId}`, config);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    try {
      const res = await axios.post(`${backendUrl}/api/chat/send`, {
        recipientId: activePartner._id,
        message: newMessage,
      }, config);

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.chat]);
        setNewMessage("");
        fetchConversations(); // refresh sidebar list
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto my-6 px-4 h-[75vh] flex gap-4">
        {/* Conversations Sidebar */}
        <div className="w-1/3 bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex flex-col shadow-xl">
          <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Conversations</h3>
          <div className="flex-grow overflow-y-auto space-y-1">
            {conversations.map((conv) => {
              const active = activePartner?._id === conv.partner._id;
              return (
                <button
                  key={conv.partner._id}
                  onClick={() => setActivePartner(conv.partner)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                    active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <FaUserCircle size={32} className={active ? "text-white" : "text-slate-400"} />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm truncate">{conv.partner.name}</h4>
                    <p className={`text-xs truncate ${active ? "text-white/80" : "text-slate-400"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
            {conversations.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-12">No chats yet</p>
            )}
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-grow bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl flex flex-col shadow-xl overflow-hidden">
          {activePartner ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/30">
                <FaUserCircle size={32} className="text-slate-400" />
                <div>
                  <h4 className="font-bold text-slate-800">{activePartner.name}</h4>
                  <span className="text-[10px] uppercase font-black tracking-wider text-green-500 animate-pulse">Online</span>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {messages.map((msg) => {
                  const isMe = msg.sender._id === activePartner._id ? false : true;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                            : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                        <span className={`block text-[9px] mt-1 text-right ${isMe ? "text-white/70" : "text-slate-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white/30 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-slate-800 text-sm font-bold transition-all focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm font-bold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Chat;
