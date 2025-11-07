import React, { memo } from "react";
import Link from "next/link";

type Props = {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: string;
  revelation_place: string;
  verses_count: number;
};

function SurahCard({
  id,
  name_simple,
  name_arabic,
  translated_name,
  revelation_place,
  verses_count
}: Props) {
  return (
    <li className="group bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
      <Link href={`/surah/${id}`} 
        className="block p-5"
        aria-label={`Open Surah ${name_simple}`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-emerald-900 text-xl font-semibold">
            {name_simple}
          </span>
          <span className="text-emerald-600 text-lg font-arabic">
            {name_arabic}
          </span>
        </div>

        <p className="text-gray-600 text-sm italic mb-2">
          {translated_name}
        </p>

        <div className="text-xs text-gray-500 flex justify-between">
          <span className="capitalize">{revelation_place}</span>
          <span>{verses_count} verses</span>
        </div>
      </Link>
    </li>
  );
}

export default memo(SurahCard);