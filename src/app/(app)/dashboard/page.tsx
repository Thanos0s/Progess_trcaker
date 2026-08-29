import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getDashboard } from "@/lib/dashboard";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Today's tasks, study log and full syllabus progress for your GATE 2027 branch.",
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/auth");

  const data = await getDashboard(user);
  return <DashboardClient user={user} data={data} />;
}
