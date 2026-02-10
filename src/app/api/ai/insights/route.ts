import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const recentMoods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, session.user.id))
      .orderBy(desc(moodEntries.date))
      .limit(30);

    if (recentMoods.length === 0) {
      return NextResponse.json(
        { insights: "Not enough data yet. Log a few mood entries first, then come back for insights!" },
        { status: 200 }
      );
    }

    const moodSummary = recentMoods
      .map(
        (m) =>
          `${new Date(m.date).toLocaleDateString()}: mood=${m.moodScore}/10, energy=${m.energy}/10, anxiety=${m.anxiety}/10, irritability=${m.irritability}/10, sleep=${m.sleepHours}h (quality ${m.sleepQuality}/5)${m.notes ? `, notes: "${m.notes}"` : ""}`
      )
      .join("\n");

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a compassionate AI wellness assistant helping someone with bipolar disorder understand their mood patterns. Analyze the following mood data and provide helpful, non-clinical insights.

Focus on:
1. Overall mood trends (improving, declining, stable, cycling)
2. Patterns between sleep and mood
3. Energy and anxiety correlations
4. Gentle, actionable suggestions

Important: You are NOT a doctor. Frame everything as observations and gentle suggestions, not medical advice. Keep the tone warm and supportive.

Mood data (most recent first):
${moodSummary}

Provide your analysis in 3-4 short paragraphs.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const insights = textBlock ? textBlock.text : "Unable to generate insights at this time.";

    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
