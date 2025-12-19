import { getCurrentUser } from "@/lib/action";
import { redirect } from "next/navigation";
import MyQuestion from "./myQuestion";

export default async function myQuestionPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return <MyQuestion/>;
}