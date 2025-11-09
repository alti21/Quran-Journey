import axios from "axios";

type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  translated_name: { name: string };
};

/**
* Fetch Surah (chapter) details by ID
*/
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response("Missing surah ID", { status: 400 });
  }

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get token");
    const { access_token } = await tokenRes.json();

    const response = await axios.get<Chapter>(
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