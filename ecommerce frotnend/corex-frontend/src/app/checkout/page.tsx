"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch cart to show real subtotal
    api.get("/user/cart").then(res => {
      const sum = res.data.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
      setTotal(sum);
    });
  }, []);

  const handleCompleteOrder = async () => {
  try {
    await api.post("/user/orders/checkout");
    alert("Order Recorded! Check your email.");
    router.push("/orders"); // Go to the Orders History page we built
  } catch (err) {
    alert("Failed to place order. Is your bag empty?");
  }
};

// ... In your JSX ...
<button onClick={handleCompleteOrder} className="...">
    COMPLETE ORDER
</button>

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-40 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Form */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-serif mb-8">Shipping Information</h2>
          <div className="space-y-6">
            <input className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all" placeholder="Full Name" />
            <input className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all" placeholder="Delivery Address" />
            <input className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all" placeholder="Phone Number" />
          </div>
        </div>

        {/* Right: Summary */}
        <div className="bg-black text-white p-10 rounded-3xl h-fit shadow-2xl">
          <h2 className="text-2xl font-serif mb-10 text-gray-200">Order Summary</h2>
          <div className="flex justify-between border-b border-white/10 pb-6 mb-10">
            <span className="text-gray-400 uppercase tracking-widest text-xs">Subtotal</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCompleteOrder}
            disabled={loading || total === 0}
            className="w-full bg-white text-black py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95 disabled:bg-gray-600"
          >
            {loading ? "Processing..." : "Complete Order"}
          </button>
        </div>
      </div>
    </div>
  );
}