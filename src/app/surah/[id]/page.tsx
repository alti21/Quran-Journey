"use client";

import { useEffect, useState} from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import SurahHeader from "@/app/components/surah/SurahHeader";
import Bismillah from "@/app/components/surah/Bismillah";
import Verse from "@/app/components/surah/Verse";
import NavButton from "@/app/components/utils/NavButton";
import Error from "@/app/components/utils/Error";
import loadQCFPageFont from "@/app/utils/loadQCFPageFont";
import LoadingScreen from "@/app/components/utils/LoadingScreen";
import type { Surah, Glyph, Translation } from "@/types/quran";


export default function SurahPage() {
  const { id } = useParams();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [translation, setTranslation] = useState<Translation[]>([]);
  const [fontMap, setFontMap] = useState<Record<number, string>>({});
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
      } 
    }

    fetchSurah();
  }, [id]);

  useEffect(() => {
    if (glyphs.length === 0) return;

    async function loadFonts() {
      const map: Record<number, string> = {};
      const pageNumbers = [...new Set(glyphs.map(v => v.v1_page))];

      // Wait for all fonts to load
      await Promise.all(
        pageNumbers.map(async (page) => {
          const fontName = await loadQCFPageFont(page);
          map[page] = fontName;
        })
      );

      setFontMap(map);
      setLoading(false);
    }

    loadFonts();
  }, [glyphs]);

  if (error) return <Error error={error} />
  
  if (loading) return <LoadingScreen text="surah" />

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
              fontFamily={fontMap[glyph.v1_page]}
            />
          ))}
        </div>
      </div>
    </main>
  );
}