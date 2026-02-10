"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export function MoodForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [moodScore, setMoodScore] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [irritability, setIrritability] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodScore,
          energy,
          anxiety,
          irritability,
          sleepHours,
          sleepQuality,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        router.push("/mood");
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Mood</Label>
              <span className="text-sm font-medium">{moodScore}/10</span>
            </div>
            <Slider
              value={[moodScore]}
              onValueChange={([v]) => setMoodScore(v)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very low</span>
              <span>Very high</span>
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Energy</Label>
              <span className="text-sm font-medium">{energy}/10</span>
            </div>
            <Slider
              value={[energy]}
              onValueChange={([v]) => setEnergy(v)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exhausted</span>
              <span>Very energetic</span>
            </div>
          </div>

          {/* Anxiety */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Anxiety</Label>
              <span className="text-sm font-medium">{anxiety}/10</span>
            </div>
            <Slider
              value={[anxiety]}
              onValueChange={([v]) => setAnxiety(v)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Very anxious</span>
            </div>
          </div>

          {/* Irritability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Irritability</Label>
              <span className="text-sm font-medium">{irritability}/10</span>
            </div>
            <Slider
              value={[irritability]}
              onValueChange={([v]) => setIrritability(v)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relaxed</span>
              <span>Very irritable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sleep Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Hours of sleep</Label>
              <span className="text-sm font-medium">{sleepHours}h</span>
            </div>
            <Slider
              value={[sleepHours]}
              onValueChange={([v]) => setSleepHours(v)}
              min={0}
              max={14}
              step={0.5}
            />
          </div>

          {/* Sleep Quality */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sleep quality</Label>
              <span className="text-sm font-medium">{sleepQuality}/5</span>
            </div>
            <Slider
              value={[sleepQuality]}
              onValueChange={([v]) => setSleepQuality(v)}
              min={1}
              max={5}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Terrible</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Anything else you'd like to note about today? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save mood entry"}
      </Button>
    </form>
  );
}
