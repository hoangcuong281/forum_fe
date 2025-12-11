"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", { method: "POST", credentials: "include" });
      if (!res.ok) {
        console.error('Logout failed', res.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      try {
        window.dispatchEvent(new CustomEvent('authChanged'))
      } catch {
      }
      setLoading(false);
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-block px-4 py-2 text-sm bg-transparent hover:bg-gray-100 rounded cursor-pointer"
      disabled={loading}
      aria-label="Đăng xuất"
    >
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
