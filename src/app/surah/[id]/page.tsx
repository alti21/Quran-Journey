"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

type Verse = {
  id?: number;
  verse_key?: string;
  text_uthmani?: string;
};

type Glyph = {
  id?: number;
  verse_key?: string;
  code_v1?: string;
  v1_page?: number;
}

// utils/useQCF.ts
export function loadQCFPageFont(page: number) {
  if (!page) return;

  const fontName = `p${page}-v1`;
  //Prevent adding the same font twice
  if (document.fonts && [...document.fonts].some(f => f.family === fontName)) {
    return fontName;
  }

  const fontUrl = `/fonts/p${page}.ttf`;
  const fontFace = new FontFace(fontName, `url(${fontUrl})`);

  fontFace.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    console.log(`✅ Loaded QCF font for page ${page}`);
  }).catch(err => {
    console.error(`❌ Failed to load QCF font ${fontUrl}:`, err);
  });

  return fontName;
}

export default function SurahPage() {
  const { id } = useParams();
  const [surah, setSurah] = useState<any>(null);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurah() {
      try {
        const res = await axios.get(`/api/quran/surah/${id}`);
        setSurah(res.data.chapter);
        const versesRes = await axios.get(`/api/quran/verses/uthmani?chapter_number=${id}`);
        const glyphsRes = await axios.get(`/api/quran/verses/code_v1?chapter_number=${id}`);
        setGlyphs(glyphsRes.data.verses);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }
    fetchSurah();
  }, [id]);
  

  if (error) return <p className="text-red-600 p-4">Error: {error}</p>;
  if (!surah) return <p className="p-4 animate-pulse text-gray-600">Loading surah...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-emerald-50 to-white text-center px-6 py-10">
      <div className="max-w-3xl w-full bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-emerald-100">
        {/* Navigation */}
        <div className="mb-6 text-left">
          <Link
            href="/chapters"
            className="text-emerald-700 hover:text-emerald-900 transition-all font-medium"
          >
            ← Back to Chapters
          </Link>
        </div>

        {/* Surah Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-emerald-800 mb-2 tracking-wide">
            {surah.name_simple}
          </h2>
          <h1 className="text-5xl md:text-6xl text-emerald-900 font-arabic mb-4">
            {surah.name_arabic}
          </h1>
          <p className="text-gray-600 italic">
            {surah.translated_name?.name}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Revelation: <span className="capitalize">{surah.revelation_place}</span> •{" "}
            Verses: {surah.verses_count}
          </p>
        </div>

        {/* Bismillah (if not Surah 1 or 9) */}
        {id !== "1" && id !== "9" && (
          <div className="text-3xl text-emerald-700 font-arabic mb-10">
            بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </div>
        )}

        {/* Verses */}
        <div className="space-y-8 text-right">
          {glyphs.map((glyph) => {
            return (
            <div
              key={glyph.id}
              className="border-b border-gray-100 pb-6 last:border-none"
            >
              <p className="qcf text-4xl md:text-5xl leading-relaxed text-emerald-900 font-arabic"
               style={{ fontFamily: loadQCFPageFont(glyph.v1_page??2) }}
              >
                {glyph.code_v1}
                
              </p>
              {glyph.v1_page}
            </div>
         ) })}
        </div>
      </div>
    </div>
  );
}