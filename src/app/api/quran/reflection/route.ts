import OpenAI from "openai";
import axios from "axios";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type VerseResponse = {
  verse: {
    verse_key: string;
    text_uthmani: string;
    translations?: { text: string }[];
  };
};

/**
* Fetch AI-generated reflection prompt using OpenAI API
*/
export async function GET() {
  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();

    const response = await axios.get<VerseResponse>(
      `${process.env.API_BASE_URL}/verses/random`,
      {
        params: { fields: "text_uthmani", translations: 85 },
        headers: {
          "x-auth-token": access_token,
          "x-client-id": process.env.CLIENT_ID,
        },
      }
    );

    const verse = response.data.verse;
    if (!verse) throw new Error("No verse returned from API");
    const verseText = verse.text_uthmani;
    const translation = verse.translations?.[0].text;

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

    return Response.json({
      verse_key: verse.verse_key,
      verseText,
      translation,
      reflectionPrompt,
    })
  } catch (error: any) {
    console.error("Reflection error:", error);
    return new Response("Failed to fetch chapters", { status: 500 });
  }
}