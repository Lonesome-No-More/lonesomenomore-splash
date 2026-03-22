# Remotion Explainer Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 90-100 second animated explainer video for Lonesome No More using Remotion, with ElevenLabs-generated voiceover and Sophie conversation snippets.

**Architecture:** A Remotion project at `/video` with 4 scene components composed into a single video. Shared animation components (FloatingOrbs, GlassCard, ChatBubble, etc.) are used across scenes. Audio is generated via ElevenLabs API from a script manifest and composited in Remotion.

**Tech Stack:** Remotion 4.x, React 18, TypeScript, ElevenLabs API, @remotion/google-fonts

**Spec:** `docs/superpowers/specs/2026-03-22-remotion-video-design.md`

---

## File Map

```
video/
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
├── remotion.config.ts              # Remotion entry point config
├── .env                            # ELEVENLABS_API_KEY (gitignored)
├── .env.example                    # Template for .env
├── .gitignore                      # audio/, out/, node_modules/, .env
├── scripts/
│   └── generate-audio.ts           # ElevenLabs TTS generation pipeline
├── src/
│   ├── Root.tsx                    # Registers <Video> composition with Remotion
│   ├── Video.tsx                   # Main composition — sequences all 4 scenes with transitions
│   ├── types.ts                    # Shared TypeScript types (AudioManifest, ScriptSegment, etc.)
│   ├── scenes/
│   │   ├── ProblemScene.tsx        # Act 1 (0-25s): loneliness stats, somber mood
│   │   ├── SolutionScene.tsx       # Act 2 (25-55s): introduce LNM, phone ring, Sophie snippet
│   │   ├── ExperienceScene.tsx     # Act 3 (55-85s): feature cards, Sophie snippet
│   │   └── PeaceOfMindScene.tsx    # Act 4 (85-100s): family dashboard, CTA
│   ├── components/
│   │   ├── FloatingOrbs.tsx        # Animated drifting background circles
│   │   ├── GlassCard.tsx           # Frosted glass panel with spring entrance
│   │   ├── PhoneRing.tsx           # Pulsing phone ring animation
│   │   ├── ChatBubble.tsx          # Speech bubble with typing indicator + text reveal
│   │   └── TypewriterText.tsx      # Character-by-character text animation
│   ├── styles/
│   │   └── theme.ts               # Brand colors, fonts, spacing tokens
│   └── assets/
│       ├── script.json             # Full narration script with timing
│       └── audio/                  # Generated audio files (gitignored)
│           └── manifest.json       # Audio durations for Remotion timing
├── public/
│   ├── logo.png                    # Copied from repo root (served by staticFile())
│   ├── sophie.jpg                  # Copied from repo root (served by staticFile())
│   └── audio/                      # Generated audio copied here for Remotion
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `video/package.json`
- Create: `video/tsconfig.json`
- Create: `video/remotion.config.ts`
- Create: `video/.env.example`
- Create: `video/.gitignore`

- [ ] **Step 1: Create the `video/` directory**

```bash
mkdir -p video
```

- [ ] **Step 2: Initialize package.json**

Create `video/package.json`:

```json
{
  "name": "lonesome-no-more-video",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "studio": "remotion studio",
    "render": "remotion render Video --output out/lonesome-no-more.mp4",
    "generate-audio": "tsx scripts/generate-audio.ts"
  },
  "dependencies": {
    "@remotion/cli": "4.0.265",
    "@remotion/google-fonts": "4.0.265",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "4.0.265"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "dotenv": "^16.4.7",
    "elevenlabs": "^1.56.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

Create `video/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "remotion.config.ts", "scripts/**/*"]
}
```

- [ ] **Step 4: Create remotion.config.ts**

Create `video/remotion.config.ts`:

```typescript
import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/Root.tsx');
```

- [ ] **Step 5: Create .env.example and .gitignore**

Create `video/.env.example`:

```
ELEVENLABS_API_KEY=your_api_key_here
```

Create `video/.gitignore`:

```
node_modules/
out/
src/assets/audio/*.mp3
src/assets/audio/manifest.json
.env
dist/
```

- [ ] **Step 6: Install dependencies**

```bash
cd video && npm install
```

- [ ] **Step 7: Verify Remotion is working**

```bash
cd video && npx remotion --version
```

Expected: prints Remotion version (4.0.x)

- [ ] **Step 8: Commit**

```bash
git add video/package.json video/package-lock.json video/tsconfig.json video/remotion.config.ts video/.env.example video/.gitignore
git commit -m "feat(video): scaffold Remotion project with dependencies"
```

---

### Task 2: Theme, Types & Assets

**Files:**
- Create: `video/src/styles/theme.ts`
- Create: `video/src/types.ts`
- Create: `video/src/assets/script.json`
- Copy: `logo.png` → `video/src/assets/logo.png`
- Copy: `sophie.jpg` → `video/src/assets/sophie.jpg`

- [ ] **Step 1: Create the brand theme**

Create `video/src/styles/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: '#5F7A61',
    secondary: '#D4735E',
    accent: '#E8AA6B',
    text: '#2C2C2C',
    textLight: '#FFFFFF',
    bgWarm: '#FBF8F3',
    bgSoft: '#FFFEFB',
    bgDark: '#2C3E2F',
  },
  fonts: {
    heading: 'Merriweather, Georgia, serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
} as const;
```

- [ ] **Step 2: Create shared types**

Create `video/src/types.ts`:

```typescript
export interface ScriptSegment {
  id: string;
  scene: string;
  voice: 'narrator' | 'sophie';
  text: string;
  start_seconds: number;
}

export interface Script {
  narrator_voice: string;
  sophie_voice: string;
  segments: ScriptSegment[];
}

export interface AudioManifestEntry {
  id: string;
  file: string;
  duration_seconds: number;
  start_seconds: number;
}

export interface AudioManifest {
  entries: AudioManifestEntry[];
}
```

- [ ] **Step 3: Create the full narration script**

Create `video/src/assets/script.json`:

```json
{
  "narrator_voice": "Rachel",
  "sophie_voice": "Sophie",
  "segments": [
    {
      "id": "act1-narration",
      "scene": "problem",
      "voice": "narrator",
      "text": "Millions of seniors spend their days in silence. No visitors. No calls. Just the quiet. And for their families... there's the worry. The guilt of not being there enough. The wish that someone — anyone — could just check in.",
      "start_seconds": 0
    },
    {
      "id": "act2-narration-1",
      "scene": "solution",
      "voice": "narrator",
      "text": "That's why we built Lonesome No More. A companion who calls your loved one by name... who remembers their stories... and who's always just a phone call away.",
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

- [ ] **Step 4: Copy assets to public/ for Remotion's staticFile()**

Remotion serves static files from a `public/` directory. `staticFile('logo.png')` resolves to `video/public/logo.png`.

```bash
mkdir -p video/public video/src/assets/audio
cp logo.png video/public/logo.png
cp sophie.jpg video/public/sophie.jpg
```

- [ ] **Step 5: Commit**

```bash
git add video/src/styles/theme.ts video/src/types.ts video/src/assets/script.json video/public/logo.png video/public/sophie.jpg
git commit -m "feat(video): add brand theme, types, script data, and assets"
```

---

### Task 3: Root & Video Composition (Minimal Shell)

**Files:**
- Create: `video/src/Root.tsx`
- Create: `video/src/Video.tsx`

- [ ] **Step 1: Create Root.tsx**

This registers the video composition with Remotion. Create `video/src/Root.tsx`:

```tsx
import {Composition} from 'remotion';
import {Video} from './Video';

// 30fps * 100 seconds = 3000 frames
const FPS = 30;
const DURATION_SECONDS = 100;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={FPS * DURATION_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
```

- [ ] **Step 2: Create a minimal Video.tsx shell**

This is a placeholder that shows all 4 scenes as colored rectangles so we can verify the project works. Create `video/src/Video.tsx`:

```tsx
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {theme} from './styles/theme';

const FPS = 30;

// Scene boundaries in frames
const SCENES = {
  problem: {from: 0, duration: 25 * FPS},        // 0-25s
  solution: {from: 25 * FPS, duration: 30 * FPS}, // 25-55s
  experience: {from: 55 * FPS, duration: 30 * FPS}, // 55-85s
  peaceOfMind: {from: 85 * FPS, duration: 15 * FPS}, // 85-100s
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.textLight, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 1: The Problem
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.solution.from} durationInFrames={SCENES.solution.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.primary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 2: The Solution
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.experience.from} durationInFrames={SCENES.experience.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.secondary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 3: The Experience
          </h1>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.peaceOfMind.from} durationInFrames={SCENES.peaceOfMind.duration}>
        <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style={{color: theme.colors.primary, fontFamily: theme.fonts.heading, fontSize: 64}}>
            Act 4: Peace of Mind
          </h1>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: Open Remotion Studio and verify**

```bash
cd video && npx remotion studio
```

Expected: browser opens at localhost:3000 showing the video player. Scrubbing through should show 4 colored screens with act titles at the correct timestamps.

- [ ] **Step 4: Commit**

```bash
git add video/src/Root.tsx video/src/Video.tsx
git commit -m "feat(video): add Root and Video composition shell with 4 scene placeholders"
```

---

### Task 4: FloatingOrbs Component

**Files:**
- Create: `video/src/components/FloatingOrbs.tsx`

- [ ] **Step 1: Create FloatingOrbs.tsx**

Create `video/src/components/FloatingOrbs.tsx`:

```tsx
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface Orb {
  x: number;       // initial x position (% of width)
  y: number;       // initial y position (% of height)
  size: number;    // diameter in px
  color: string;
  opacity: number;
  speed: number;   // movement multiplier
}

interface FloatingOrbsProps {
  orbs: Orb[];
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({orbs}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {orbs.map((orb, i) => {
        // Sinusoidal drift — each orb moves on its own path
        const xOffset = Math.sin(frame * 0.005 * orb.speed + i * 1.5) * 40;
        const yOffset = Math.cos(frame * 0.003 * orb.speed + i * 2.1) * 30;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              backgroundColor: orb.color,
              opacity: orb.opacity,
              filter: `blur(${orb.size * 0.4}px)`,
              transform: `translate(${xOffset}px, ${yOffset}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Verify in Remotion Studio**

Temporarily import FloatingOrbs into the Act 1 scene in `Video.tsx` to confirm orbs render and drift. Add this import and usage inside the problem `<Sequence>`:

```tsx
import {FloatingOrbs} from './components/FloatingOrbs';

// Inside the problem Sequence's AbsoluteFill, before the <h1>:
<FloatingOrbs orbs={[
  {x: 20, y: 30, size: 120, color: '#5F7A61', opacity: 0.15, speed: 1},
  {x: 70, y: 60, size: 80, color: '#D4735E', opacity: 0.12, speed: 1.3},
  {x: 50, y: 20, size: 100, color: '#E8AA6B', opacity: 0.1, speed: 0.8},
]} />
```

Open Remotion Studio, scrub through Act 1 — orbs should be visible and drifting smoothly.

- [ ] **Step 3: Revert the test import from Video.tsx** (scenes will add orbs themselves in later tasks)

- [ ] **Step 4: Commit**

```bash
git add video/src/components/FloatingOrbs.tsx
git commit -m "feat(video): add FloatingOrbs animated background component"
```

---

### Task 5: TypewriterText Component

**Files:**
- Create: `video/src/components/TypewriterText.tsx`

- [ ] **Step 1: Create TypewriterText.tsx**

Create `video/src/components/TypewriterText.tsx`:

```tsx
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame: number;        // frame when typing begins
  durationFrames: number;    // how many frames to type the full text
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  durationFrames,
  style = {},
  showCursor = true,
}) => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [startFrame, startFrame + durationFrames], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const visibleText = text.slice(0, charCount);
  const isTyping = frame >= startFrame && frame <= startFrame + durationFrames;
  const isDone = frame > startFrame + durationFrames;

  // Cursor blinks every 15 frames (0.5s at 30fps) after typing completes
  const cursorVisible = isTyping || (isDone && Math.floor(frame / 15) % 2 === 0);

  return (
    <span style={style}>
      {visibleText}
      {showCursor && cursorVisible && (
        <span style={{opacity: 0.7}}>|</span>
      )}
    </span>
  );
};
```

- [ ] **Step 2: Quick visual verification**

Temporarily add to any scene in Video.tsx to confirm it types text out. Remove after verifying.

- [ ] **Step 3: Commit**

```bash
git add video/src/components/TypewriterText.tsx
git commit -m "feat(video): add TypewriterText character-by-character animation"
```

---

### Task 6: GlassCard Component

**Files:**
- Create: `video/src/components/GlassCard.tsx`

- [ ] **Step 1: Create GlassCard.tsx**

Create `video/src/components/GlassCard.tsx`:

```tsx
import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

interface GlassCardProps {
  children: React.ReactNode;
  enterFrame: number;        // frame when this card springs in
  width?: number;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  enterFrame,
  width = 500,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: {damping: 12, stiffness: 100},
  });

  const translateY = (1 - progress) * 40;
  const opacity = progress;

  return (
    <div
      style={{
        width,
        padding: theme.spacing.lg,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: theme.radius.lg,
        transform: `translateY(${translateY}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add video/src/components/GlassCard.tsx
git commit -m "feat(video): add GlassCard frosted glass panel component"
```

---

### Task 7: PhoneRing Component

**Files:**
- Create: `video/src/components/PhoneRing.tsx`

- [ ] **Step 1: Create PhoneRing.tsx**

Create `video/src/components/PhoneRing.tsx`:

```tsx
import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {theme} from '../styles/theme';

interface PhoneRingProps {
  startFrame: number;
  label?: string;
}

export const PhoneRing: React.FC<PhoneRingProps> = ({
  startFrame,
  label = 'Sophie is calling...',
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  // Phone icon pulse
  const phoneScale = 1 + Math.sin(elapsed * 0.15) * 0.05;

  // Three expanding rings with staggered timing
  const rings = [0, 10, 20].map((delay) => {
    const ringElapsed = elapsed - delay;
    if (ringElapsed < 0) return null;

    const cycle = ringElapsed % 45; // each ring cycle is 1.5s
    const scale = interpolate(cycle, [0, 45], [1, 3], {extrapolateRight: 'clamp'});
    const opacity = interpolate(cycle, [0, 30, 45], [0.6, 0.2, 0], {extrapolateRight: 'clamp'});

    return {scale, opacity};
  });

  // Label fade in
  const labelOpacity = interpolate(elapsed, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
      <div style={{position: 'relative', width: 120, height: 120}}>
        {/* Pulsing rings */}
        {rings.map((ring, i) =>
          ring ? (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${theme.colors.secondary}`,
                opacity: ring.opacity,
                transform: `scale(${ring.scale})`,
              }}
            />
          ) : null
        )}
        {/* Phone icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${phoneScale})`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill={theme.colors.secondary}>
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
      </div>
      <span
        style={{
          fontFamily: theme.fonts.heading,
          fontSize: 28,
          color: theme.colors.text,
          opacity: labelOpacity,
        }}
      >
        {label}
      </span>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add video/src/components/PhoneRing.tsx
git commit -m "feat(video): add PhoneRing pulsing animation component"
```

---

### Task 8: ChatBubble Component

**Files:**
- Create: `video/src/components/ChatBubble.tsx`

- [ ] **Step 1: Create ChatBubble.tsx**

Create `video/src/components/ChatBubble.tsx`:

```tsx
import React from 'react';
import {useCurrentFrame, spring, interpolate, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

interface ChatBubbleProps {
  speaker: 'sophie' | 'maggie';
  text: string;
  enterFrame: number;
  avatarSrc?: string;
  typingDurationFrames?: number; // frames for typing indicator before text appears
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  speaker,
  text,
  enterFrame,
  avatarSrc,
  typingDurationFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = frame - enterFrame;
  if (elapsed < 0) return null;

  // Slide-in animation
  const slideProgress = spring({
    frame: elapsed,
    fps,
    config: {damping: 14, stiffness: 120},
  });

  const translateX = (1 - slideProgress) * -60;
  const opacity = slideProgress;

  // Typing indicator phase
  const isTyping = elapsed < typingDurationFrames;

  // Text reveal after typing indicator
  const textElapsed = elapsed - typingDurationFrames;
  const revealFrames = text.length * 1.2; // ~1.2 frames per character
  const charCount = isTyping
    ? 0
    : Math.floor(
        interpolate(textElapsed, [0, revealFrames], [0, text.length], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      );

  const isSophie = speaker === 'sophie';
  const accentColor = isSophie ? theme.colors.primary : theme.colors.secondary;
  const speakerName = isSophie ? 'Sophie' : 'Maggie';

  // Typing dots animation
  const dotOpacity = (dotIndex: number) => {
    const cycle = (elapsed * 4 + dotIndex * 8) % 30;
    return interpolate(cycle, [0, 10, 20, 30], [0.3, 1, 0.3, 0.3]);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        transform: `translateX(${translateX}px)`,
        opacity,
        maxWidth: 800,
      }}
    >
      {/* Avatar */}
      {avatarSrc ? (
        <img
          src={avatarSrc}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            flexShrink: 0,
          }}
        />
      )}

      {/* Bubble */}
      <div>
        <div
          style={{
            fontSize: 16,
            fontFamily: theme.fonts.body,
            fontWeight: 600,
            color: accentColor,
            marginBottom: 6,
          }}
        >
          {speakerName}
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            borderLeft: `3px solid ${accentColor}`,
            fontFamily: theme.fonts.body,
            fontSize: 22,
            color: theme.colors.text,
            lineHeight: 1.5,
            minHeight: 32,
          }}
        >
          {isTyping ? (
            <div style={{display: 'flex', gap: 6, padding: '4px 0'}}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    opacity: dotOpacity(i),
                  }}
                />
              ))}
            </div>
          ) : (
            text.slice(0, charCount)
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add video/src/components/ChatBubble.tsx
git commit -m "feat(video): add ChatBubble with typing indicator and text reveal"
```

---

### Task 9: Act 1 — ProblemScene

**Files:**
- Create: `video/src/scenes/ProblemScene.tsx`

- [ ] **Step 1: Create ProblemScene.tsx**

Create `video/src/scenes/ProblemScene.tsx`:

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Stat cards that fade in/out sequentially
const STATS = [
  {text: '43% of seniors\nreport feeling lonely', from: 1 * FPS, to: 8 * FPS},
  {text: 'Over 8 million\nlive completely alone', from: 8 * FPS, to: 15 * FPS},
  {text: 'For their families...\nthere\'s the worry.', from: 15 * FPS, to: 22 * FPS},
];

const ORBS = [
  {x: 15, y: 25, size: 120, color: theme.colors.primary, opacity: 0.12, speed: 0.8},
  {x: 75, y: 65, size: 90, color: theme.colors.secondary, opacity: 0.08, speed: 1.1},
  {x: 45, y: 15, size: 100, color: theme.colors.accent, opacity: 0.06, speed: 0.6},
  {x: 80, y: 20, size: 70, color: theme.colors.primary, opacity: 0.1, speed: 1.3},
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bgDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FloatingOrbs orbs={ORBS} />

      {/* Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Stat text that fades between statements */}
      {STATS.map((stat, i) => {
        const fadeIn = interpolate(frame, [stat.from, stat.from + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(frame, [stat.to - 15, stat.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const translateY = interpolate(frame, [stat.from, stat.from + 20], [20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              opacity,
              transform: `translateY(${translateY}px)`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 56,
                color: theme.colors.textLight,
                lineHeight: 1.4,
                whiteSpace: 'pre-line',
              }}
            >
              {stat.text}
            </div>
          </div>
        );
      })}

      {/* Scene fade out */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: theme.colors.bgDark,
          opacity: interpolate(frame, [23 * FPS, 25 * FPS], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Wire ProblemScene into Video.tsx**

In `video/src/Video.tsx`, replace the Act 1 placeholder content. Replace the import and the problem `<Sequence>` content:

```tsx
import {ProblemScene} from './scenes/ProblemScene';

// Inside the problem Sequence, replace the AbsoluteFill placeholder:
<ProblemScene />
```

- [ ] **Step 3: Verify in Remotion Studio**

Open Studio, scrub frames 0-750. Should see dark background with floating orbs and three stat texts fading in/out sequentially.

- [ ] **Step 4: Commit**

```bash
git add video/src/scenes/ProblemScene.tsx video/src/Video.tsx
git commit -m "feat(video): implement Act 1 ProblemScene with stats and floating orbs"
```

---

### Task 10: Act 2 — SolutionScene

**Files:**
- Create: `video/src/scenes/SolutionScene.tsx`
- Modify: `video/src/Video.tsx`

- [ ] **Step 1: Create SolutionScene.tsx**

Create `video/src/scenes/SolutionScene.tsx`:

```tsx
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {PhoneRing} from '../components/PhoneRing';
import {ChatBubble} from '../components/ChatBubble';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 10, y: 40, size: 100, color: theme.colors.primary, opacity: 0.08, speed: 0.7},
  {x: 85, y: 20, size: 80, color: theme.colors.accent, opacity: 0.1, speed: 1.0},
  {x: 60, y: 75, size: 110, color: theme.colors.secondary, opacity: 0.06, speed: 0.9},
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: Logo + intro text (0-12s within scene = frames 0-360)
  const logoScale = spring({frame, fps, config: {damping: 12, stiffness: 80}});

  // Phase 2: Phone ringing (12-15s = frames 360-450)
  const phoneEnterFrame = 10 * FPS;

  // Phase 3: Sophie chat bubble (15-22s = frames 450-660)
  const sophieBubbleFrame = 15 * FPS;

  // Phase 4: "No apps" tagline (21-28s = frames 630-840)
  const taglineFrame = 21 * FPS;
  const taglineOpacity = interpolate(frame, [taglineFrame, taglineFrame + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo/title fade out as phone appears
  const titleOpacity = interpolate(frame, [phoneEnterFrame - 15, phoneEnterFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phone fade out as chat appears
  const phoneOpacity = interpolate(
    frame,
    [sophieBubbleFrame - 10, sophieBubbleFrame],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Chat fade out as tagline appears
  const chatOpacity = interpolate(frame, [taglineFrame - 10, taglineFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Logo entrance */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          opacity: titleOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 200}} />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 52,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Lonesome No More
        </h1>
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 26,
            color: theme.colors.text,
            opacity: 0.7,
            margin: 0,
          }}
        >
          A companion who calls your loved one by name
        </p>
      </div>

      {/* Phase 2: Phone ringing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phoneOpacity,
        }}
      >
        <PhoneRing startFrame={phoneEnterFrame} />
      </div>

      {/* Phase 3: Sophie chat bubble */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 200px',
          opacity: chatOpacity,
        }}
      >
        <ChatBubble
          speaker="sophie"
          text="Good morning, Maggie! Did Emma ever get the hang of that bicycle?"
          enterFrame={sophieBubbleFrame}
          avatarSrc={staticFile('sophie.jpg')}
        />
      </div>

      {/* Phase 4: "No apps" tagline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: taglineOpacity,
          gap: 16,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 48,
            color: theme.colors.text,
            textAlign: 'center',
            margin: 0,
          }}
        >
          No apps. No tablets. No learning curve.
        </h2>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            color: theme.colors.secondary,
            margin: 0,
          }}
        >
          Just pick up the phone.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Wire SolutionScene into Video.tsx**

Replace the Act 2 placeholder in `video/src/Video.tsx`:

```tsx
import {SolutionScene} from './scenes/SolutionScene';

// Replace the solution Sequence content:
<SolutionScene />
```

- [ ] **Step 3: Verify in Remotion Studio**

Scrub through frames 750-1650. Should see: logo springs in → phone rings → Sophie chat bubble slides in with typing dots then text → "No apps" tagline fades in.

- [ ] **Step 4: Commit**

```bash
git add video/src/scenes/SolutionScene.tsx video/src/Video.tsx video/public/
git commit -m "feat(video): implement Act 2 SolutionScene with logo, phone ring, chat bubble"
```

---

### Task 11: Act 3 — ExperienceScene

**Files:**
- Create: `video/src/scenes/ExperienceScene.tsx`
- Modify: `video/src/Video.tsx`

- [ ] **Step 1: Create ExperienceScene.tsx**

Create `video/src/scenes/ExperienceScene.tsx`:

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, staticFile} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {GlassCard} from '../components/GlassCard';
import {ChatBubble} from '../components/ChatBubble';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 20, y: 30, size: 90, color: theme.colors.accent, opacity: 0.12, speed: 0.9},
  {x: 70, y: 60, size: 110, color: theme.colors.secondary, opacity: 0.08, speed: 0.7},
  {x: 50, y: 80, size: 80, color: theme.colors.primary, opacity: 0.1, speed: 1.2},
];

const FEATURES = [
  {
    title: 'Truly Personalized',
    description: 'Remembers their life story, interests, and family',
    icon: '💛',
    enterFrame: 2 * FPS,
  },
  {
    title: 'Available 24/7',
    description: 'Call anytime, on any phone, from anywhere',
    icon: '📞',
    enterFrame: 5 * FPS,
  },
  {
    title: 'Effortlessly Simple',
    description: 'No apps, no tablets — just a phone call',
    icon: '✨',
    enterFrame: 8 * FPS,
  },
];

export const ExperienceScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Feature cards (0-15s within scene)
  const cardsOpacity = interpolate(frame, [13 * FPS, 14 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Sophie chat bubble (13-22s within scene)
  const sophieBubbleFrame = 13 * FPS;
  const chatOpacity = interpolate(
    frame,
    [sophieBubbleFrame, sophieBubbleFrame + 10, 25 * FPS, 26 * FPS],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Phase 3: "Available 24/7" closing text (24-30s within scene)
  const closingFrame = 24 * FPS;
  const closingOpacity = interpolate(frame, [closingFrame, closingFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgSoft}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Feature cards */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 120px',
          opacity: cardsOpacity,
        }}
      >
        {FEATURES.map((feature, i) => (
          <GlassCard
            key={i}
            enterFrame={feature.enterFrame}
            width={420}
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: `1px solid rgba(95,122,97,0.15)`,
              textAlign: 'center',
              padding: 32,
            }}
          >
            <div style={{fontSize: 48, marginBottom: 16}}>{feature.icon}</div>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: 28,
                color: theme.colors.primary,
                margin: '0 0 8px',
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 20,
                color: theme.colors.text,
                opacity: 0.8,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {feature.description}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Phase 2: Sophie chat */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 200px',
          opacity: chatOpacity,
        }}
      >
        <ChatBubble
          speaker="sophie"
          text="You mentioned you were trying that new mystery novel. How's the detective — still one step behind?"
          enterFrame={sophieBubbleFrame}
          avatarSrc={staticFile('sophie.jpg')}
        />
      </div>

      {/* Phase 3: Closing text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: closingOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 48,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Available twenty-four seven.
        </h2>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            color: theme.colors.secondary,
            margin: '16px 0 0',
          }}
        >
          Your loved one is never alone.
        </p>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Wire ExperienceScene into Video.tsx**

Replace the Act 3 placeholder:

```tsx
import {ExperienceScene} from './scenes/ExperienceScene';

// Replace the experience Sequence content:
<ExperienceScene />
```

- [ ] **Step 3: Verify in Remotion Studio**

Scrub through frames 1650-2550. Should see: three feature cards spring in sequentially → Sophie chat bubble → closing text.

- [ ] **Step 4: Commit**

```bash
git add video/src/scenes/ExperienceScene.tsx video/src/Video.tsx
git commit -m "feat(video): implement Act 3 ExperienceScene with feature cards and chat"
```

---

### Task 12: Act 4 — PeaceOfMindScene

**Files:**
- Create: `video/src/scenes/PeaceOfMindScene.tsx`
- Modify: `video/src/Video.tsx`

- [ ] **Step 1: Create PeaceOfMindScene.tsx**

Create `video/src/scenes/PeaceOfMindScene.tsx`:

```tsx
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {GlassCard} from '../components/GlassCard';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

const ORBS = [
  {x: 30, y: 40, size: 100, color: theme.colors.primary, opacity: 0.1, speed: 0.6},
  {x: 65, y: 25, size: 80, color: theme.colors.accent, opacity: 0.12, speed: 0.8},
  {x: 50, y: 70, size: 90, color: theme.colors.secondary, opacity: 0.08, speed: 1.0},
];

// Simulated weekly summary highlights
const HIGHLIGHTS = [
  'Talked about Emma\'s first bike ride',
  'Discussed the new mystery novel',
  'Played Chopin\'s Nocturne on the piano',
];

export const PeaceOfMindScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: Summary card (0-7s within scene)
  const summaryCardFrame = 1 * FPS;
  const summaryOpacity = interpolate(frame, [8 * FPS, 9 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Brand moment + CTA (8-15s within scene)
  const ctaFrame = 9 * FPS;
  const ctaProgress = spring({
    frame: frame - ctaFrame,
    fps,
    config: {damping: 14, stiffness: 80},
  });
  const ctaOpacity = frame >= ctaFrame ? ctaProgress : 0;

  return (
    <AbsoluteFill style={{backgroundColor: theme.colors.bgWarm}}>
      <FloatingOrbs orbs={ORBS} />

      {/* Phase 1: Weekly summary mockup */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: summaryOpacity,
        }}
      >
        <GlassCard
          enterFrame={summaryCardFrame}
          width={600}
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(95,122,97,0.12)',
            padding: 40,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: theme.colors.primary,
              marginBottom: 8,
            }}
          >
            Weekly Summary
          </div>
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: 28,
              color: theme.colors.text,
              margin: '0 0 20px',
            }}
          >
            Maggie had a wonderful week
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {HIGHLIGHTS.map((highlight, i) => {
              const itemOpacity = interpolate(
                frame,
                [summaryCardFrame + (i + 1) * 20, summaryCardFrame + (i + 1) * 20 + 15],
                [0, 1],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
              );
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: itemOpacity,
                    fontFamily: theme.fonts.body,
                    fontSize: 20,
                    color: theme.colors.text,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.accent,
                      flexShrink: 0,
                    }}
                  />
                  {highlight}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Phase 2: Brand moment + CTA */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          opacity: ctaOpacity,
          transform: `scale(${0.9 + ctaProgress * 0.1})`,
        }}
      >
        <Img src={staticFile('logo.png')} style={{width: 160, marginBottom: 8}} />
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 44,
            color: theme.colors.primary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          Companionship for your loved ones.
        </h1>
        <p
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 32,
            color: theme.colors.secondary,
            margin: 0,
          }}
        >
          Peace of mind for you.
        </p>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: theme.colors.accent,
            borderRadius: 2,
            margin: '8px 0',
          }}
        />

        {/* Contact info */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            fontFamily: theme.fonts.body,
            fontSize: 24,
            color: theme.colors.text,
          }}
        >
          <span>(833) 817-4646</span>
          <span>lonesomenomore.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Wire PeaceOfMindScene into Video.tsx**

Replace the Act 4 placeholder:

```tsx
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

// Replace the peaceOfMind Sequence content:
<PeaceOfMindScene />
```

- [ ] **Step 3: Verify in Remotion Studio**

Scrub through frames 2550-3000. Should see: summary card with highlights appearing one by one → brand moment with logo, tagline, and CTA.

- [ ] **Step 4: Commit**

```bash
git add video/src/scenes/PeaceOfMindScene.tsx video/src/Video.tsx
git commit -m "feat(video): implement Act 4 PeaceOfMindScene with summary card and CTA"
```

---

### Task 13: Scene Transitions in Video.tsx

**Files:**
- Modify: `video/src/Video.tsx`

- [ ] **Step 1: Add cross-fade transitions between scenes**

Update `video/src/Video.tsx` to wrap each scene with opacity transitions. Replace the full file content:

```tsx
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {ProblemScene} from './scenes/ProblemScene';
import {SolutionScene} from './scenes/SolutionScene';
import {ExperienceScene} from './scenes/ExperienceScene';
import {PeaceOfMindScene} from './scenes/PeaceOfMindScene';

const FPS = 30;
const TRANSITION = 30; // 1 second cross-fade
const HALF = TRANSITION / 2; // 15 frames overlap each side

// Scene boundaries (nominal, before overlap adjustment)
const SCENES = [
  {Component: ProblemScene, from: 0, duration: 25 * FPS},
  {Component: SolutionScene, from: 25 * FPS, duration: 30 * FPS},
  {Component: ExperienceScene, from: 55 * FPS, duration: 30 * FPS},
  {Component: PeaceOfMindScene, from: 85 * FPS, duration: 15 * FPS},
];

const SceneWithTransition: React.FC<{
  children: React.ReactNode;
  isFirst: boolean;
  isLast: boolean;
  durationInFrames: number;
}> = ({children, isFirst, isLast, durationInFrames}) => {
  const frame = useCurrentFrame();

  // Fade in (skip for first scene)
  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, HALF], [0, 1], {extrapolateRight: 'clamp'});

  // Fade out (skip for last scene)
  const fadeOut = isLast
    ? 1
    : interpolate(
        frame,
        [durationInFrames - HALF, durationInFrames],
        [1, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );

  const opacity = Math.min(fadeIn, fadeOut);

  // Vertical shift for parallax effect
  const shiftIn = isFirst
    ? 0
    : interpolate(frame, [0, HALF], [10, 0], {extrapolateRight: 'clamp'});
  const shiftOut = isLast
    ? 0
    : interpolate(
        frame,
        [durationInFrames - HALF, durationInFrames],
        [0, -10],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
      );

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${shiftIn + shiftOut}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {SCENES.map(({Component, from, duration}, i) => {
        // Extend scenes by HALF frames on each side for overlap
        const adjustedFrom = i === 0 ? from : from - HALF;
        const adjustedDuration =
          duration + (i === 0 ? 0 : HALF) + (i === SCENES.length - 1 ? 0 : HALF);

        return (
          <Sequence key={i} from={adjustedFrom} durationInFrames={adjustedDuration}>
            <SceneWithTransition
              isFirst={i === 0}
              isLast={i === SCENES.length - 1}
              durationInFrames={adjustedDuration}
            >
              <Component />
            </SceneWithTransition>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Verify in Remotion Studio**

Scrub at scene boundaries (frames ~750, ~1650, ~2550). Should see smooth 1-second cross-fades with subtle vertical parallax shift.

- [ ] **Step 3: Commit**

```bash
git add video/src/Video.tsx
git commit -m "feat(video): add cross-fade transitions between all scenes"
```

---

### Task 14: ElevenLabs Audio Generation Script

**Files:**
- Create: `video/scripts/generate-audio.ts`
- Create: `video/.env` (from .env.example, with actual API key)

- [ ] **Step 1: Create the .env file**

Copy the example and add your API key:

```bash
cp video/.env.example video/.env
```

Then edit `video/.env` and paste your ElevenLabs API key.

- [ ] **Step 2: Create generate-audio.ts**

Create `video/scripts/generate-audio.ts`:

```typescript
import {ElevenLabsClient} from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ScriptSegment {
  id: string;
  scene: string;
  voice: 'narrator' | 'sophie';
  text: string;
  start_seconds: number;
}

interface Script {
  narrator_voice: string;
  sophie_voice: string;
  segments: ScriptSegment[];
}

interface ManifestEntry {
  id: string;
  file: string;
  duration_seconds: number;
  start_seconds: number;
}

const AUDIO_DIR = path.join(__dirname, '..', 'src', 'assets', 'audio');
const SCRIPT_PATH = path.join(__dirname, '..', 'src', 'assets', 'script.json');

async function getVoiceId(client: ElevenLabsClient, voiceName: string): Promise<string> {
  const voices = await client.voices.getAll();
  const match = voices.voices.find(
    (v) => v.name?.toLowerCase() === voiceName.toLowerCase()
  );
  if (match) return match.voice_id;

  // If exact match not found, list available voices and exit
  console.log(`\nVoice "${voiceName}" not found. Available voices:`);
  for (const v of voices.voices.slice(0, 20)) {
    console.log(`  - ${v.name} (${v.voice_id})`);
  }
  throw new Error(`Voice "${voiceName}" not found. Update script.json with an available voice name.`);
}

async function generateSegment(
  client: ElevenLabsClient,
  voiceId: string,
  segment: ScriptSegment
): Promise<ManifestEntry> {
  const outputPath = path.join(AUDIO_DIR, `${segment.id}.mp3`);

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`  Skipping ${segment.id} (already exists)`);
    const stats = fs.statSync(outputPath);
    // Rough estimate: MP3 at 128kbps ≈ 16KB/sec
    const estimatedDuration = stats.size / 16000;
    return {
      id: segment.id,
      file: `${segment.id}.mp3`,
      duration_seconds: Math.round(estimatedDuration * 10) / 10,
      start_seconds: segment.start_seconds,
    };
  }

  console.log(`  Generating ${segment.id}: "${segment.text.slice(0, 50)}..."`);

  const audio = await client.textToSpeech.convert(voiceId, {
    text: segment.text,
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_128',
  });

  // Collect chunks from the readable stream
  const chunks: Buffer[] = [];
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  fs.writeFileSync(outputPath, buffer);

  // Estimate duration from file size (MP3 128kbps ≈ 16KB/sec)
  const estimatedDuration = buffer.length / 16000;

  console.log(`  Saved ${segment.id}.mp3 (~${estimatedDuration.toFixed(1)}s)`);

  return {
    id: segment.id,
    file: `${segment.id}.mp3`,
    duration_seconds: Math.round(estimatedDuration * 10) / 10,
    start_seconds: segment.start_seconds,
  };
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Error: ELEVENLABS_API_KEY not set in .env');
    process.exit(1);
  }

  const client = new ElevenLabsClient({apiKey});

  // Read script
  const script: Script = JSON.parse(fs.readFileSync(SCRIPT_PATH, 'utf-8'));
  console.log(`Loaded script with ${script.segments.length} segments`);

  // Ensure output directory exists
  fs.mkdirSync(AUDIO_DIR, {recursive: true});

  // Resolve voice IDs
  console.log(`\nResolving voice: ${script.narrator_voice}`);
  const narratorVoiceId = await getVoiceId(client, script.narrator_voice);
  console.log(`  Found: ${narratorVoiceId}`);

  console.log(`Resolving voice: ${script.sophie_voice}`);
  const sophieVoiceId = await getVoiceId(client, script.sophie_voice);
  console.log(`  Found: ${sophieVoiceId}`);

  // Generate audio for each segment
  console.log('\nGenerating audio segments...');
  const manifest: ManifestEntry[] = [];

  for (const segment of script.segments) {
    const voiceId = segment.voice === 'narrator' ? narratorVoiceId : sophieVoiceId;
    const entry = await generateSegment(client, voiceId, segment);
    manifest.push(entry);
  }

  // Write manifest
  const manifestPath = path.join(AUDIO_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({entries: manifest}, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);
  console.log('Done! Audio files are in src/assets/audio/');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
```

- [ ] **Step 3: Run the script to generate audio**

```bash
cd video && npx tsx scripts/generate-audio.ts
```

Expected: generates 8 MP3 files in `src/assets/audio/` and a `manifest.json`. If a voice name isn't found, it lists available voices — update `script.json` and re-run.

- [ ] **Step 4: Commit the script (not the generated audio)**

```bash
git add video/scripts/generate-audio.ts
git commit -m "feat(video): add ElevenLabs audio generation script"
```

---

### Task 15: Wire Audio into Video Composition

**Files:**
- Modify: `video/src/Video.tsx`

- [ ] **Step 1: Copy generated audio files to public/ for Remotion**

After running generate-audio.ts, copy the MP3s so Remotion can serve them via `staticFile()`:

```bash
mkdir -p video/public/audio
cp video/src/assets/audio/*.mp3 video/public/audio/
```

- [ ] **Step 2: Add Audio layers to Video.tsx**

Add audio imports and `<Audio>` components to the composition. Update `video/src/Video.tsx` — add these imports at the top:

```tsx
import {Audio} from 'remotion';
```

Then inside the `Video` component's `<AbsoluteFill>`, after all the `<Sequence>` blocks, add audio sequences:

```tsx
{/* Audio layers */}
<Sequence from={0} durationInFrames={25 * FPS}>
  <Audio src={staticFile('audio/act1-narration.mp3')} />
</Sequence>
<Sequence from={25 * FPS}>
  <Audio src={staticFile('audio/act2-narration-1.mp3')} />
</Sequence>
<Sequence from={40 * FPS}>
  <Audio src={staticFile('audio/act2-sophie.mp3')} />
</Sequence>
<Sequence from={46 * FPS}>
  <Audio src={staticFile('audio/act2-narration-2.mp3')} />
</Sequence>
<Sequence from={55 * FPS}>
  <Audio src={staticFile('audio/act3-narration-1.mp3')} />
</Sequence>
<Sequence from={68 * FPS}>
  <Audio src={staticFile('audio/act3-sophie.mp3')} />
</Sequence>
<Sequence from={76 * FPS}>
  <Audio src={staticFile('audio/act3-narration-2.mp3')} />
</Sequence>
<Sequence from={85 * FPS}>
  <Audio src={staticFile('audio/act4-narration.mp3')} />
</Sequence>
```

Also add the `staticFile` import if not already present:

```tsx
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, Audio, staticFile} from 'remotion';
```

- [ ] **Step 3: Verify in Remotion Studio**

Play through the video in Studio. Audio should play at the correct timestamps, synced to the visual scenes.

- [ ] **Step 4: Commit**

```bash
git add video/src/Video.tsx
git commit -m "feat(video): wire audio narration and Sophie snippets into composition"
```

---

### Task 16: Render Final Video & Verify

**Files:** None (verification only)

- [ ] **Step 1: Render the video**

```bash
cd video && mkdir -p out && npx remotion render Video --output out/lonesome-no-more.mp4
```

Expected: renders a ~100 second MP4 at 1920x1080 to `video/out/lonesome-no-more.mp4`.

- [ ] **Step 2: Watch the rendered video**

Open `video/out/lonesome-no-more.mp4` in a media player. Verify:
- All 4 acts play in sequence with smooth transitions
- Audio narration and Sophie snippets are synced to visuals
- Brand colors and fonts are correct
- Floating orbs animate smoothly
- Feature cards spring in correctly
- Chat bubbles show typing indicator then text
- CTA at the end shows phone number and website

- [ ] **Step 3: Note any timing adjustments needed**

If audio and visuals are misaligned, adjust `start_seconds` in `script.json` or the frame constants in scene components. Re-render after changes.

- [ ] **Step 4: Final commit**

```bash
git add video/ && git commit -m "feat(video): complete Remotion explainer video v1"
```
