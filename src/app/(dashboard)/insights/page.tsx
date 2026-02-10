"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";

export default function InsightsPage() {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateInsights() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/insights", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      } else {
        setInsights("Unable to generate insights. Make sure you have mood entries and the AI service is configured.");
      }
    } catch {
      setInsights("Unable to connect to the AI service. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Get AI-powered analysis of your mood patterns and personalized
          suggestions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Mood Pattern Analysis
          </CardTitle>
          <CardDescription>
            Based on your recent mood entries, our AI will identify patterns,
            potential triggers, and offer suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insights && !loading && (
            <Button onClick={generateInsights}>
              <Brain className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your mood data...
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
              Regenerate
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 text-center text-xs text-muted-foreground">
          AI insights are informational only and not a substitute for
          professional medical advice. Always consult your healthcare provider.
        </CardContent>
      </Card>
    </div>
  );
}
