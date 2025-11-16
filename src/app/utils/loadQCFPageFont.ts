export default function loadQCFPageFont(page: number | undefined): Promise<string> {
  return new Promise((resolve) => {
    if (!page) return resolve("");

    const fontName = `p${page}-v1`;

    // If font is already loaded, resolve immediately
    if (document.fonts && [...document.fonts].some(f => f.family === fontName)) {
      return resolve(fontName);
    }

    const fontUrl = `/fonts/p${page}.ttf`;
    const fontFace = new FontFace(fontName, `url(${fontUrl})`);

    fontFace.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve(fontName);
      })
      .catch((err) => {
        resolve(""); // resolve anyway to avoid blocking
      });
  });
}