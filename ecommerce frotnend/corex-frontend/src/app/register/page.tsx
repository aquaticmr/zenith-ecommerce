"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import Background from "@/components/background";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      router.push("/login");
    } catch (err) {
      alert("Registration Failed. This node may already exist.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <Background />
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-blue-50/50 rotate-45 rounded-[3rem] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] bg-white/90 backdrop-blur-2xl border border-white p-12 shadow-2xl rounded-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-black tracking-tighter mb-2">ZENITH<span className="text-[#c4a47c]">.</span></h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Register Identity</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="relative">
            <User className="absolute right-0 top-3 text-gray-300" size={16} />
            <input type="text" placeholder="FULL NAME" required className="input-zenith"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute right-0 top-3 text-gray-300" size={16} />
            <input type="email" placeholder="EMAIL ADDRESS" required className="input-zenith"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute right-0 top-3 text-gray-300" size={16} />
            <input type="password" placeholder="PASSWORD" required className="input-zenith"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn-zenith w-full flex items-center justify-center gap-4 group mt-4">
            Initialize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-gray-400 font-medium tracking-widest uppercase">
          Already a member? <Link href="/login" className="text-black font-bold ml-2 underline">SIGN IN</Link>
        </p>
      </motion.div>
    </div>
  );
}