import "./globals.css";

export const metadata = {
  title: "Quran App",
  description: "A simple Quran browser built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}