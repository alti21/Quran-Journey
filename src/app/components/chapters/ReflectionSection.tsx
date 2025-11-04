type Props = {
  reflectionVerse: any;
  reflection: string;
  setReflection: (v: string) => void;
  onSave: () => void;
  onOpenModal: () => void;
  saved: boolean;
};

export default function ReflectionSection({
  reflectionVerse,
  reflection,
  setReflection,
  onSave,
  onOpenModal,
  saved
}: Props) {
  return (
    <section className="mb-10 text-center">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-4">
        🌙 Current Reflection
      </h2>

      <p className="text-4xl text-emerald-900 font-arabic mb-4">
        {reflectionVerse.verseText}
      </p>
      <p className="text-gray-700 italic mb-2">{reflectionVerse.translation}</p>
      <p className="text-sm text-emerald-700 mb-6">
        {reflectionVerse.verse_key} | {reflectionVerse.reflectionPrompt}
      </p>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write your reflection here..."
        className="w-full border border-emerald-200 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-emerald-400 outline-none text-gray-900 placeholder-gray-400 bg-white/90 shadow-sm"
        rows={3}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={onSave}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Save Reflection
        </button>

        <button
          onClick={onOpenModal}
          className="bg-white border border-emerald-300 text-emerald-700 px-6 py-2 rounded-lg hover:bg-emerald-50 transition"
        >
          📜 View Saved Reflections
        </button>
      </div>

      {saved && (
        <p className="text-emerald-700 text-center mt-3">
          🌸 Reflection saved!
        </p>
      )}
    </section>
  );
}