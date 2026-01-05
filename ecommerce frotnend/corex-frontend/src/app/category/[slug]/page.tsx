"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function CategoryPage() {
  const { slug } = useParams(); // Gets 'MEN' or 'WOMEN' from the URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Calls: http://localhost:8080/api/products?category=MEN
        const res = await api.get(`/products?category=${slug}`);
        const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching category", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryData();
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-black">Opening {slug} Collection...</div>;

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16 border-b border-gray-100 pb-10">
            <h1 className="text-5xl font-serif text-gray-900 uppercase tracking-tighter italic">
              {slug} <span className="text-gray-300 font-sans">/</span> Collection
            </h1>
            <p className="text-gray-400 text-[10px] mt-4 uppercase tracking-[0.4em] font-bold">
               Explore our curated {slug} selection
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.length > 0 ? (
            products.map((p: any) => (
              <ScrollReveal key={p.id}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full py-40 text-center text-gray-300 italic font-serif">
              No items currently available in this module.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}