import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const session = (await cookieStore).get("JSESSIONID");
    if (!session) {
        return null;
    }
    try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
        method: "GET",
        headers: {
            Cookie: `JSESSIONID=${session.value}`,
            },
        });
    if (res.ok) {
      return await res.json();
    }
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
    return null;
}