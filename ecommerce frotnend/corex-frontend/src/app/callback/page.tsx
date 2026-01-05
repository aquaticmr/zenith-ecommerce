"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("token", token);
      router.push("/"); // Force redirect to home
    } else {
      console.error("No token found in URL");
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="text-center">
        <p className="text-lg font-medium">Finalizing Login...</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-[#f08804] mx-auto"></div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}