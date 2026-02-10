"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmilePlus, BookOpen, Brain } from "lucide-react";
import { MoodChart } from "@/components/mood/mood-chart";

const quickActions = [
  {
    href: "/mood/new",
    icon: SmilePlus,
    title: "Log Mood",
    description: "Record how you're feeling right now",
  },
  {
    href: "/journal/new",
    icon: BookOpen,
    title: "Write Journal",
    description: "Start a new journal entry",
  },
  {
    href: "/insights",
    icon: Brain,
    title: "View Insights",
    description: "See AI-powered mood analysis",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your recent activity.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="pb-2">
                <action.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent mood chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mood — Last 7 Days</CardTitle>
              <CardDescription>Your recent mood trends</CardDescription>
            </div>
            <Link href="/mood">
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <MoodChart />
        </CardContent>
      </Card>
    </div>
  );
}
