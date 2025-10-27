import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();

    // Get random verse
    const res = await axios.get(`${process.env.API_BASE_URL}/verses/random?fields=text_uthmani&translations=85`, {
      headers: {
        "x-auth-token": access_token,
        "x-client-id": process.env.CLIENT_ID,
        Accept: "application/json",
      },
    });

    const verse = res.data.verse;
    const verseText = verse.text_uthmani;
    const translation = verse.translations?.[0]?.text;
    console.log("Fetched Verse:", verse.verse_key, verseText, translation);

    // AI generates reflection prompt
    const prompt = `
      You are a gentle Qur’an reflection companion.
      Given this verse, create a one-sentence reflection question
      that encourages mindfulness and self-awareness.

      Verse: ${translation || verseText}`;

    const aiRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reflectionPrompt = aiRes.choices[0].message?.content?.trim();

    return NextResponse.json({
      verse_key: verse.verse_key,
      verseText,
      translation,
      reflectionPrompt,
    });
  } catch (err) {
    console.error("Reflection error:", err);
    return NextResponse.json({ error: "Failed to fetch verse" }, { status: 500 });
  }
}