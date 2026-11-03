/* global __dirname, Buffer */
// Usage: node scripts/generate-icons.js [outDir]
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = process.argv[2] ?? path.join(root, "assets/images");
const CanvasKitInit = require(
  path.join(root, "node_modules/canvaskit-wasm/bin/full/canvaskit.js"),
);
const fontPath = path.join(
  root,
  "node_modules/@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf",
);

// Same sparkle as twinkle-star.tsx.
const STAR =
  "M12 0C12.8 7.2 16.8 11.2 24 12C16.8 12.8 12.8 16.8 12 24C11.2 16.8 7.2 12.8 0 12C7.2 11.2 11.2 7.2 12 0Z";

CanvasKitInit({
  locateFile: (f) => path.join(root, "node_modules/canvaskit-wasm/bin/full", f),
}).then((CK) => {
  const fontData = fs.readFileSync(fontPath);
  const typeface = CK.Typeface.MakeTypefaceFromData(
    fontData.buffer.slice(
      fontData.byteOffset,
      fontData.byteOffset + fontData.byteLength,
    ),
  );

  function render({ size, background, contentScale = 1, file }) {
    const surface = CK.MakeSurface(size, size);
    const canvas = surface.getCanvas();
    canvas.clear(background ? CK.Color(0, 0, 0, 1) : CK.TRANSPARENT);

    const k = size / 1024;
    canvas.save();
    canvas.translate(size / 2, size / 2);
    canvas.scale(k * contentScale, k * contentScale);
    canvas.translate(-512, -512);

    const white = new CK.Paint();
    white.setColor(CK.Color(255, 255, 255, 1));
    white.setAntiAlias(true);

    const stroke = new CK.Paint();
    stroke.setColor(CK.Color(255, 255, 255, 1));
    stroke.setAntiAlias(true);
    stroke.setStyle(CK.PaintStyle.Stroke);
    stroke.setStrokeWidth(46);
    stroke.setStrokeCap(CK.StrokeCap.Round);
    stroke.setStrokeJoin(CK.StrokeJoin.Round);
    const inset = 190;
    const arm = 150;
    const lo = inset;
    const hi = 1024 - inset;
    const corners = [
      [lo, lo, 1, 1],
      [hi, lo, -1, 1],
      [lo, hi, 1, -1],
      [hi, hi, -1, -1],
    ];
    for (const [x, y, dx, dy] of corners) {
      const p = new CK.PathBuilder()
        .moveTo(x, y + dy * arm)
        .lineTo(x, y)
        .lineTo(x + dx * arm, y)
        .detachAndDelete();
      canvas.drawPath(p, stroke);
      p.delete();
    }

    const font = new CK.Font(typeface, 440);
    const ids = font.getGlyphIDs("@");
    const bounds = font.getGlyphBounds(ids, white); // [l, t, r, b]
    const [l, t, r, b] = bounds;
    const x = 512 - (l + r) / 2;
    const y = 512 - (t + b) / 2;
    canvas.drawText("@", x, y + 6, white, font);

    const star = CK.Path.MakeFromSVGString(STAR);
    canvas.save();
    canvas.translate(668, 262);
    canvas.scale(4.4, 4.4);
    canvas.drawPath(star, white);
    canvas.restore();

    canvas.restore();

    const image = surface.makeImageSnapshot();
    const bytes = image.encodeToBytes();
    fs.writeFileSync(path.join(outDir, file), Buffer.from(bytes));
    image.delete();
    surface.delete();
    console.log("wrote", file, size);
  }

  fs.mkdirSync(outDir, { recursive: true });
  render({ size: 1024, background: true, file: "icon.png" });
  // Android adaptive icons crop to the inner ~66%.
  render({
    size: 1024,
    background: false,
    contentScale: 0.64,
    file: "android-icon-foreground.png",
  });
  render({
    size: 1024,
    background: false,
    contentScale: 0.64,
    file: "android-icon-monochrome.png",
  });
  {
    const surface = CK.MakeSurface(512, 512);
    surface.getCanvas().clear(CK.Color(0, 0, 0, 1));
    const img = surface.makeImageSnapshot();
    fs.writeFileSync(
      path.join(outDir, "android-icon-background.png"),
      Buffer.from(img.encodeToBytes()),
    );
    console.log("wrote android-icon-background.png 512");
  }
  render({ size: 48, background: true, file: "favicon.png" });
  // Blank native splash; the JS splash takes over.
  {
    const surface = CK.MakeSurface(8, 8);
    surface.getCanvas().clear(CK.TRANSPARENT);
    const img = surface.makeImageSnapshot();
    fs.writeFileSync(
      path.join(outDir, "splash-icon.png"),
      Buffer.from(img.encodeToBytes()),
    );
    console.log("wrote splash-icon.png 8");
  }
});
