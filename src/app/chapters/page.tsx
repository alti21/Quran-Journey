"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type Chapter = {
  id?: number;
  name_simple?: string;
  name_arabic?: string;
  revelation_place?: string;
  verses_count?: number;
  translated_name?: { name: string } | null;
};

type ReflectionVerse = {
  verse_key?: string;
  verseText?: string;
  translation?: string;
  reflectionPrompt?: string;
};

type SavedReflection = {
  date: string;
  verseKey: string;
  verse: string;
  userReflection: string;
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [reflectionVerse, setReflectionVerse] = useState<ReflectionVerse | null>(null);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([]);

  const handleDeleteReflection = (index: number) => {
    if (!window.confirm("Are you sure you want to delete this reflection?")) return;
    const updated = [...savedReflections];
    updated.splice(index, 1);
    localStorage.setItem("reflections", JSON.stringify(updated));
    setSavedReflections(updated);
  };

  // Fetch surahs and reflection
  useEffect(() => {
    async function fetchData() {
      try {
        const [chaptersRes, verseRes] = await Promise.all([
          axios.get("/api/quran/chapters"),
          axios.get("/api/quran/reflection"),
        ]);
        setChapters(chaptersRes.data.chapters || []);
        setReflectionVerse(verseRes.data);
      } catch (error: any) {
        console.error(error);
        setError(
          error.response?.data?.error || error.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Load reflections from localStorage
    const stored = JSON.parse(localStorage.getItem("reflections") || "[]");
    setSavedReflections(stored);
  }, []);

  const handleSave = () => {
    if (!reflectionVerse) return;

    const newReflection = {
      date: new Date().toISOString(),
      verseKey: reflectionVerse.verse_key || "Unknown",
      verse: reflectionVerse.translation || "",
      userReflection: reflection,
    };

    const updated = [...savedReflections, newReflection];
    localStorage.setItem("reflections", JSON.stringify(updated));
    setSavedReflections(updated);
    setSaved(true);
    setReflection("");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p className="animate-pulse text-emerald-700 text-lg">Loading chapters…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10 flex flex-col items-center">
      {/* 🌿 Quran Journey App Title */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-emerald-800 mb-3">
          Quran Journey
        </h1>
        <p className="text-emerald-600 text-lg italic">
          Reflect ✨ | Read 📖 | Grow 🌙
        </p>
      </header>

      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">
        {/* 🌙 Reflection Journal Section */}
        {reflectionVerse && (
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
              className="w-full border border-emerald-200 rounded-lg p-3 mb-4 
                        focus:ring-2 focus:ring-emerald-400 outline-none 
                        text-gray-900 placeholder-gray-400 bg-white/90 shadow-sm"
              rows={3}
            />

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Save Reflection
              </button>

              <button
                onClick={() => setShowModal(true)}
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
        )}

        <hr className="my-10 border-emerald-100" />

        {/* 📖 Chapters List */}
        <h1 className="text-4xl font-semibold text-emerald-900 mb-8 text-center">
          📖 Quran Chapters
        </h1>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapters.map((ch) => (
            <li
              key={ch.id}
              className="group bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <Link href={`/surah/${ch.id}`} className="block p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-emerald-900 text-xl font-semibold">
                    {ch.name_simple}
                  </span>
                  <span className="text-emerald-600 text-lg font-arabic">
                    {ch.name_arabic}
                  </span>
                </div>

                <p className="text-gray-600 text-sm italic mb-2">
                  {ch.translated_name?.name}
                </p>

                <div className="text-xs text-gray-500 flex justify-between">
                  <span className="capitalize">{ch.revelation_place}</span>
                  <span>{ch.verses_count} verses</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        Crafted with ✨ by <span className="text-emerald-600">Quran Journey</span>
      </footer>

      {/* 🌿 Reflections Modal with Framer Motion */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">
                🌸 Your Saved Reflections
              </h2>

              {/* Reflection List */}
              {savedReflections.length === 0 ? (
                <p className="text-gray-600 text-center">No reflections saved yet.</p>
              ) : (
                <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {savedReflections.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="border border-emerald-100 rounded-lg p-4 bg-emerald-50/40 hover:bg-emerald-50 transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-500 italic">
                          {new Date(item.date).toLocaleDateString()} • Verse {item.verseKey}
                        </p>
                        <button
                          onClick={() => handleDeleteReflection(index)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-gray-800 mb-2">{item.verse}</p>
                      <p className="text-emerald-800 font-medium italic">
                        “{item.userReflection}”
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}