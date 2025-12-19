import { getCurrentUser } from "@/lib/action";
import { redirect } from "next/navigation";
import AdvisorClient from "./AdvisorClient";

export default async function Page() {
	const user = await getCurrentUser();
	if (!user) redirect('/login');

	const role = (user as any)?.role ?? (user as any)?.roles ?? null;
	const isAdvisor = role === 'ADVISOR' || role === 'CVHT' || (Array.isArray(role) && (role.includes('ADVISOR') || role.includes('CVHT')));
	const isAdmin = role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'));

	if (!isAdvisor && !isAdmin) redirect('/');

	return <AdvisorClient />;
}
