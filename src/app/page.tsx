"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from "axios";

type Chapter = {
  id?: number;
  name_simple?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
  [key: string]: any; // safe fallback for extra fields
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

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

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading chapters…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Quran Journey — Chapters</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chapters.map(ch => (
          <li key={ch.id} className="border p-3 rounded">
            <Link href={`/surah/${ch.id}`} className="block hover:bg-gray-50 rounded-lg p-3 transition">
              <div className="text-lg font-semibold">
                {ch.name_simple} — {ch.translated_name?.name}
              </div>
              <div className="text-sm text-gray-600">
                {ch.verses_count} ayahs • {ch.revelation_place}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}