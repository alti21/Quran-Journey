"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Chapter = {
  id?: number;
  name_simple?: string;
  name_arabic?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await axios.get("/api/quran/chapters");
        setChapters(response.data.chapters || []);
      } catch (error: any) {
        console.error(error);
        setError(error.response?.data?.error || error.message || "Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p className="animate-pulse text-emerald-700 text-lg">Loading chapters…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">
        <h1 className="text-4xl font-semibold text-emerald-900 mb-8 text-center">
          📖 Quran Chapters
        </h1>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapters.map((ch) => (
            <li
              key={ch.id}
              className="group bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <Link href={`/surah/${ch.id}`} className="block p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-emerald-900 text-xl font-semibold">
                    {ch.name_simple}
                  </span>
                  <span className="text-emerald-600 text-lg font-arabic">
                    {ch.name_arabic}
                  </span>
                </div>

                <p className="text-gray-600 text-sm italic mb-2">
                  {ch.translated_name?.name}
                </p>

                <div className="text-xs text-gray-500 flex justify-between">
                  <span className="capitalize">{ch.revelation_place}</span>
                  <span>{ch.verses_count} verses</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        Crafted with ✨ by <span className="text-emerald-600">Quran Journey</span>
      </footer>
    </main>
  );
}