import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fallbackPrompts = [
  "What are three things you're grateful for today, and why do they matter to you?",
  "Describe a moment today when you felt most like yourself.",
  "What is one small thing you did today that took courage?",
  "Write about a person who made you feel safe or understood recently.",
  "What would you tell a friend who was feeling the way you feel right now?",
  "Describe your energy today as a weather pattern. What does the forecast look like?",
  "What is one boundary you set or wish you had set today?",
  "Write about something you're looking forward to, no matter how small.",
  "What did your body need today that you did or didn't give it?",
  "If your mood today had a color and a texture, what would they be?",
];

function pickFallbackPrompt(): string {
  return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch recent mood data for context
    const recentMoods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, session.user.id))
      .orderBy(desc(moodEntries.date))
      .limit(5);

    // Try AI-powered prompt
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const moodContext =
          recentMoods.length > 0
            ? `Recent mood data: ${recentMoods
                .map(
                  (m) =>
                    `mood=${m.moodScore}/10, energy=${m.energy}/10, anxiety=${m.anxiety}/10`
                )
                .join("; ")}`
            : "No recent mood data available.";

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const result = await model.generateContent(
          `You are a compassionate journaling assistant for someone managing bipolar disorder. Generate a single thoughtful journaling prompt based on their recent mood data. The prompt should encourage self-reflection without being clinical. Keep it to 1-2 sentences.

${moodContext}

Respond with just the journaling prompt, nothing else.`
        );

        const prompt = result.response.text();
        if (prompt) {
          return NextResponse.json({ prompt });
        }
      } catch (e) {
        console.error("Gemini API error, using fallback prompt:", e);
      }
    }

    // Fallback: curated prompts
    return NextResponse.json({ prompt: pickFallbackPrompt() });
  } catch {
    return NextResponse.json(
      { prompt: pickFallbackPrompt() },
      { status: 200 }
    );
  }
}
