import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Create your GATE 2027 tracker account or sign back in to continue your streak.",
};

export default async function AuthPage() {
  if (await currentUserId()) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 self-start text-sm text-muted transition hover:text-text">
        ← Back
      </Link>
      <AuthForm />
    </main>
  );
}
