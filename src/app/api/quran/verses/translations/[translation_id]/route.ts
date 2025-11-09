import axios from "axios";

type Translation = {
  resource_id: number;
  text: string;
};

type TranslationResponse = {
  translations: Translation[];
}

/**
* Fetch traslations for translation ID 85
*/
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterNumber = searchParams.get("chapter_number");

  if (!chapterNumber) {
    return new Response("Missing chapter_number query param", { status: 400 });
  }

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/quran/token`);
    if (!tokenRes.ok) throw new Error("Failed to get access token");
    
    const { access_token } = await tokenRes.json();

    const response = await axios.get<TranslationResponse>(
      `${process.env.API_BASE_URL}/quran/translations/85`,
      {
        params: { chapter_number: chapterNumber },
        headers: {
          "x-auth-token": access_token,
          "x-client-id": process.env.CLIENT_ID,
        },
      }
    );

    return Response.json(response.data);
  } catch (error: any) {
    console.error("Translation fetch error:", error.message);
    return new Response("Failed to fetch translation", { status: 500 });
  }
}