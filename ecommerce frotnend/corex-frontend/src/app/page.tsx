"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import Background from "@/components/background";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function HomeContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Get category from URL (e.g., localhost:3000/?category=MEN)
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  useEffect(() => {
    // 1. Check Authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 2. Fetch Data based on category
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Use backticks for proper string interpolation
        const url = category === "all" ? "/products" : `/products?category=${category}`;
        const res = await api.get(url);
        
        // Handle Spring Data Page structure or raw Array
        const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setProducts(data);
      } catch (err) {
        console.error("Fetch failed", err);
        // If token is invalid, kick to login
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-midnight rounded-full animate-spin"></div>
          <p className="font-serif italic text-slate-400">Opening the collection...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Background />

      {/* 1. HERO SECTION */}
      <section className="h-[95vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Editorial Design Line */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />

        <motion.span 
          initial={{ opacity: 0, tracking: "0.2em" }}
          animate={{ opacity: 1, tracking: "0.6em" }}
          className="text-[10px] font-black uppercase text-slate-400 mb-8 block z-10"
        >
          Winter / Spring 2026
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-serif text-[#0f172a] mb-12 z-10 tracking-tighter"
        >
          Welcome to <br/> <span className="italic font-light">ZENITH</span>
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-6 z-10">
          <button 
            onClick={() => router.push("/?category=WOMEN")}
            className="bg-[#0f172a] text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-black hover:scale-105 transition-all shadow-2xl"
          >
            Shop Women
          </button>
          <button 
            onClick={() => router.push("/?category=MEN")}
            className="border border-[#0f172a] bg-white/50 backdrop-blur-sm text-[#0f172a] px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#0f172a] hover:text-white transition-all"
          >
            Shop Men
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-40">
            <span className="text-[9px] uppercase tracking-widest font-bold">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-400 to-transparent"></div>
        </div>
      </section>

      {/* 2. CATEGORY BOXES (Reveals as you scroll) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-serif mb-20 text-[#0f172a]">Shop by Category</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryBox 
            label="Women's Collection" 
            slug="WOMEN" 
            img="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" 
          />
          <CategoryBox 
            label="Men's Collection" 
            slug="MEN" 
            img="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800" 
          />
          <CategoryBox 
            label="Luxury Accessories" 
            slug="ACCESSORIES" 
            img="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800" 
          />
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-8">
             <h2 className="text-4xl font-serif text-[#0f172a] italic lowercase">
               {category === "all" ? "trending now" : `${category} essentials`}
             </h2>
             <Link href="/?category=all" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
               View All
             </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-serif italic">
            Currently curating more items for this section.
          </div>
        )}
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#0f172a] text-white py-24 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <h3 className="text-2xl font-serif font-black tracking-tighter mb-4">CoreX<span className="text-[#f59e0b]">.</span></h3>
            <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-widest">
              High-fidelity hardware and textiles for the modern digital era.
            </p>
          </div>
          <div className="flex gap-16 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <div className="flex flex-col gap-4">
              <span className="text-white">Collectives</span>
              <Link href="#" className="hover:text-white">Sustainability</Link>
              <Link href="#" className="hover:text-white">Ethics</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white">Support</span>
              <Link href="#" className="hover:text-white">Help Center</Link>
              <Link href="#" className="hover:text-white">Shipping</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Sub-component for Category Cards
function CategoryBox({label, slug, img}: any) {
  return (
    <ScrollReveal>
      <Link href={`/?category=${slug}`}>
        <div className="relative h-[550px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700">
          <img 
            src={img} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
            alt={label}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase italic">{label}</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/30 rounded-full px-6 py-2 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black transition-all">
              Explore <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

// Wrap in Suspense for Next.js build compatibility
export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-white"></div>}>
      <HomeContent />
    </Suspense>
  );
}