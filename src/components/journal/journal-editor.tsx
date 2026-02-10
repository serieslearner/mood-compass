"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2 } from "lucide-react";

export function JournalEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function generatePrompt() {
    setPromptLoading(true);
    try {
      const res = await fetch("/api/ai/journal-prompt", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAiPrompt(data.prompt);
      }
    } catch {
      // AI not configured
    } finally {
      setPromptLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, aiPrompt: aiPrompt || null }),
      });

      if (res.ok) {
        router.push("/journal");
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Prompt */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">AI Writing Prompt</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generatePrompt}
              disabled={promptLoading}
            >
              {promptLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Brain className="mr-2 h-4 w-4" />
              )}
              Generate prompt
            </Button>
          </div>
        </CardHeader>
        {aiPrompt && (
          <CardContent>
            <p className="text-sm italic text-muted-foreground">{aiPrompt}</p>
          </CardContent>
        )}
      </Card>

      {/* Editor */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Saving..." : "Save entry"}
      </Button>
    </form>
  );
}
