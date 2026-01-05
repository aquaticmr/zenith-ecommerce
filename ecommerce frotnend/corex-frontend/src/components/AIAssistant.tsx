"use client";
import { useState } from "react";
import { api } from "@/lib/api"; // Your axios instance
import { Send, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your AI Assistant. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/ai/chat", { prompt: input });
      setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            
            {/* Header */}
            <div className="p-4 bg-black text-white flex justify-between">
              <span className="font-bold text-sm uppercase tracking-widest">ZENITH AI</span>
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-gray-400 italic">Stylist is thinking...</div>}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about fashion..." className="flex-grow text-sm outline-none text-black" />
              <button onClick={handleSend} className="text-blue-600"><Send size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
        {isOpen ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}