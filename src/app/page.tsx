import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LandingContent } from "@/components/landing-content";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LandingContent />;
}
