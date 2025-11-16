import axios from "axios";
import { TokenResponse } from "@/types/quran";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken() {
  const now = Date.now();

  // get token if it already exists and isn't expired
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  // Otherwise fetch a new token
  const { OAUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  if (!OAUTH_BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing OAuth environment variables");
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await axios.post<TokenResponse>(
    `${OAUTH_BASE_URL}/oauth2/token`,
    "grant_type=client_credentials&scope=content",
    {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const token = response.data.access_token;
  const expiresIn = response.data.expires_in;

  // Cache the token in memory
  cachedToken = token;
  tokenExpiry = now + expiresIn * 1000;

  return token;
}