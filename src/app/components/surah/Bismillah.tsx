function Bismillah({ surahId }: { surahId: string }) {
  // Surah Al-Fatiha already has "Bismillah", and Surah At-Tawbah is not supposed to have "Bismillah"
  if (surahId === "1" || surahId === "9") return null;

  return (
    <div className="mb-10 flex justify-center" aria-hidden="true">
      <span className="text-4xl md:text-5xl text-emerald-700 font-arabic leading-relaxed text-center">
        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </span>
    </div>
  );
}

export default Bismillah;