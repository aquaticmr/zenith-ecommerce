"use client";
import { useParams, useRouter } from "next/navigation"; // Add useRouter
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Star, ShoppingCart, CheckCircle } from "lucide-react"; // Add CheckCircle

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1); // Track quantity
  const [isAdded, setIsAdded] = useState(false); // For success feedback

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  // --- THE ADD TO CART LOGIC ---
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect if not logged in
      return;
    }

    try {
      // Sending request to Backend
      await api.post(`/user/cart/add?productId=${id}&quantity=${quantity}`);
      
      // Show success feedback
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000); // Hide after 3 seconds
      
      // Optional: Refresh page to update Navbar count (if implemented)
      window.location.reload(); 
    } catch (error) {
      alert("Failed to add item to cart. Please try again.");
    }
  };

  if (!product) return <div className="h-screen flex items-center justify-center">Loading Product...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT: Image */}
          <div className="bg-[#F9F9F9] rounded-2xl overflow-hidden aspect-[4/5] flex items-center justify-center">
            <img src={product.imageUrl} className="max-h-full max-w-full object-contain" alt={product.name} />
          </div>

          {/* RIGHT: Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-black mb-8">${product.price}</div>

            <p className="text-gray-600 mb-8 border-t pt-8">{product.description}</p>

            <div className="space-y-6 mb-10">
              {/* Quantity Selector */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-3">Quantity</h4>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-200 rounded-md px-4 py-2 outline-none cursor-pointer"
                >
                  {[1,2,3,4,5].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>

            {/* THE BUTTON */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-4 rounded-md font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isAdded ? "bg-green-500 text-white" : "bg-[#e94560] hover:bg-[#d43d55] text-white"
              }`}
            >
              {isAdded ? (
                <><CheckCircle size={20} /> Added to Bag</>
              ) : (
                <><ShoppingCart size={20} /> Add to Cart</>
              )}
            </button>

            {isAdded && (
               <p className="text-green-600 text-sm mt-3 text-center font-medium">
                 Item successfully added to your shopping bag!
               </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}