import axios from 'axios';

/**
* Fetches Surahs (chapters) using the Quran API with an access token and the client ID.
*/
export async function GET() {

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    const { access_token } = await tokenRes.json();

    const response = await axios({
        method: 'get',
        url: `${process.env.API_BASE_URL}/chapters`,
        headers: {
            'x-auth-token': access_token,
            'x-client-id': process.env.CLIENT_ID,
        }
    });

    return Response.json(response.data);
  } catch (err) {
    console.error("Chapters fetch error:", err.response?.data || err.message);
    return new Response("Failed to fetch chapters", { status: 500 });
  }
}
