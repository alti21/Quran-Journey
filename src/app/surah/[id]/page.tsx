"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import loadQCFPageFont from "@/app/utils/loadQCFPageFont";
import SurahHeader from "@/app/components/surah/SurahHeader";
import Bismillah from "@/app/components/surah/Bismillah";
import Verse from "@/app/components/surah/Verse";
import NavButton from "@/app/components/utils/NavButton";
import Error from "@/app/components/utils/Error";

type Surah = {
  id?: number;
  name_simple?: string;
  name_arabic?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
}

type Glyph = {
  id?: number;
  verse_key?: string;
  code_v1?: string;
  v1_page?: number;
};

type Reflection = {
  resource_id: number;
  text: string;
};

export default function SurahPage() {
  const { id } = useParams();
  const [surah, setSurah] = useState<Surah>({});
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [translation, setTranslation] = useState<Reflection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurah() {
      try {
        const res = await axios.get(`/api/quran/surah/${id}`);
        setSurah(res.data.chapter);
        const glyphsRes = await axios.get(`/api/quran/verses/code_v1?chapter_number=${id}`);
        setGlyphs(glyphsRes.data.verses);
        const translationRes = await axios.get(`/api/quran/verses/translations/85?chapter_number=${id}`);
        setTranslation(translationRes.data.translations);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }
    fetchSurah();
  }, [id]);

  if (!surah || glyphs.length === 0 || translation.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p className="animate-pulse text-emerald-700 text-lg">Loading surah…</p>
      </div>
    );

  if (error)
    <Error error={error} />;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center px-6 py-10">
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">
        
        <NavButton href="/chapters">
          ← Back to Chapters
        </NavButton>

        <SurahHeader surah={surah} />

        <Bismillah surahId={id as string} />

        <div className="space-y-8">
          {glyphs.map((glyph, index) => (
            <Verse 
              key={glyph.id}
              verse={glyph.code_v1} 
              translation={translation[index]?.text} 
              fontFamily={loadQCFPageFont(glyph.v1_page)} 
            />
          ))}
        </div>
      </div>

    </main>
  );
}
