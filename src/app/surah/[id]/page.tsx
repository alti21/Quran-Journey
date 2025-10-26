"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

type Surah = {
  id?: number;
  name_simple?: string;
  name_arabic?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
  bismillah_pre?: boolean;
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

export function loadQCFPageFont(page: number) {
  if (!page) return;

  const fontName = `p${page}-v1`;

  // Prevent adding duplicate font
  if (document.fonts && [...document.fonts].some(f => f.family === fontName)) return fontName;

  const fontUrl = `/fonts/p${page}.ttf`;
  const fontFace = new FontFace(fontName, `url(${fontUrl})`);

  fontFace.load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
      console.log(`✅ Loaded QCF font for page ${page}`);
    })
    .catch(err => {
      console.error(`❌ Failed to load QCF font ${fontUrl}:`, err);
    });

  return fontName;
}

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

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );

  if (!surah)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p className="animate-pulse text-emerald-700 text-lg">Loading surah…</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center px-6 py-10">
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">

        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/chapters"
            className="text-emerald-700 hover:text-emerald-900 transition-all font-medium"
          >
            ← Back to Chapters
          </Link>
        </div>

        {/* Surah Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-emerald-900 mb-2">
            {surah.name_simple}
          </h2>
          <h1 className="text-5xl md:text-6xl text-emerald-800 font-arabic mb-4">
            {surah.name_arabic}
          </h1>
          <p className="text-gray-600 italic">{surah.translated_name?.name}</p>
          <p className="text-sm text-gray-500 mt-2">
            Revelation:{" "}
            <span className="capitalize">{surah.revelation_place}</span> •{" "}
            Verses: {surah.verses_count}
          </p>
        </div>

        {/* Bismillah */}
        {id !== "1" && id !== "9" && (
          <div className="mb-10 flex justify-center">
            <p className="text-4xl md:text-5xl text-emerald-700 font-arabic text-center leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        {/* Verses */}
        <div className="space-y-8">
          {glyphs.map((glyph, index) => (
            <div
              key={glyph.id}
              className="border-b border-gray-100 pb-6 last:border-none"
            >
              <p
                className="text-4xl md:text-5xl leading-relaxed text-emerald-900 font-arabic text-right"
                style={{ fontFamily: loadQCFPageFont(glyph.v1_page ?? 2) }}
              >
                {glyph.code_v1}
              </p>
              <p className="text-2xl md:text-2xl leading-relaxed text-emerald-900">
                {translation[index]?.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        Crafted with ✨ by <span className="text-emerald-600">Quran Journey</span>
      </footer>
    </main>
  );
}
