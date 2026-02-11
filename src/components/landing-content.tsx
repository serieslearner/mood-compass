"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, BarChart3, Brain, BookOpen, Pill } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";

const features: { icon: typeof BarChart3; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    icon: BarChart3,
    titleKey: "landing.features.moodTracking.title",
    descKey: "landing.features.moodTracking.description",
  },
  {
    icon: Brain,
    titleKey: "landing.features.aiInsights.title",
    descKey: "landing.features.aiInsights.description",
  },
  {
    icon: BookOpen,
    titleKey: "landing.features.guidedJournal.title",
    descKey: "landing.features.guidedJournal.description",
  },
  {
    icon: Pill,
    titleKey: "landing.features.medicationTracker.title",
    descKey: "landing.features.medicationTracker.description",
  },
];

export function LandingContent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{t("common.appName")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
            className="text-xs"
          >
            {locale === "ko" ? "EN" : "KO"}
          </Button>
          <Link href="/sign-in">
            <Button variant="ghost">{t("common.signIn")}</Button>
          </Link>
          <Link href="/sign-up">
            <Button>{t("common.getStarted")}</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:py-32">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            {t("landing.hero.title")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("landing.hero.description")}
          </p>
          <div className="flex gap-3">
            <Link href="/sign-up">
              <Button size="lg">{t("landing.hero.startTracking")}</Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">
                {t("common.signIn")}
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.titleKey}>
              <CardHeader>
                <f.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>{t(f.titleKey)}</CardTitle>
                <CardDescription>{t(f.descKey)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <p className="mb-2">
          {t("landing.footer.openSource")}
        </p>
        <p className="font-medium text-destructive/80">
          {t("landing.footer.disclaimer")}
        </p>
      </footer>
    </div>
  );
}
