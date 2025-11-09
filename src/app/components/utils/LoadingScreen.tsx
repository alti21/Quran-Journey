import React from "react";

export default function LoadingScreen({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <p className="animate-pulse text-emerald-700 text-lg">
        Loading {text}…
      </p>
    </div>
  );
}