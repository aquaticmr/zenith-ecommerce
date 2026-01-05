"use client";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, LogOut, Package, Heart, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const navLinks = [
    { name: 'Home', path: '/', slug: 'all' },
    { name: 'Men', path: '/category/MEN', slug: 'MEN' },
    { name: 'Women', path: '/category/WOMEN', slug: 'WOMEN' },
    { name: 'Accessories', path: '/category/ACCESSORIES', slug: 'ACCESSORIES' },
    { name: 'Trending', path: '/', slug: 'trending' }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      api.get("/user/cart").then(res => {
        const count = res.data.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
      }).catch(() => setCartCount(0));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Main Bar - Deep Midnight Indigo Color */}
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-10">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-black tracking-tighter hover:opacity-80 transition-opacity">
            ZENITH<span className="text-[#f59e0b]">.</span>
          </Link>

          {/* Search Bar - Contrast Grey */}
          <div className="hidden md:flex flex-grow max-w-xl relative group">
            <input 
              type="text" 
              placeholder="Search premium collection..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-12 py-2.5 text-sm outline-none focus:bg-slate-800 focus:border-slate-500 transition-all text-white placeholder:text-slate-400"
            />
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-white" size={18} />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-8">
            
            {/* Profile */}
            <div 
              className="relative cursor-pointer py-2 group"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="flex flex-col items-center gap-1 group-hover:text-[#f59e0b] transition-colors">
                <User size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Profile</span>
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-[-40px] w-64 bg-white shadow-2xl rounded-xl p-6 mt-1 text-slate-900 border border-slate-100"
                  >
                    <h4 className="font-bold text-sm">Member Access</h4>
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 mt-2">
                      <Link href="/orders" className="flex items-center gap-3 text-sm hover:text-[#0f172a] hover:font-bold transition-all"><Package size={16}/> My Orders</Link>
                      <Link href="#" className="flex items-center gap-3 text-sm hover:text-[#0f172a] hover:font-bold transition-all"><Heart size={16}/> Wishlist</Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-red-600 font-bold mt-2 border-t border-slate-50 pt-3">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bag */}
            <Link href="/cart" className="flex flex-col items-center gap-1 group relative hover:text-[#f59e0b] transition-colors">
              <div className="relative">
                 <ShoppingBag size={20} />
                 {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 bg-[#f59e0b] text-[#0f172a] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                     {cartCount}
                   </span>
                 )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Bag</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Category Bar - Clean White Opaque */}
      <div className="bg-white border-b border-gray-200 py-3 flex justify-center gap-12">
         {navLinks.map((link) => (
           <Link 
             key={link.name} 
             href={link.path}
             className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-[#0f172a] ${
               activeCategory === link.slug 
               ? "text-[#0f172a] border-b-2 border-[#f59e0b] pb-1" 
               : "text-slate-400"
             }`}
           >
             {link.name}
           </Link>
         ))}
      </div>
    </nav>
  );
}