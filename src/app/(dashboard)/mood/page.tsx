"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodChart } from "@/components/mood/mood-chart";
import { Plus } from "lucide-react";

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

function moodLabel(score: number): string {
  if (score <= 2) return "Very Low";
  if (score <= 4) return "Low";
  if (score <= 6) return "Moderate";
  if (score <= 8) return "Good";
  return "Excellent";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mood Tracking</h1>
          <p className="text-muted-foreground">
            Track and visualize your mood over time.
          </p>
        </div>
        <Link href="/mood/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Mood
          </Button>
        </Link>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Over Time</CardTitle>
          <CardDescription>Your mood, energy, and anxiety trends</CardDescription>
        </CardHeader>
        <CardContent>
          <MoodChart />
        </CardContent>
      </Card>

      {/* Entry list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Entries</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No mood entries yet. Start by logging your first mood!
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Energy: {entry.energy}/10</span>
                    <span>Anxiety: {entry.anxiety}/10</span>
                    <span>Sleep: {entry.sleepHours}h</span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
                <Badge variant={moodVariant(entry.moodScore)}>
                  {moodLabel(entry.moodScore)} ({entry.moodScore}/10)
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
