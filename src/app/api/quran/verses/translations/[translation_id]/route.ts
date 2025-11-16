import axios from "axios";
import type { Translation } from "@/types/quran";
import { getAccessToken } from "@/lib/quranAuth";

/**
* Fetch traslations for translation ID 85
*/
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterNumber = searchParams.get("chapter_number");

  if (!chapterNumber) {
    return new Response("Missing chapter_number query param", { status: 400 });
  }

  try {
    const access_token = await getAccessToken();

    const response = await axios.get<Translation[]>(
      `${process.env.API_BASE_URL}/quran/translations/85`,
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
    console.error("Translation fetch error:", error.message);
    return new Response("Failed to fetch translation", { status: 500 });
  }
}