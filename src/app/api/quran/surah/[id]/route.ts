import axios from "axios";
import type { Surah } from "@/types/quran";

/**
* Fetch Surah (chapter) details by ID
*/
export async function GET(req: Request) {
  //const { id } = context.params;
  const id = req.url.split("/").pop();
  console.log("id is", id);

  if (!id) {
    return new Response("Missing surah ID", { status: 400 });
  }

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get token");
    const { access_token } = await tokenRes.json();

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