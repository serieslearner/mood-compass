"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/components/i18n-provider";

export function CrisisBanner() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-2 bg-destructive/10 px-4 py-2 text-sm">
      <Badge variant="destructive" className="text-xs">
        {t("crisis.badge")}
      </Badge>
      <span className="text-destructive">
        {t("crisis.message")}{" "}
        <a href={t("crisis.telLink")} className="font-bold underline">
          {t("crisis.hotline")}
        </a>{" "}
        {t("crisis.hotlineLabel")}
      </span>
    </div>
  );
}
