"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  aiPrompt: string | null;
  createdAt: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/journal");
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
          <h1 className="text-2xl font-bold">{t("journal.title")}</h1>
          <p className="text-muted-foreground">
            {t("journal.subtitle")}
          </p>
        </div>
        <Link href="/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("journal.newEntry")}
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("journal.noEntries")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-base">{entry.title}</CardTitle>
                <CardDescription>
                  {new Date(entry.createdAt).toLocaleDateString(dateLocale, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
