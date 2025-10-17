import axios from "axios";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get token");
    const { access_token } = await tokenRes.json();

    const response = await axios({
        method: 'get',
        url: `${process.env.API_BASE_URL}/chapters/${params.id}`,
        headers: {
            'x-auth-token': access_token,
            'x-client-id': process.env.CLIENT_ID,
        }
    });

    return Response.json(response.data);
  } catch (err: any) {
    console.error("Surah fetch error:", err.response?.data || err.message);
    return new Response("Failed to fetch surah", { status: 500 });
  }
}