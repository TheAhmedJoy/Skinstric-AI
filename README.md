# Skinstric AI

A web app demo for **Skinstric**, an AI-driven skincare brand. The user introduces themselves, lets the app capture or upload a photo, and the AI returns a confidence-scored prediction of their **race, age, and sex** — visualised through an interactive radial chart and an editable answer panel.

The project is a faithful reproduction of the Skinstric onboarding/analysis flow, built on the latest Next.js + React stack with rich GSAP-driven landing animations.

---

## What the product does

The experience is a guided, multi-step funnel. Each step has its own route under the App Router.

**Landing (`/`)**
- Animated hero with the headline "Sophisticated skincare"
- Two diamond-shaped call-to-actions, **DISCOVER A.I.** and **TAKE TEST**, that slide the heading on hover via GSAP
- Mobile fallback with a simpler "ENTER EXPERIENCE" button
- Uses the local Roobert font family (Light / Regular / SemiBold)

**Introduction (`/testing`)**
- A multi-step form using React 19's `useActionState`
  1. "Introduce Yourself" — asks for the user's name (validates against numbers/special characters)
  2. "Where are you from?" — asks for a location
  3. Submits both to the **`skinstricPhaseOne`** Cloud Function and shows a "Thank you!" confirmation
- Three concentric rotating rectangle layers (CSS `animate-spin-slow / slower / slowest`) form the visual centerpiece
- Animated processing state with a reusable `LoadingDots` component

**Capture choice (`/result`)**
- Two large diamond options side-by-side:
  - **Camera** — opens a permission modal, then routes to `/camera`
  - **Gallery** — opens a file picker that previews and uploads the image
- A `ModalProvider` (React Context) keeps the camera-permission modal state global to that screen

**Camera setup (`/camera`)**
- Animated "SETTING UP CAMERA…" pulse with rotating layers
- After 3 seconds it auto-routes to `/camera/capture`
- Tips for the user: neutral expression, frontal pose, adequate lighting

**Camera capture (`/camera/capture`)**
- Live webcam stream via `navigator.mediaDevices.getUserMedia`
- "TAKE PICTURE" button draws the current `<video>` frame onto a hidden `<canvas>` and produces a base64 JPEG
- Preview screen with **Retake** and **Use This Photo**
- On confirm, the image is stored in `localStorage` and POSTed to the **`skinstricPhaseTwo`** Cloud Function
- Loading and error states (permission errors, playback errors, capture failures) are surfaced to the user

**Gallery upload (component on `/result`)**
- Hidden file input is triggered by clicking the gallery diamond
- Selected images are resized client-side to ≤800px on a `<canvas>` and re-encoded as JPEG (quality 0.7)
- Sent to the same `skinstricPhaseTwo` endpoint, with a "PREPARING YOUR ANALYSIS…" overlay during the round-trip

**Analysis hub (`/select`)**
- Diamond grid of four analyses: **Demographics** (active), **Cosmetic Concerns**, **Skin Type Details**, **Weather** (the latter three are styled as disabled placeholders)
- Hovering each diamond fades in a backing rectangle layer

**Demographics summary (`/summary`)**
- Reads the stored API response from `localStorage` through a `Demographics` context provider
- API data is normalised into three categories: `race`, `age`, `sex`, each with a top prediction and a sorted list of options with confidence percentages
- A `RadialChart` component renders:
  - A category selector on the left (Race / Age / Sex) — clicking switches the active view
  - A circular progress ring (using `react-circular-progressbar`) showing the confidence of the current prediction
  - A confidence-ranked list on the right; clicking an option overrides the prediction
  - Age options are re-sorted into chronological buckets (`0-2`, `3-9`, `10-19`, … `70+`) instead of confidence order
- Back / Home navigation through the reusable `BackButton` and `ProceedButton`

---

## Tech stack

**Framework & language**
- Next.js 16 (App Router, server + client components, `use client` islands)
- React 19 (`useActionState`, `startTransition`, hooks-based state everywhere)
- TypeScript 5

**Styling**
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- Custom keyframes: `animate-spin-slow / slower / slowest`, `animate-spin-load / loader / loadest`, `animate-pulse-grow`
- Local Roobert TRIAL font family (Light, Regular, Medium, SemiBold) loaded with `next/font/local`
- A monochrome design language: `#1A1B1C` text on `#FCFCFC` / white backgrounds

**Animation**
- **GSAP** (`gsap`) drives the landing-page interactions — heading fade-in and the slide-on-hover effect for the left/right diamond sections

**Data visualisation**
- **`react-circular-progressbar`** for the confidence ring on the demographics summary

**State management**
- React Context for two scoped concerns:
  - `ModalProvider` — gates the camera-permission popup so it can dim the surrounding screen
  - `DemographicDataContext` — loads and shares the parsed AI result across the summary view
- React 19 `useActionState` for the multi-step intro form

**Browser APIs**
- `navigator.mediaDevices.getUserMedia` for webcam access
- `<canvas>` for both webcam capture and client-side image resizing
- `localStorage` for the captured image and the demographic API response (the app is intentionally state-less between visits otherwise)

**Backend / API**
The frontend calls two Firebase Cloud Functions hosted by the Skinstric / Frontend Simplified team:

| Endpoint | Purpose |
| --- | --- |
| `POST https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne` | Submits `{ name, location }` from the intro form |
| `POST https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo` | Submits a base64-encoded image and returns `{ success, data: { race, age, gender } }` confidence maps |

**Tooling**
- ESLint 9 with `eslint-config-next`
- PostCSS
- `react-icons` (used selectively for UI accents)

---

## Project structure

```
skinstric-ai/
├── src/
│   └── app/
│       ├── page.tsx                       # Landing (animated diamonds + GSAP)
│       ├── layout.tsx                     # Root layout + global Nav
│       ├── globals.css
│       ├── testing/page.tsx               # Step 1/2/3 intro form (useActionState)
│       ├── result/page.tsx                # Capture choice screen
│       ├── camera/page.tsx                # "Setting up camera" splash
│       ├── camera/capture/page.tsx        # Live webcam capture + upload
│       ├── select/page.tsx                # Analysis hub (diamond grid)
│       ├── summary/page.tsx               # Demographics summary
│       ├── fonts/                         # Roobert TRIAL .woff2 files
│       └── components/
│           ├── Nav.tsx
│           ├── Demographics.tsx           # Context + API data normaliser
│           ├── RadicalChart.tsx           # Confidence ring + option list
│           ├── CameraSelectOption.tsx     # Camera diamond + permission modal
│           ├── GallerySelectOption.tsx    # Gallery diamond + image upload
│           ├── ResultModalWrapper.tsx     # Wraps /result in ModalProvider
│           ├── Modals/Modal.tsx           # ModalProvider context
│           ├── animations/
│           │   ├── HomeAnimations.tsx     # GSAP timeline for the landing page
│           │   └── ClientAnimations.tsx
│           ├── UI/
│           │   ├── BackButton.tsx
│           │   ├── ProceedButton.tsx
│           │   ├── SelectOptions.tsx
│           │   └── LoadingDots.tsx
│           └── assets/                    # SVG art + a fonts/ copy
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. The app runs with no environment variables — the Cloud Function endpoints are hard-coded.

To use the camera step locally, your browser will need permission to access the webcam, and the page must be served over `localhost` or `https://`.

### Available scripts

| Script          | What it does                            |
| --------------- | --------------------------------------- |
| `npm run dev`   | Starts the Next.js dev server           |
| `npm run build` | Production build                        |
| `npm run start` | Runs the production build               |
| `npm run lint`  | Lints the project with ESLint           |

---

## Notes & limitations

- The `/select` page exposes only the **Demographics** path; **Cosmetic Concerns**, **Skin Type Details**, and **Weather** are intentionally non-functional placeholders.
- Demographic results are passed between routes via `localStorage`, so opening `/summary` directly without first analysing an image will show the empty state with a button back to `/result`.
- The intro form's success message is rendered after step 2; the API response message is captured but not shown.
- All AI inference happens server-side via the Firebase Cloud Functions linked above; the frontend is purely a client.

---

## Deployment

The project is a standard Next.js 16 application and deploys to Vercel without changes. Because there are no build-time secrets and no environment variables, no additional configuration is required — just point your Vercel project at the repo.
