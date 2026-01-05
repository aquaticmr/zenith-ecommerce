"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Package, Calendar, CheckCircle, AlertCircle } from "lucide-react";

export default function OrdersPage() {
  // 1. Initialize as an empty array
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/user/orders/my-orders")
      .then(res => {
        // 2. SAFETY CHECK: Spring sometimes wraps lists in a "content" field (if paginated)
        // We check if res.data is an array, if not, we look for res.data.content
        const data = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setOrders(data);
      })
      .catch(err => {
        console.error("Order fetch error:", err);
        setError("Could not load orders. Please make sure you are logged in.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-black">Loading your history...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-40">
        <h1 className="text-4xl font-serif mb-12 text-black">Your Orders</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 3. USE OPTIONAL CHAINING AND ARRAY CHECK */}
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order: any) => (
              <div key={order.id} className="border border-gray-100 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl text-black">
                    <Package size={30} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Calendar size={14} />
                      <span>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Date Pending"}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold mb-2 text-black">
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle size={12} /> {order.status || "CONFIRMED"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            !error && <p className="text-center text-gray-400 italic py-20 border-2 border-dashed border-gray-100 rounded-3xl">No orders found in your account.</p>
          )}
        </div>
      </div>
    </div>
  );
}