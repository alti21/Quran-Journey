import axios from "axios";
import { TokenResponse } from "@/types/quran";

/**
* Fetch oauth token
*/
export async function GET() {
  try {
    const { OAUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

    if (!OAUTH_BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
      console.error("[Token API] Missing required environment variables");
      return new Response("Missing environment variables", { status: 500 });
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const response = await axios.post<TokenResponse>(
      `${OAUTH_BASE_URL}/oauth2/token`,
      'grant_type=client_credentials&scope=content',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      throw new Error("OAuth server did not return access token");
    }

    return Response.json({ access_token: accessToken });
  } catch (error: any) {
    console.error("Token route error:", error.message);
    return new Response("Failed to fetch access token", { status: 500 });
  }
}