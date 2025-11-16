import axios from "axios";
import type { Surah } from "@/types/quran";
import { getAccessToken } from "@/lib/quranAuth";

/**
* Fetch Surah (chapter) details by ID
*/
export async function GET(req: Request) {
  const id = req.url.split("/").pop();

  if (!id) {
    return new Response("Missing surah ID", { status: 400 });
  }

  try {
    const access_token = await getAccessToken();

    const response = await axios.get<Surah>(
      `${process.env.API_BASE_URL}/chapters/${id}`,
      {
        headers: {
          "x-auth-token": access_token,
          "x-client-id": process.env.CLIENT_ID,
        },
      }
    );

    return Response.json(response.data);
  } catch (error: any) {
    console.error("Surah fetch error:", error.message);
    return new Response("Failed to fetch surah", { status: 500 });
  }
}