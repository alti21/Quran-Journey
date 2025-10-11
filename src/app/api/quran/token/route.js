import axios from "axios";

export async function GET() {
  try {
    const { OAUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

    if (!OAUTH_BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
      return new Response("Missing environment variables", { status: 500 });
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const response = await axios({
        method: 'post',
        url: `${OAUTH_BASE_URL}/oauth2/token`,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials&scope=content'
    });

    const token = response.data.access_token;
    return Response.json({ access_token: token });
  } catch (err) {
    console.error("Token route error:", err.response?.data || err.message);
    return new Response("Failed to fetch token", { status: 500 });
  }
}


