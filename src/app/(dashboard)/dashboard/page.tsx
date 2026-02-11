"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmilePlus, BookOpen, Brain } from "lucide-react";
import { MoodChart } from "@/components/mood/mood-chart";
import { useTranslation } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";

const quickActions: { href: string; icon: typeof SmilePlus; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    href: "/mood/new",
    icon: SmilePlus,
    titleKey: "dashboard.logMood",
    descKey: "dashboard.logMoodDesc",
  },
  {
    href: "/journal/new",
    icon: BookOpen,
    titleKey: "dashboard.writeJournal",
    descKey: "dashboard.writeJournalDesc",
  },
  {
    href: "/insights",
    icon: Brain,
    titleKey: "dashboard.viewInsights",
    descKey: "dashboard.viewInsightsDesc",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t("dashboard.welcome", { name: firstName || "there" })}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="pb-2">
                <action.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">{t(action.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t(action.descKey)}</CardDescription>
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
              <CardTitle>{t("dashboard.moodLast7Days")}</CardTitle>
              <CardDescription>{t("dashboard.recentMoodTrends")}</CardDescription>
            </div>
            <Link href="/mood">
              <Button variant="outline" size="sm">
                {t("dashboard.viewAll")}
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
