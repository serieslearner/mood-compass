"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MoodDataPoint {
  date: string;
  moodScore: number;
  energy: number;
  anxiety: number;
}

export function MoodChart() {
  const [data, setData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoodData() {
      try {
        const res = await fetch("/api/mood?limit=7");
        if (res.ok) {
          const entries = await res.json();
          setData(
            entries
              .map((e: { date: string; moodScore: number; energy: number; anxiety: number }) => ({
                date: new Date(e.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                moodScore: e.moodScore,
                energy: e.energy,
                anxiety: e.anxiety,
              }))
              .reverse()
          );
        }
      } catch {
        // API not connected yet
      } finally {
        setLoading(false);
      }
    }
    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No mood entries yet. Start by logging your first mood!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis domain={[1, 10]} className="text-xs" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="moodScore"
          name="Mood"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
        />
        <Area
          type="monotone"
          dataKey="energy"
          name="Energy"
          stroke="hsl(var(--chart-2))"
          fill="hsl(var(--chart-2))"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
