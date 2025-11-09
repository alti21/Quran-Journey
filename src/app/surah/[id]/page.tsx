"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import SurahHeader from "@/app/components/surah/SurahHeader";
import Bismillah from "@/app/components/surah/Bismillah";
import Verse from "@/app/components/surah/Verse";
import NavButton from "@/app/components/utils/NavButton";
import Error from "@/app/components/utils/Error";
import loadQCFPageFont from "@/app/utils/loadQCFPageFont";

type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  translated_name: { name: string };
}

type Glyph = {
  id: number;
  verse_key: string;
  code_v1: string;
  v1_page: number;
};

type Translation = {
  resource_id: number;
  text: string;
};

export default function SurahPage() {
  const { id } = useParams();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [translation, setTranslation] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurah() {
      if (!id) return;

      try {
        const [surahRes, glyphsRes, translationRes] = await Promise.all([
          axios.get(`/api/quran/surah/${id}`),
          axios.get(`/api/quran/verses/code_v1`, { params: { chapter_number: id } }),
          axios.get(`/api/quran/verses/translations/85`, { params: { chapter_number: id } }),
        ]);

        setSurah(surahRes.data.chapter);
        setGlyphs(glyphsRes.data.verses);
        setTranslation(translationRes.data.translations);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSurah();
  }, [id]);

  if (error) return <Error error={error} />
  
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p className="animate-pulse text-emerald-700 text-lg">Loading surah…</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center px-6 py-10">
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">
        
        <NavButton href="/chapters">← Back to Chapters</NavButton>

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