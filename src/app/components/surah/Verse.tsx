"use client";

type Props = {
  verse?: string;
  translation?: string;
  fontFamily?: string;
};

export default function Verse({ verse, translation, fontFamily }: Props) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-none">
      <p
        className="text-4xl md:text-5xl leading-relaxed text-emerald-900 font-arabic text-right"
        style={{ fontFamily }}
      >
        {verse}
      </p>
      <p className="text-2xl md:text-2xl leading-relaxed text-emerald-900">
        {translation}
      </p>
    </div>
  );
}