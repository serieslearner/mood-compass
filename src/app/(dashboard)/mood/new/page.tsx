"use client";

import { MoodForm } from "@/components/mood/mood-form";
import { useTranslation } from "@/components/i18n-provider";

export default function NewMoodPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("moodForm.pageTitle")}</h1>
        <p className="text-muted-foreground">
          {t("moodForm.pageSubtitle")}
        </p>
      </div>
      <MoodForm />
    </div>
  );
}
