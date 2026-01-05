"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Cart from Backend
  const fetchCart = async () => {
    try {
      const res = await api.get("/user/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Calculate Total Price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
  };

  // 3. Remove Item Logic (Optional but recommended)
  // Note: Ensure your backend has a DELETE mapping for this
  const removeItem = async (itemId: number) => {
    try {
      // If you haven't built the delete API yet, this is just a placeholder
      // await api.delete(`/user/cart/${itemId}`); 
      setCartItems(cartItems.filter((item: any) => item.id !== itemId));
    } catch (err) {
      alert("Error removing item");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic">Loading your bag...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-40">
        <h1 className="text-4xl font-serif mb-10 text-gray-900 tracking-tight">Your Shopping Bag</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Side: List of Items */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8 group">
                  <div className="w-32 h-40 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 uppercase tracking-tight">
                          {item.product.name}
                        </h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 uppercase text-[10px] font-bold tracking-widest">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-xl font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-2xl sticky top-40">
                <h2 className="text-xl font-serif mb-6">Summary</h2>
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-sm text-gray-500 font-medium uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 mb-8">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-2xl font-bold">${calculateTotal()}</span>
                </div>

                <button 
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-black text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 italic mb-8">Your bag is currently empty.</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
              Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}