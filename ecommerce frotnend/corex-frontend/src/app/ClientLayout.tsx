"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/AIAssistant";
import Background from "@/components/background";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/callback";

  return (
    <>
      <Background />
      {!isAuthPage && <Navbar />}
      <main className="relative z-10">{children}</main>
      {!isAuthPage && <AIAssistant />}
    </>
  );
}