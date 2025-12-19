'use server'
import { getCurrentUser } from "@/lib/action";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const role = (user as any)?.role ?? (user as any)?.roles ?? null;
  const isAdmin = role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'));
  if (!isAdmin) redirect('/');

  return <AdminClient />;
}