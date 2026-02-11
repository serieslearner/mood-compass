import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDictionary, type Locale } from "@/lib/i18n";

function generateBasicInsights(
  moods: { moodScore: number; energy: number; anxiety: number; irritability: number; sleepHours: number; sleepQuality: number }[],
  locale: Locale
) {
  const t = getDictionary(locale);
  const avgMood = moods.reduce((s, m) => s + m.moodScore, 0) / moods.length;
  const avgEnergy = moods.reduce((s, m) => s + m.energy, 0) / moods.length;
  const avgAnxiety = moods.reduce((s, m) => s + m.anxiety, 0) / moods.length;
  const avgSleep = moods.reduce((s, m) => s + m.sleepHours, 0) / moods.length;

  const lines: string[] = [];

  const moodComment = avgMood >= 6
    ? t["ai.insights.avgMoodHigh"]
    : avgMood >= 4
    ? t["ai.insights.avgMoodMid"]
    : t["ai.insights.avgMoodLow"];

  if (locale === "ko") {
    lines.push(
      `최근 ${moods.length}개의 기록을 기반으로, 평균 기분은 ${avgMood.toFixed(1)}/10이고 평균 에너지는 ${avgEnergy.toFixed(1)}/10입니다. ${moodComment}`
    );
  } else {
    lines.push(
      `Based on your ${moods.length} recent entries, your average mood is ${avgMood.toFixed(1)}/10 with average energy at ${avgEnergy.toFixed(1)}/10. ${moodComment}`
    );
  }

  const sleepComment = avgSleep < 6
    ? t["ai.insights.sleepLow"]
    : avgSleep > 9
    ? t["ai.insights.sleepHigh"]
    : t["ai.insights.sleepNormal"];

  if (locale === "ko") {
    lines.push(`평균 수면 시간은 ${avgSleep.toFixed(1)}시간입니다. ${sleepComment}`);
  } else {
    lines.push(`You're averaging ${avgSleep.toFixed(1)} hours of sleep. ${sleepComment}`);
  }

  const anxietyComment = avgAnxiety >= 7
    ? t["ai.insights.anxietyHigh"]
    : avgAnxiety >= 4
    ? t["ai.insights.anxietyMid"]
    : t["ai.insights.anxietyLow"];

  if (locale === "ko") {
    lines.push(`평균 불안 수준은 ${avgAnxiety.toFixed(1)}/10입니다. ${anxietyComment}`);
  } else {
    lines.push(`Your average anxiety level is ${avgAnxiety.toFixed(1)}/10. ${anxietyComment}`);
  }

  lines.push(t["ai.insights.disclaimer"]);

  return lines.join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locale = (request.nextUrl.searchParams.get("locale") === "en" ? "en" : "ko") as Locale;
    const t = getDictionary(locale);

    const recentMoods = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, session.user.id))
      .orderBy(desc(moodEntries.date))
      .limit(30);

    if (recentMoods.length === 0) {
      return NextResponse.json(
        { insights: t["ai.insights.noData"] },
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

        const langInstruction = locale === "ko"
          ? "반드시 한국어로 답변해 주세요. 한국 문화에 적합한 표현을 사용하세요."
          : "Please respond in English.";

        const result = await model.generateContent(
          `You are a compassionate AI wellness assistant helping someone with bipolar disorder understand their mood patterns. Analyze the following mood data and provide helpful, non-clinical insights.

Focus on:
1. Overall mood trends (improving, declining, stable, cycling)
2. Patterns between sleep and mood
3. Energy and anxiety correlations
4. Gentle, actionable suggestions

Important: You are NOT a doctor. Frame everything as observations and gentle suggestions, not medical advice. Keep the tone warm and supportive.

${langInstruction}

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
    const insights = generateBasicInsights(recentMoods, locale);
    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
