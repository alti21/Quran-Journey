import axios from 'axios';

export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  translated_name: { name: string };
};

type ChaptersResponse = {
  chapters: Chapter[];
};

/**
* Fetch all surahs
*/
export async function GET() {
  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();

    const response = await axios.get<ChaptersResponse>(
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