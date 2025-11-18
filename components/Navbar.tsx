import Image from "next/image";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { cookies } from "next/headers";

export default async function Navbar() {
  const cookieStore = cookies();
  const session = (await cookieStore).get("sessionId");

  let user: null | { avatar: string; name: string } = null;

  // Nếu có sessionID → gọi API để lấy thông tin user
  if (session) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/me`, {
        method: "GET",
        cache: "no-store",
        headers: {
          cookie: `sessionId=${session.value}`,
        },
      });

      if (res.ok) {
        user = await res.json();
      }
    } catch (err) {
      user = null;
    }
  }

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

      <div className="w-full md:w-[300px] lg:w-[500px]">
        <InputGroup>
          <InputGroupInput placeholder="Câu hỏi của bạn là gì?" />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Nếu chưa login → hiện Đăng nhập */}
      {!user && (
        <div className="w-full md:w-auto text-center md:text-left">
          <a href="/login" className="inline-block px-4 py-2">
            Đăng nhập
          </a>
        </div>
      )}

      {/* Nếu login → hiện avatar */}
      {user && (
        <div className="flex items-center gap-2">
          <Image
            src={user.avatar}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}
