export type Surah = {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  translated_name: { name: string };
};

export type Verse = {
  verse_key: string;
  text_uthmani: string;
  translations?: { text: string }[];
}

export type VerseResponse = {
  verse: Verse;
}

export type Glyph = {
  id: number;
  verse_key: string;
  code_v1: string;
  v1_page: number;
};

export type Translation = {
  resource_id: number;
  text: string;
};

export type ReflectionVerse = {
  verse_key: string;
  verseText: string;
  translation: string;
  reflectionPrompt: string;
};

export type SavedReflection = {
  date: string;
  verseKey: string;
  verse: string;
  userReflection: string;
};

export type TokenResponse = {
  access_token: string;
  expires_in: Number;
};