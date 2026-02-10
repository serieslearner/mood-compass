import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, BarChart3, Brain, BookOpen, Pill } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Mood Tracking",
    description:
      "Log your mood, energy, anxiety, and sleep daily. Visualize patterns over time with interactive charts.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description:
      "Get personalized insights powered by AI that help you understand your mood patterns and triggers.",
  },
  {
    icon: BookOpen,
    title: "Guided Journal",
    description:
      "Write journal entries with AI-generated prompts tailored to your current emotional state.",
  },
  {
    icon: Pill,
    title: "Medication Tracker",
    description:
      "Track your medications, dosages, and adherence to stay on top of your treatment plan.",
  },
];

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">MoodCompass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:py-32">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Navigate your emotions with confidence
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            MoodCompass is an AI-powered companion for bipolar disorder
            management. Track moods, discover patterns, and gain insights — all
            in one place.
          </p>
          <div className="flex gap-3">
            <Link href="/sign-up">
              <Button size="lg">Start tracking free</Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <p className="mb-2">
          MoodCompass is open source and released under the AGPL-3.0 license.
        </p>
        <p className="font-medium text-destructive/80">
          This app is not a replacement for professional medical care. Always
          consult your healthcare provider about your treatment.
        </p>
      </footer>
    </div>
  );
}
