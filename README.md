# Atlas — WoW AI Companion

Faithful Figma-to-code rebuild (Midnight theme, Atlas Alpha).

## Setup

```bash
npm install
```

Create `.env.local`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

```bash
npm run dev
```

Open http://localhost:5173

---

## Notes
- Single-file layout in `src/App.jsx` — easy to edit in Cursor
- All Figma asset URLs are embedded (valid for ~7 days from May 2026)
- To swap assets permanently, download them and put in `public/` folder
- API key goes in `.env.local` — never commit this file
