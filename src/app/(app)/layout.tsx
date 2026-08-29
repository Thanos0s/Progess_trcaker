import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { streakForUser } from "@/lib/score";
import { dayKey } from "@/lib/day";
import { Nav } from "@/components/Nav";
import { ToastProvider } from "@/components/Toast";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/auth");

  const streak = await streakForUser(user.id, dayKey());

  return (
    <ToastProvider>
      <Nav
        displayName={user.displayName}
        avatar={user.avatar}
        color={user.color}
        branch={user.branch}
        streak={streak}
      />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">{children}</main>
    </ToastProvider>
  );
}
