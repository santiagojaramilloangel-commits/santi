# Barbershop Virtual Try-On

Mobile-first Next.js app for in-chair haircut consultations. Capture a client photo, pick a face shape, generate five cuts one at a time, compare with a before/after slider, share or book, and optionally save looks in Barber Mode (IndexedDB on-device).

## Stack

- Next.js App Router + React + TypeScript (strict)
- Tailwind CSS
- Dexie / IndexedDB behind a `LooksRepository` interface
- Image edits via server route + pluggable `ImageEditProvider` (`fal` | `replicate` | `gemini`)

Photos never upload to a public URL. Session images live in memory only unless saved with explicit consent in Barber Mode.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). With an empty `.env`, the app runs in **demo mode**.

```bash
npm run build
npx tsc --noEmit
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `IMAGE_PROVIDER` | server | `fal`, `replicate`, `gemini`, or `demo` |
| `FAL_KEY` | server | fal.ai API key |
| `FAL_MODEL` | server | Optional fal model id |
| `REPLICATE_API_TOKEN` | server | Replicate API token |
| `REPLICATE_MODEL` | server | Optional Replicate model id |
| `GEMINI_API_KEY` | server | Google Gemini API key |
| `GEMINI_MODEL` | server | Optional Gemini image model |
| `GOOGLE_GEMINI_BASE_URL` | server | Optional base URL (Netlify AI Gateway) |
| `NEXT_PUBLIC_SHOP_NAME` | public | Shop name in UI / stamps / share text |
| `NEXT_PUBLIC_LOGO_PATH` | public | SVG/logo path (default `/logo.svg`) |
| `NEXT_PUBLIC_CURRENCY` | public | ISO currency for price formatting |
| `NEXT_PUBLIC_PRICE_PER_CUT` | public | Price shown on every cut |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | WhatsApp digits for `wa.me` |
| `NEXT_PUBLIC_BOOKING_URL` | public | Booking page; `?service=` is appended |

Defaults also live in `brand.config.ts`. Public env vars override them at build/runtime.

## Switching image providers

1. Set `IMAGE_PROVIDER` to `fal`, `replicate`, or `gemini`.
2. Set the matching key (`FAL_KEY`, `REPLICATE_API_TOKEN`, or `GEMINI_API_KEY`).
3. Restart `npm run dev` / redeploy.

All provider calls go through `POST /api/edit-hair`. The browser never receives the API key. The route keeps nothing on disk and does not log image bytes.

Provider implementations live under `src/lib/providers/` and share the `ImageEditProvider` interface:

```ts
editHair({ image, cutPrompt, cutId }): Promise<Blob>
```

## Demo mode

Demo mode activates when:

- `IMAGE_PROVIDER=demo`, or
- no provider key is configured for the selected provider.

In demo mode:

- A persistent banner shows **Demo mode – no AI generation**.
- Each “generate” paints the source photo in grayscale with a large gold **DEMO PLACEHOLDER** watermark and the cut name (Canvas).
- Placeholders are never presented as real AI try-ons.
- Two license-free silhouette samples ship in `/public/samples/` so you can walk the full flow without a camera.

## Core flows

1. **Capture** — upload, front camera (`getUserMedia` + gold oval / eye-line guide), or sample photo. Confirm or retake. Client-side preprocess: max 1024px long side, JPEG ~0.85, EXIF stripped via Canvas.
2. **Face shape** — Long / Round / Square / Oval. Cuts reorder by tier S→D (`src/lib/faceShapes.ts`).
3. **Generate** — five cuts, one at a time, progress per card, session memory cache.
4. **Compare** — draggable before/after slider (pointer + keyboard) and swipeable cut strip.
5. **Share / book** — download JPEG stamped with logo + cut name; Web Share Level 2 with file when supported, else WhatsApp text + download prompt; booking URL or WhatsApp.
6. **Barber Mode** (`/barber`) — save under client name with consent checkbox (EN/ES), search, reopen, delete look/client. IndexedDB only.

## i18n

Fully bilingual EN/ES. Toggle in the header. Default from `navigator.language`, remembered in `localStorage`. All UI strings live in `src/lib/i18n.ts`.

## Persistence swap

UI depends on `LooksRepository` (`src/lib/db/looksRepository.ts`). Today: `DexieLooksRepository`. Later you can add Supabase/SQLite implementations without changing components.

## Deploy (Netlify)

`netlify.toml` is included. Set the server env vars (provider key + branding) in the Netlify UI. First production deploy unlocks Netlify AI Gateway if you route Gemini through it.

## Scripts

| Script | Command |
| --- | --- |
| Dev | `npm run dev` |
| Production build | `npm run build` |
| Typecheck | `npm run typecheck` (or `npx tsc --noEmit`) |
| Start | `npm start` |
