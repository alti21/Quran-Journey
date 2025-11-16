import axios from 'axios';
import type { Surah } from "@/types/quran";
import { getAccessToken } from "@/lib/quranAuth"; 

/**
* Fetch all surahs
*/
export async function GET() {
  try {
    const access_token = await getAccessToken();

    const response = await axios.get<Surah[]>(
      `${process.env.API_BASE_URL}/chapters`,
      {
        headers: {
            'x-auth-token': access_token,
            'x-client-id': process.env.CLIENT_ID,
        }
      }
    );

    return Response.json(response.data);
  } catch (error: any) {
    console.error("Chapters fetch error:", error.message);
    return new Response("Failed to fetch chapters", { status: 500 });
  }
}