import axios from "axios";

// Fetch Uthmani verses for a given chapter number
export async function GET(  request: Request, { params }: { params: { translation_id: string } }) {
  const { searchParams } = new URL(request.url);
  const chapter_number = searchParams.get("chapter_number");

  const { translation_id } = params;

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();


    const response = await axios({
      method: 'get',
      url: `${process.env.API_BASE_URL}/quran/translations/85`,
      params: {
        chapter_number
      },
      headers: {
        'Accept': 'application/json', 
        "x-auth-token": access_token,
        "x-client-id": process.env.CLIENT_ID,
      },
    });

    return Response.json(response.data);
  } catch (err: any) {
    console.error("Verses fetch error:", err.response?.data || err.message);
    return new Response("Failed to fetch Uthmani verses", { status: 500 });
  }
}
