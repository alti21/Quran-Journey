type Props = {
  verse: string;
  translation: string;
  fontFamily: string | undefined;
};

function Verse({ verse, translation, fontFamily }: Props) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-none">
      <p
        dir="rtl"
        className="text-4xl md:text-5xl leading-relaxed text-emerald-900 font-arabic text-right"
        style={{ fontFamily }}
        aria-label="Quran verse in Arabic"
      >
        {verse}
      </p>
      <p 
        dir="ltr"
        className="text-2xl md:text-2xl leading-relaxed text-emerald-900"
        aria-label="Verse translation"
      >
        {translation}
      </p>
    </div>
  );
}

export default Verse;