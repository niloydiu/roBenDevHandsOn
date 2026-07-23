"use client";
export const dynamic = "force-dynamic";
import React, { useContext, useState, useEffect } from "react";
import { Appcontext } from "@/context/Appcontext";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";
import { MessageSquare, Send, User, ShieldCheck, Search, Circle } from "lucide-react";
import { seedUsers } from "@/lib/data";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const ChatPage = () => {
  const { token, userData } = useContext(Appcontext);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeContact, setActiveContact] = useState(seedUsers[1]);
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<Record<string, Array<{ sender: string; text: string; time: string }>>>({
    "u-2": [
      { sender: "them", text: "Hi! Thanks for offering to help with the Dhanmondi Lake Cleanup.", time: "10:30 AM" },
      { sender: "me", text: "Glad to help! What time should we meet at the park entrance?", time: "10:32 AM" },
      { sender: "them", text: "We start around 8:00 AM on Saturday. Supplies will be provided!", time: "10:35 AM" }
    ],
    "u-3": [
      { sender: "them", text: "Hey Niloy, can you assist with the STEM coding workshop prep?", time: "Yesterday" },
      { sender: "me", text: "Sure thing! I have laptops ready to set up.", time: "Yesterday" }
    ],
    "u-4": [
      { sender: "them", text: "Thank you for supporting the community food drive!", time: "2 days ago" }
    ]
  });

  if (!mounted) {
    return (
      <PageWrapper>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (!token) {
    return (
      <PageWrapper>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <div className="w-full max-w-md card-saas p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">Authentication Required</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Please sign in to access direct volunteer messaging and coordinate community initiatives.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="btn-saas btn-primary text-xs px-6">
                Sign In
              </Link>
              <Link href="/signup" className="btn-saas btn-secondary text-xs px-6">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const activeMessages = conversations[activeContact.id] || [
    { sender: "them", text: `Hello! Excited to collaborate with you on HandsOn initiatives.`, time: "Just now" }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg = { sender: "me", text: messageText.trim(), time: "Just now" };
    setConversations((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));
    setMessageText("");
  };

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-64px)] bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="text-emerald-600 dark:text-emerald-400" size={24} />
                Volunteer Messages
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Direct communication for event coordination and mutual aid</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="lg:col-span-4 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-900/50">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-saas pl-8 text-xs w-full"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {seedUsers.slice(1, 6).map((contact) => {
                  const isSelected = contact.id === activeContact.id;
                  const lastMsg = conversations[contact.id]?.[conversations[contact.id]?.length - 1];
                  return (
                    <button
                      key={contact.id}
                      onClick={() => setActiveContact(contact)}
                      className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                        isSelected 
                          ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-emerald-600 dark:border-emerald-500" 
                          : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</h4>
                          <span className="text-[10px] text-zinc-400 shrink-0">{lastMsg?.time || "Active"}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {lastMsg?.text || `Volunteer coordinator`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-zinc-900">
              {/* Active Contact Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{activeContact.name}</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck size={12} /> {activeContact.verificationLevel} Verified Volunteer
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/20 dark:bg-zinc-950/20">
                {activeMessages.map((msg, idx) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs border border-zinc-200/50 dark:border-zinc-700/50"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[9px] mt-1 text-right ${
                            isMe ? "text-emerald-100" : "text-zinc-400"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Send Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message ${activeContact.name}...`}
                  className="input-saas text-xs flex-1 !h-10"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-saas btn-primary !h-10 !px-4 text-xs shrink-0"
                >
                  <Send size={14} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ChatPage;
