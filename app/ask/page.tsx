import { getCurrentUser } from "@/lib/action";
import { redirect } from "next/navigation";
import AskForm from "./AskForm";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <AskForm />;
}
