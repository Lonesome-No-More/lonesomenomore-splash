# Lonesome No More — Remotion Explainer Video

## Overview

A 90-100 second animated explainer video for Lonesome No More, built with Remotion (React-based programmatic video framework). The video combines emotional storytelling with product explanation, featuring voiceover narration and simulated Sophie conversation snippets generated via ElevenLabs API.

**Format:** 1920x1080, 30fps, ~3000 frames
**Style:** Illustrated & animated — floating orbs, glassmorphism cards, particle effects matching the LNM website aesthetic
**Audio:** Narrator voiceover + Sophie AI companion audio snippets + background music
**Target audience:** Adult children (40-65) caring for aging parents
**Goal:** Emotionally convey the loneliness problem and position LNM as the solution — suitable for website hero, social media, pitch decks

## Project Structure

The Remotion project lives inside this repo at `/video`:

```
video/
├── package.json
├── tsconfig.json
├── remotion.config.ts            # Remotion config — registers src/Root.tsx as entry point
├── .env                          # ElevenLabs API key (gitignored)
├── .env.example
├── scripts/
│   └── generate-audio.ts         # ElevenLabs audio generation pipeline
├── src/
│   ├── Root.tsx                  # Entry point, registers the composition
│   ├── Video.tsx                 # Main composition — sequences all scenes
│   ├── scenes/
│   │   ├── ProblemScene.tsx      # Act 1: The loneliness problem (0-25s)
│   │   ├── SolutionScene.tsx     # Act 2: Introducing LNM (25-55s)
│   │   ├── ExperienceScene.tsx   # Act 3: What makes it special (55-85s)
│   │   └── PeaceOfMindScene.tsx  # Act 4: Family peace of mind + CTA (85-100s)
│   ├── components/
│   │   ├── FloatingOrbs.tsx      # Animated background orbs
│   │   ├── GlassCard.tsx         # Glassmorphism card component
│   │   ├── PhoneRing.tsx         # Animated phone/call UI
│   │   ├── ChatBubble.tsx        # Conversation snippet display
│   │   └── TypewriterText.tsx    # Character-by-character text reveal
│   ├── styles/
│   │   └── theme.ts             # Brand colors, fonts, spacing
│   └── assets/
│       ├── audio/               # Generated audio files (gitignored)
│       ├── logo.png             # Symlink or copy from repo root
│       ├── sophie.jpg           # Symlink or copy from repo root
│       └── script.json          # Narration script with timing data
```

## Narrative Arc & Timing

### Act 1 — The Problem (0-25s, frames 0-750)

**Narration:**
> "Millions of seniors spend their days in silence. No visitors. No calls. Just the quiet. And for their families... there's the worry. The guilt of not being there enough. The wish that someone — anyone — could just check in."

**Visuals:**
- Dark sage green background with slow-drifting orbs
- Loneliness statistics fade in as large typography (e.g., "43% of seniors report feeling lonely")
- Subtle noise texture overlay
- Text fades between statements with gentle vertical parallax
- Mood: somber, quiet, intimate

### Act 2 — The Solution (25-55s, frames 750-1650)

**Narration:**
> "That's why we built Lonesome No More. A companion who calls your loved one by name... who remembers their stories... and who's always just a phone call away."

**Sophie snippet:**
> "Good morning, Maggie! Did Emma ever get the hang of that bicycle?"

**Narration (continued):**
> "No apps. No tablets. No learning curve. Just pick up the phone."

**Visuals:**
- Background brightens to warm cream (#FBF8F3)
- LNM logo animates in (spring entrance)
- Animated phone with pulsing rings — "Sophie is calling..."
- Transition to chat bubbles showing the Sophie snippet
- Sophie's profile image slides in alongside her bubble
- Phone mockup with simple dial interface

### Act 3 — The Experience (55-85s, frames 1650-2550)

**Narration:**
> "Sophie remembers everything — the grandkids' names, the Chopin pieces, even the legendary dumplings. Every conversation picks up right where the last one left off."

**Sophie snippet:**
> "You mentioned you were trying that new mystery novel. How's the detective — still one step behind?"

**Narration (continued):**
> "Available twenty-four seven. Your loved one is never alone."

**Visuals:**
- Three GlassCards spring in sequentially:
  1. "Truly Personalized" — remembers their life story
  2. "Available 24/7" — call anytime, on any phone
  3. "Effortlessly Simple" — no apps, no learning curve
- Chat bubble for Sophie snippet with typing indicator animation
- Floating orbs in honey amber and terra cotta tones
- Feature icons animate within each card

### Act 4 — Peace of Mind (85-100s, frames 2550-3000)

**Narration:**
> "And for you? A weekly summary of how they're doing. The stories they shared. The moments that mattered. Lonesome No More — companionship for your loved ones. Peace of mind for you."

**Visuals:**
- Mockup of weekly summary email/dashboard sliding in
- Conversation highlights shown as small preview cards
- Transition to full-screen brand moment: logo centered, tagline below
- CTA: phone number (833) 817-4646 and lonesomenomore.com
- Warm cream background, all orbs converge gently toward center

## Animation System

### FloatingOrbs
Soft, blurred circles (40-120px) that drift across the background using sinusoidal `interpolate()` curves. Each scene uses different positions and colors from the brand palette. Opacity range: 0.1-0.3. Movement speed: ~20px per second.

### GlassCard
Frosted glass panels with:
- `background: rgba(255, 255, 255, 0.1)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(255, 255, 255, 0.15)`
- `border-radius: 16px`
- Entrance: `spring({ damping: 12, stiffness: 100 })` from 40px below
- Used in Act 3 for feature callouts

### TypewriterText
Text appears character by character, timed to match narration pacing. Uses `interpolate()` to map frame number to character count. Cursor blinks at end. Font: Merriweather for headlines, Inter for body.

### PhoneRing
Animated phone icon centered on screen:
- Three concentric rings pulse outward with staggered timing
- Rings use terra cotta (#D4735E) with decreasing opacity
- Phone icon scales slightly with each pulse
- Text below: "Sophie is calling..."

### ChatBubble
Speech bubbles with:
- Left-aligned (Sophie): sage green accent border
- Profile avatar alongside bubble
- Slide-in from left using `spring()`
- Optional typing indicator (three animated dots) before text appears
- Text reveals progressively, synced to audio

### Scene Transitions
- 30-frame (1s) cross-fade between scenes
- Each scene extends 15 frames past its nominal end; the next scene begins 15 frames early, creating a 30-frame overlap window where both render simultaneously
- Outgoing scene fades opacity 1→0 while shifting 10px upward
- Incoming scene fades opacity 0→1 while shifting from 10px below
- Orbs transition independently with slower timing for depth

**Note:** `backdrop-filter: blur()` renders correctly with Remotion's default Chromium-based renderer. Avoid switching to alternative renderers as glass effects may not render.

## Brand Theme

Pulled directly from the existing brand-outline.md:

```typescript
const theme = {
  colors: {
    primary: '#5F7A61',      // Deep Sage Green
    secondary: '#D4735E',    // Warm Terra Cotta
    accent: '#E8AA6B',       // Honey Amber
    text: '#2C2C2C',         // Deep Charcoal
    bgWarm: '#FBF8F3',       // Warm Cream
    bgSoft: '#FFFEFB',       // Soft White
  },
  fonts: {
    heading: 'Merriweather, Georgia, serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
}
```

Google Fonts loaded via `@remotion/google-fonts` package.

## Audio Generation Pipeline

### Script Data Format (`src/assets/script.json`)

```json
{
  "narrator_voice": "Rachel",
  "sophie_voice": "Sophie",
  "segments": [
    {
      "id": "act1-narration",
      "scene": "problem",
      "voice": "narrator",
      "text": "Millions of seniors spend their days in silence...",
      "start_seconds": 0
    },
    {
      "id": "act2-narration-1",
      "scene": "solution",
      "voice": "narrator",
      "text": "That's why we built Lonesome No More...",
      "start_seconds": 25
    },
    {
      "id": "act2-sophie",
      "scene": "solution",
      "voice": "sophie",
      "text": "Good morning, Maggie! Did Emma ever get the hang of that bicycle?",
      "start_seconds": 40
    },
    {
      "id": "act2-narration-2",
      "scene": "solution",
      "voice": "narrator",
      "text": "No apps. No tablets. No learning curve. Just pick up the phone.",
      "start_seconds": 46
    },
    {
      "id": "act3-narration-1",
      "scene": "experience",
      "voice": "narrator",
      "text": "Sophie remembers everything — the grandkids' names, the Chopin pieces, even the legendary dumplings. Every conversation picks up right where the last one left off.",
      "start_seconds": 55
    },
    {
      "id": "act3-sophie",
      "scene": "experience",
      "voice": "sophie",
      "text": "You mentioned you were trying that new mystery novel. How's the detective — still one step behind?",
      "start_seconds": 68
    },
    {
      "id": "act3-narration-2",
      "scene": "experience",
      "voice": "narrator",
      "text": "Available twenty-four seven. Your loved one is never alone.",
      "start_seconds": 76
    },
    {
      "id": "act4-narration",
      "scene": "peaceofmind",
      "voice": "narrator",
      "text": "And for you? A weekly summary of how they're doing. The stories they shared. The moments that mattered. Lonesome No More — companionship for your loved ones. Peace of mind for you.",
      "start_seconds": 85
    }
  ]
}
```

### Generation Script (`scripts/generate-audio.ts`)

- Reads `script.json` for all segments
- Calls ElevenLabs Text-to-Speech API for each segment
- Uses the voice ID mapped from the voice name
- Saves output as MP3 files to `src/assets/audio/{segment-id}.mp3`
- Generates `src/assets/audio/manifest.json` with actual durations (measured from the generated files) so Remotion can precisely time sequences
- Requires `ELEVENLABS_API_KEY` from `.env`

### Voice Selection
- **Narrator:** A warm, trustworthy voice from ElevenLabs library. The script will list available voices so the user can preview and choose. Default: "Rachel" (or similar warm female voice).
- **Sophie:** Select a voice that feels friendly and personable for an AI companion. Can be customized after hearing the initial generation.

## Development Workflow

```bash
# Setup
cd video
npm install

# Preview in browser with hot reload
npx remotion studio

# Generate audio from scripts
npx tsx scripts/generate-audio.ts

# Render final video
npx remotion render Video --output out/lonesome-no-more.mp4
```

Remotion Studio provides a browser-based player at localhost:3000 where you can:
- Scrub through the video frame by frame
- See live updates as you edit component code
- Preview individual scenes or the full composition
- Adjust timing visually

## Dependencies

```json
{
  "dependencies": {
    "remotion": "^4.x",
    "@remotion/cli": "^4.x",
    "@remotion/google-fonts": "^4.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tsx": "^4.x",
    "elevenlabs": "^1.x",
    "dotenv": "^16.x",
    "@types/react": "^18.x"
  }
}
```

## Open Decisions

- **Background music:** User needs to supply or select a royalty-free track. Can be added as an `<Audio>` layer in the composition.
- **Narrator voice:** Final voice selection happens after previewing ElevenLabs options via the generation script.
- **Sophie voice ID:** Need to determine if an existing ElevenLabs voice is already configured for Sophie, or select one.
- **Loneliness statistics:** Act 1 references stats — need to confirm specific numbers to display (e.g., "43% of seniors report feeling lonely" from AARP/NAS studies).

## Success Criteria

- Video renders cleanly as a 1920x1080 MP4 at 30fps
- All four scenes flow naturally with smooth transitions
- Audio (narration + Sophie snippets) syncs to visual cues
- Brand colors, fonts, and visual style match the LNM website
- Project is beginner-friendly: well-commented, clear file organization, simple to modify
