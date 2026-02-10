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
        { prompt: "What are three things you're grateful for today, and why do they matter to you?" },
        { status: 200 }
      );
    }

    // Fetch recent mood data for context
    const recentMoods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, session.user.id))
      .orderBy(desc(moodEntries.date))
      .limit(5);

    const moodContext =
      recentMoods.length > 0
        ? `Recent mood data: ${recentMoods
            .map(
              (m) =>
                `mood=${m.moodScore}/10, energy=${m.energy}/10, anxiety=${m.anxiety}/10`
            )
            .join("; ")}`
        : "No recent mood data available.";

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `You are a compassionate journaling assistant for someone managing bipolar disorder. Generate a single thoughtful journaling prompt based on their recent mood data. The prompt should encourage self-reflection without being clinical. Keep it to 1-2 sentences.

${moodContext}

Respond with just the journaling prompt, nothing else.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const prompt = textBlock ? textBlock.text : "What moment today made you pause and feel something?";

    return NextResponse.json({ prompt });
  } catch {
    return NextResponse.json(
      { prompt: "Describe a moment today when you felt most like yourself." },
      { status: 200 }
    );
  }
}
