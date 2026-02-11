"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodChart } from "@/components/mood/mood-chart";
import { Plus } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";

interface MoodEntry {
  id: string;
  date: string;
  moodScore: number;
  energy: number;
  anxiety: number;
  irritability: number;
  sleepHours: number;
  sleepQuality: number;
  notes: string | null;
}

function moodLabelKey(score: number): TranslationKey {
  if (score <= 2) return "mood.labelVeryLow";
  if (score <= 4) return "mood.labelLow";
  if (score <= 6) return "mood.labelModerate";
  if (score <= 8) return "mood.labelGood";
  return "mood.labelExcellent";
}

function moodVariant(score: number): "destructive" | "secondary" | "default" | "outline" {
  if (score <= 3) return "destructive";
  if (score <= 5) return "secondary";
  if (score <= 7) return "default";
  return "outline";
}

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/mood");
        if (res.ok) {
          setEntries(await res.json());
        }
      } catch {
        // API not connected
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  const dateLocale = locale === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("mood.title")}</h1>
          <p className="text-muted-foreground">
            {t("mood.subtitle")}
          </p>
        </div>
        <Link href="/mood/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("mood.logMood")}
          </Button>
        </Link>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("mood.moodOverTime")}</CardTitle>
          <CardDescription>{t("mood.moodTrends")}</CardDescription>
        </CardHeader>
        <CardContent>
          <MoodChart />
        </CardContent>
      </Card>

      {/* Entry list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{t("mood.recentEntries")}</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("mood.noEntries")}
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString(dateLocale, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{t("mood.energy", { value: entry.energy })}</span>
                    <span>{t("mood.anxiety", { value: entry.anxiety })}</span>
                    <span>{t("mood.sleep", { value: entry.sleepHours })}</span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
                <Badge variant={moodVariant(entry.moodScore)}>
                  {t(moodLabelKey(entry.moodScore))} ({entry.moodScore}/10)
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
