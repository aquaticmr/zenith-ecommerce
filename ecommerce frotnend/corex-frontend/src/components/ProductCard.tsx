"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion"; // 1. Import Framer Motion

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      // 2. SCROLL ANIMATION: Card slides up and fades in when it enters the screen
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      
      // 3. HOVER INTERACTION: Card lifts and glows slightly on hover
      whileHover={{ 
        y: -10, 
        transition: { duration: 0.3 } 
      }}
      
      // 4. GLASS STYLING: Semi-transparent white with blur
      className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group"
    >
      <Link href={`/product/${product.id}`} className="cursor-pointer block">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-gray-50/50">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Category Badge - Glass style */}
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0f172a] text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.1em] shadow-sm">
            {product.category}
          </span>
        </div>
        
        {/* Product Details */}
        <div className="mt-5 px-1 pb-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center text-[10px] text-orange-400 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">
              <Star size={10} fill="currentColor" className="mr-1" /> 4.8
            </div>
          </div>
          
          <p className="text-[11px] text-gray-500 line-clamp-1 mb-3">
            {product.description || "Premium curated selection"}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-[#0f172a] tracking-tighter">
              ${product.price}
            </span>
            
            {/* Minimalist Action Indicator */}
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
               <span className="text-xs font-bold">+</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}