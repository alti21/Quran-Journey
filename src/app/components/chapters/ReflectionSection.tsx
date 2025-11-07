import React, { memo } from "react";

type ReflectionVerse = {
  verse_key: string;
  verseText: string;
  translation: string;
  reflectionPrompt: string;
};

type Props = {
  reflectionVerse: ReflectionVerse;
  reflection: string;
  setReflection: (v: string) => void;
  onSave: () => void;
  onOpenModal: () => void;
  saved: boolean;
};

function ReflectionSection({
  reflectionVerse,
  reflection,
  setReflection,
  onSave,
  onOpenModal,
  saved
}: Props) {
  const isDisabled = reflection.trim().length === 0;

  return (
    <section className="mb-10 text-center animate-fadeIn">
      <h2 className="text-3xl font-semibold text-emerald-900 mb-6 tracking-tight">
        🌙 Current Reflection
      </h2>

      <blockquote className="mb-4">
        <p className="text-4xl md:text-5xl text-emerald-900 font-arabic leading-relaxed mb-4">
          {reflectionVerse.verseText}
        </p>
        <p className="text-gray-700 italic mb-2 text-lg">
          {reflectionVerse.translation}
        </p>
        <p className="text-sm text-emerald-700 mb-4 tracking-wide font-medium">
          {reflectionVerse.verse_key} | {reflectionVerse.reflectionPrompt}
        </p>
      </blockquote>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write your reflection here..."
        className="w-full border border-emerald-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-emerald-400 outline-none text-gray-900 placeholder-gray-400 bg-white/90 shadow-sm transition"
        rows={4}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onSave}
          disabled={isDisabled}
          className={`px-6 py-2 rounded-lg text-white transition font-medium
            ${isDisabled 
              ? "bg-emerald-300 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-sm"}`}
        >
          ✅ Save Reflection
        </button>

        <button
          onClick={onOpenModal}
          className="bg-white border border-emerald-300 text-emerald-700 px-6 py-2 rounded-lg hover:bg-emerald-50 transition"
        >
          📜 View Saved Reflections
        </button>
      </div>

      {saved && (
        <p className="text-emerald-700 text-center mt-3 animate-fadeIn">
          🌸 Reflection saved!
        </p>
      )}
    </section>
  )
};

export default memo(ReflectionSection);