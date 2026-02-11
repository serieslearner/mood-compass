import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDictionary, type Locale, type TranslationKey } from "@/lib/i18n";

const fallbackPromptKeys: TranslationKey[] = [
  "ai.journal.prompt1",
  "ai.journal.prompt2",
  "ai.journal.prompt3",
  "ai.journal.prompt4",
  "ai.journal.prompt5",
  "ai.journal.prompt6",
  "ai.journal.prompt7",
  "ai.journal.prompt8",
  "ai.journal.prompt9",
  "ai.journal.prompt10",
];

function pickFallbackPrompt(locale: Locale): string {
  const t = getDictionary(locale);
  const key = fallbackPromptKeys[Math.floor(Math.random() * fallbackPromptKeys.length)];
  return t[key];
}

export async function POST(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get("locale") === "en" ? "en" : "ko") as Locale;

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

        const langInstruction = locale === "ko"
          ? "반드시 한국어로 답변해 주세요. 한국 문화에 적합한 표현을 사용하세요."
          : "Please respond in English.";

        const result = await model.generateContent(
          `You are a compassionate journaling assistant for someone managing bipolar disorder. Generate a single thoughtful journaling prompt based on their recent mood data. The prompt should encourage self-reflection without being clinical. Keep it to 1-2 sentences.

${langInstruction}

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
    return NextResponse.json({ prompt: pickFallbackPrompt(locale) });
  } catch {
    return NextResponse.json(
      { prompt: pickFallbackPrompt(locale) },
      { status: 200 }
    );
  }
}
