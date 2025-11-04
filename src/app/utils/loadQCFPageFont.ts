export default function loadQCFPageFont(page: number | undefined) {
  if (!page) return;

  const fontName = `p${page}-v1`;

  // Prevent adding duplicate font
  if (document.fonts && [...document.fonts].some(f => f.family === fontName)) return fontName;

  const fontUrl = `/fonts/p${page}.ttf`;
  const fontFace = new FontFace(fontName, `url(${fontUrl})`);

  fontFace.load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
      console.log(`✅ Loaded QCF font for page ${page}`);
    })
    .catch(err => {
      console.error(`❌ Failed to load QCF font ${fontUrl}:`, err);
    });

  return fontName;
}