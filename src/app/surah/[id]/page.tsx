"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function SurahPage() {
  const { id } = useParams();
  const [surah, setSurah] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurah() {
      try {
        const res = await axios.get(`/api/quran/surah/${id}`);
        setSurah(res.data.chapter || res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }
    fetchSurah();
  }, [id]);

  if (error) return <p className="text-red-600 p-4">Error: {error}</p>;
  if (!surah) return <p className="p-4">Loading surah...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <Link href="/chapters" className="text-blue-600 hover:underline">
        ← Back to Chapters
      </Link>
      <h1 className="text-4xl font-bold mb-2">{surah.name_simple}</h1>
      <h2 className="text-2xl mb-4">{surah.name_arabic}</h2>
      <p className="text-gray-600">{surah.translated_name?.name}</p>
      <p className="mt-2">
        Revelation: {surah.revelation_place} | Verses: {surah.verses_count}
      </p>
    </div>
  );
}





    