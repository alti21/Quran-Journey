"use client";

export default function Bismillah({ surahId }: { surahId?: string }) {
  if (surahId === "1" || surahId === "9") return null;

  return (
    <div className="mb-10 flex justify-center">
      <p className="text-4xl md:text-5xl text-emerald-700 font-arabic text-center leading-relaxed">
        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </p>
    </div>
  );
}