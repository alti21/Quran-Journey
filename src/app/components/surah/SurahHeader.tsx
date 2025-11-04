"use client";

type Surah = {
  id?: number;
  name_simple?: string;
  name_arabic?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
};

export default function SurahHeader({ surah }: { surah: Surah }) {
  if (!surah) return null;

  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-semibold text-emerald-900 mb-2">
        {surah.name_simple}
      </h2>

      <h1 className="text-5xl md:text-6xl text-emerald-800 font-arabic mb-4">
        {surah.name_arabic}
      </h1>

      <p className="text-gray-600 italic">
        {surah.translated_name?.name}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Revelation:{" "}
        <span className="capitalize">{surah.revelation_place}</span> •{" "}
        Verses: {surah.verses_count}
      </p>
    </div>
  );
}