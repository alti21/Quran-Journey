import axios from "axios";
import type { Glyph } from "@/types/quran";

/**
* Fetch v1 Glyphs for a given chapter number
*/
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterNumber = searchParams.get("chapter_number");

  if (!chapterNumber) {
    return new Response("Missing ?chapter_number parameter", { status: 400 });
  }

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();

    const response = await axios.get<Glyph[]>(
      `${process.env.API_BASE_URL}/quran/verses/code_v1`,
      {
        params: { chapter_number: chapterNumber },
        headers: {
          "x-auth-token": access_token,
          "x-client-id": process.env.CLIENT_ID,
        },
      }
    );

    return Response.json(response.data);
  } catch (error: any) {
    console.error("Glyphs fetch error:", error.message);
    return new Response("Failed to fetch v1 Glyphs", { status: 500 });
  }
}