import SurahCard from "./SurahCard";

export default function SurahGrid({ chapters }: { chapters: any[] }) {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {chapters.map((surah) => (
        <SurahCard
          key={surah.id}
          id={surah.id}
          name_simple={surah.name_simple}
          name_arabic={surah.name_arabic}
          translated_name={surah.translated_name?.name}
          revelation_place={surah.revelation_place}
          verses_count={surah.verses_count}
        />
      ))}
    </ul>
  );
}