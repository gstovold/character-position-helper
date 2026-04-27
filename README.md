# Character Position Helper

A privacy-first Progressive Web App (PWA) that shows the numbered position of every character in a string. Designed for situations like "enter the 4th, 6th and 1st characters of your password."

**🔒 Nothing is ever saved, sent, tracked, or logged. All processing happens locally in your browser.**

---

## Features

- ✅ Shows character position (1-based) beneath each tile
- ✅ Spaces displayed as `␣` with distinct styling
- ✅ Show / hide toggle to mask characters
- ✅ One-click "Copy positions" to clipboard
- ✅ Clear/reset button
- ✅ Installable as a PWA (works offline)
- ✅ Fully accessible (keyboard, screen reader, WCAG AA contrast)
- ✅ No cookies, no analytics, no third-party requests
- ✅ Mobile-first, fully responsive

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/character-position-helper
cd character-position-helper
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---

## Project Structure

```
character-position-helper/
├── public/
│   └── icons/              # PWA icons (192px, 512px, favicon SVG)
├── src/
│   ├── utils/
│   │   └── charUtils.ts    # Core character parsing logic (pure functions)
│   ├── tests/
│   │   └── charUtils.test.ts  # Unit tests (vitest)
│   ├── App.tsx             # Main React component
│   ├── App.css             # Styles
│   ├── index.css           # Global entry CSS
│   └── main.tsx            # React entry point
├── index.html              # HTML shell (includes CSP meta tag)
├── vite.config.ts          # Vite + PWA plugin config
├── vitest.config.ts        # Test config
├── netlify.toml            # Netlify deploy config
├── vercel.json             # Vercel deploy config
└── README.md
```

---

## Deployment

### Netlify (recommended)

1. Push to GitHub
2. Connect repo in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy — it will pick up `netlify.toml` automatically.

### Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Framework preset: **Vite**
4. Deploy — `vercel.json` handles routing.

### Manual (any static host)

```bash
npm run build
# Upload the `dist/` folder to any static host (S3, Cloudflare Pages, etc.)
```

---

## Security Notes

### Privacy by design

- **No persistence**: The input field is controlled React state only. It is never written to `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or any other persistent store.
- **No network requests**: The app makes zero outbound requests at runtime. The only network activity is loading the app assets themselves (served from your own domain).
- **No analytics**: No tracking scripts, pixels, or beacons.
- **No third-party dependencies at runtime**: All logic is bundled. The Google Fonts import in CSS can be removed for a fully air-gapped deployment (the font stack falls back gracefully to system monospace fonts).

### Content Security Policy

The `index.html` includes a `<meta>` CSP tag:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'none';
frame-src 'none';
object-src 'none';
```

For production, set this as an **HTTP response header** instead (stricter enforcement):

**Netlify** — add to `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; frame-src 'none'; object-src 'none';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

**Vercel** — add to `vercel.json` under `"headers"`.

### Remove Google Fonts for full offline-only use

In `src/App.css`, delete the `@import url(...)` line. The font stack falls back to the system monospace font automatically.

---

## Testing

Tests use [Vitest](https://vitest.dev/) and cover:

- `parseCharacters()` — position numbering, space detection, unicode, special chars
- `buildCopyText()` — plain-text formatting, hidden mode, spaces
- `displayChar()` — tile display logic, hidden mode, space symbol

```bash
npm test
```

---

## Accessibility

- All interactive elements are keyboard accessible
- `aria-label`, `aria-pressed`, `aria-live`, and `role` attributes throughout
- Colour contrast meets WCAG AA
- `prefers-reduced-motion` respected — tile animations disabled
- Screen reader announcements for character count and copy status

---

## License

MIT — free to use, modify, and deploy.
