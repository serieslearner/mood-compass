"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";

export default function InsightsPage() {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, locale } = useTranslation();

  async function generateInsights() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/insights?locale=${locale}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      } else {
        setInsights(t("insights.errorNoData"));
      }
    } catch {
      setInsights(t("insights.errorConnection"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("insights.title")}</h1>
        <p className="text-muted-foreground">
          {t("insights.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {t("insights.analysisTitle")}
          </CardTitle>
          <CardDescription>
            {t("insights.analysisDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insights && !loading && (
            <Button onClick={generateInsights}>
              <Brain className="mr-2 h-4 w-4" />
              {t("insights.generate")}
            </Button>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("insights.analyzing")}
            </div>
          )}

          {insights && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {insights.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {insights && (
            <Button variant="outline" onClick={generateInsights} disabled={loading}>
              {t("insights.regenerate")}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 text-center text-xs text-muted-foreground">
          {t("insights.disclaimer")}
        </CardContent>
      </Card>
    </div>
  );
}
