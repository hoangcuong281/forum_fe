"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { Button } from "./ui/button";

export default function Navbar() {
  const [user, setUser] = useState<null | { fullName: string; role: string }>(null);
  const [role, setRole] = useState(null);
  const loadUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        console.log(data.role);
        setRole(data.role || "STUDENT");
        return;
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const handler = () => {
      loadUser();
    };
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-[50px] lg:px-[100px] py-[10px] shadow-sm gap-4 md:gap-0">
      
      <Link href="/">
        <Image
          src="https://res.cloudinary.com/dqxeupx0u/image/upload/v1762483656/logo_defmcf.svg"
          alt="TLU logo"
          width={180}
          height={38}
          className="md:w-[180px] lg:w-[200px]"
          priority
        />
      </Link>


      {!user && (
        <div className="w-full md:w-auto text-center md:text-left">
          <a href="/login" className="inline-block px-4 py-2">
            Đăng nhập
          </a>
        </div>
      )}

      {user && (
        <div className="flex items-center gap-2">
          <div className="font-bold">{user.fullName}</div>
          {role === "STUDENT" && <Button variant='outline'><Link href="/myQuestion">Câu hỏi của tôi</Link></Button>}
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
