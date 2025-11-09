"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Error from "@/app/components/utils/Error";
import ReflectionModal from "@/app/components/chapters/ReflectionModal";
import ReflectionSection from "../components/chapters/ReflectionSection";
import AppHeader from "../components/chapters/AppHeader";
import SurahGrid from "../components/chapters/SurahGrid";
import LoadingScreen from "@/app/components/utils/LoadingScreen";
import type { Surah, ReflectionVerse, SavedReflection } from "@/types/quran";

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Surah[]>([]);
  const [reflectionVerse, setReflectionVerse] = useState<ReflectionVerse | null>(null);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([]);

  // Load saved reflections from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reflections") || "[]");
    setSavedReflections(stored);
  }, []);

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Save reflection
  const handleSave = useCallback(() => {
    if (!reflectionVerse) return;

    const newReflection: SavedReflection = {
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
  }, [reflection, reflectionVerse, savedReflections]);

  const handleDeleteReflection = useCallback((index: number) => {
    if (!window.confirm("Delete this reflection?")) return;

    const updated = savedReflections.filter((_, i) => i !== index);
    localStorage.setItem("reflections", JSON.stringify(updated));
    setSavedReflections(updated);
  }, [savedReflections]);

  if (error) return <Error error={error} />;

  if (loading) return <LoadingScreen text="surahs and reflections" />

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-10 flex flex-col items-center">
      <AppHeader />

      <div className="max-w-4xl w-full bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-emerald-100">
        {reflectionVerse && 
          <ReflectionSection 
            reflectionVerse={reflectionVerse}
            reflection={reflection}
            setReflection={setReflection}
            onSave={handleSave}
            onOpenModal={() => setShowModal(true)}
            saved={saved}
          />
        }

        <hr className="my-10 border-emerald-100" />

        <h1 className="text-4xl font-semibold text-emerald-900 mb-8 text-center">
          📖 Surahs
        </h1>

        <SurahGrid chapters={chapters} />
      </div>

      {showModal && <ReflectionModal
        savedReflections={savedReflections}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteReflection}
      />}
    </main>
  );
}