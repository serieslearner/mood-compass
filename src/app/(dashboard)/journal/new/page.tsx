"use client";

import { JournalEditor } from "@/components/journal/journal-editor";
import { useTranslation } from "@/components/i18n-provider";

export default function NewJournalPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("journalNew.title")}</h1>
        <p className="text-muted-foreground">
          {t("journalNew.subtitle")}
        </p>
      </div>
      <JournalEditor />
    </div>
  );
}
