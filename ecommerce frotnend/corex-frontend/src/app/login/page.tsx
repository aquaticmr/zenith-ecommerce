"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Github, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import Background from "@/components/background";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/"; 
    } catch (err) {
      alert("Access Denied: Invalid Credentials");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <Background />
      
      {/* Decorative Skewed Block behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[600px] bg-slate-50/50 -rotate-12 rounded-[4rem] -z-10 border border-slate-100" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl border border-white p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-black tracking-tighter mb-2">ZENITH<span className="text-[#c4a47c]">.</span></h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Elite Personal Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="relative">
            <Mail className="absolute right-0 top-3 text-gray-300" size={16} />
            <input 
              type="email" placeholder="EMAIL ADDRESS" required 
              className="input-zenith" onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute right-0 top-3 text-gray-300" size={16} />
            <input 
              type="password" placeholder="PASSWORD" required 
              className="input-zenith" onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-zenith w-full flex items-center justify-center gap-4 group">
            Authenticate <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative flex py-10 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Social Link</span>
            <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.href="http://localhost:8080/oauth2/authorization/google"}
            className="flex items-center justify-center gap-2 border border-gray-100 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 opacity-70" />
            <span className="text-[10px] font-bold">GOOGLE</span>
          </button>
          
          <button 
            onClick={() => window.location.href="http://localhost:8080/oauth2/authorization/github"}
            className="flex items-center justify-center gap-2 bg-[#0a0a0a] text-white py-3 rounded-xl hover:bg-black transition-all"
          >
            <Github size={16} />
            <span className="text-[10px] font-bold">GITHUB</span>
          </button>
        </div>

        <p className="mt-12 text-center text-[10px] text-gray-400 font-medium">
          New to the collective? 
          <Link href="/register" className="text-black font-bold ml-2 underline underline-offset-4 hover:text-[#c4a47c]">CREATE ACCOUNT</Link>
        </p>
      </motion.div>
    </div>
  );
}