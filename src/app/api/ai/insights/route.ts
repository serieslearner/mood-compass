import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

function generateBasicInsights(
  moods: { moodScore: number; energy: number; anxiety: number; irritability: number; sleepHours: number; sleepQuality: number }[]
) {
  const avgMood = moods.reduce((s, m) => s + m.moodScore, 0) / moods.length;
  const avgEnergy = moods.reduce((s, m) => s + m.energy, 0) / moods.length;
  const avgAnxiety = moods.reduce((s, m) => s + m.anxiety, 0) / moods.length;
  const avgSleep = moods.reduce((s, m) => s + m.sleepHours, 0) / moods.length;

  const lines: string[] = [];

  lines.push(
    `Based on your ${moods.length} recent entries, your average mood is ${avgMood.toFixed(1)}/10 with average energy at ${avgEnergy.toFixed(1)}/10. ${avgMood >= 6 ? "Things seem to be going relatively well overall." : avgMood >= 4 ? "Your mood has been in a moderate range." : "Your mood has been on the lower side — be gentle with yourself."}`
  );

  lines.push(
    `You're averaging ${avgSleep.toFixed(1)} hours of sleep. ${avgSleep < 6 ? "That's below the recommended range — improving sleep could have a positive effect on your mood and energy." : avgSleep > 9 ? "That's on the higher side, which can sometimes be associated with low energy periods." : "That's within a healthy range, which is great for mood stability."}`
  );

  lines.push(
    `Your average anxiety level is ${avgAnxiety.toFixed(1)}/10. ${avgAnxiety >= 7 ? "Anxiety has been quite high — consider discussing coping strategies with your care team." : avgAnxiety >= 4 ? "Some moderate anxiety is present — mindfulness or breathing exercises might help." : "Anxiety levels look manageable, which is a positive sign."}`
  );

  lines.push(
    "Remember: these are simple observations based on your self-reported data, not medical advice. Share these patterns with your healthcare provider for personalized guidance."
  );

  return lines.join("\n\n");
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Try AI-powered insights
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const moodSummary = recentMoods
          .map(
            (m) =>
              `${new Date(m.date).toLocaleDateString()}: mood=${m.moodScore}/10, energy=${m.energy}/10, anxiety=${m.anxiety}/10, irritability=${m.irritability}/10, sleep=${m.sleepHours}h (quality ${m.sleepQuality}/5)${m.notes ? `, notes: "${m.notes}"` : ""}`
          )
          .join("\n");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const result = await model.generateContent(
          `You are a compassionate AI wellness assistant helping someone with bipolar disorder understand their mood patterns. Analyze the following mood data and provide helpful, non-clinical insights.

Focus on:
1. Overall mood trends (improving, declining, stable, cycling)
2. Patterns between sleep and mood
3. Energy and anxiety correlations
4. Gentle, actionable suggestions

Important: You are NOT a doctor. Frame everything as observations and gentle suggestions, not medical advice. Keep the tone warm and supportive.

Mood data (most recent first):
${moodSummary}

Provide your analysis in 3-4 short paragraphs.`
        );

        const insights = result.response.text();
        if (insights) {
          return NextResponse.json({ insights });
        }
      } catch (e) {
        console.error("Gemini API error, falling back to basic insights:", e);
      }
    }

    // Fallback: basic statistical insights
    const insights = generateBasicInsights(recentMoods);
    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
