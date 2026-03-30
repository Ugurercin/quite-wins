# Quiet Wins — CLAUDE.md

> "The small stuff adds up."

A mobile app for logging daily wins and watching them grow into a beautiful garden. Simple, emotional, permanent.

This file is the single source of truth for the entire project. Read it fully before writing any code.

---

## Core Concept

Users log 1–3 wins per day (text + emoji). Each win contributes to a plant in their garden. Plants grow through 4 stages — fully blooming at 4 logs. The garden is a permanent, visual record of everything they've ever accomplished.

---

## Platform & Tech Stack

- **Platforms:** iOS + Android (both from day one)
- **Framework:** React Native via Expo
- **Graphics/Animation:** React Native Skia (garden rendering + plant animations)
- **Animations:** React Native Reanimated (plant bloom, sheet transitions)
- **Storage:** AsyncStorage or SQLite (local, no backend needed)
- **Notifications:** expo-notifications
- **Audio:** expo-av (background music + SFX)

---

## Monetization

- **Free:** Garden visualization + Grove scene only
- **$1.99 one-time IAP:** Unlocks all visualizations (constellation, wall of bricks, heat map)
- **Scenes:** Paid — future scenes are separate purchases (price TBD)
- No subscription. Ever.
- Paywall copy: *"Unlock everything — $1.99. No subscription, ever. Just a one-time thanks."*

---

## Visualizations

| Name | Free? | Description |
|------|-------|-------------|
| Garden | ✅ Free | Plants grow from center outward, bloom at 4 logs |
| Constellation | 💰 Paid | Each win is a star, builds your personal sky |
| Wall of bricks | 💰 Paid | Each win adds a brick, wall grows taller |
| Heat map | 💰 Paid | GitHub-style grid, darker = more wins |

---

## Win Logging

- **How many:** 1–3 wins per day
- **When:** Anytime — log wins as they happen
- **Format:** Text + emoji
- **UI:** Bottom sheet slides up over the garden. Garden still visible behind it.
- **Fields:** Text input + emoji quick-pick row + "Plant it" button
- **Cap:** At 3 wins, "+" still visible but tapping shows: *"You've planted 3 wins today. Come back tomorrow."*

---

## Garden Logic

### Plant Growth Stages
Every 4 wins in a slot = one fully bloomed plant.

| Log # | Stage | Description |
|-------|-------|-------------|
| 1 | Sprout | Tiny stem and bud, just appeared |
| 2 | Seedling | Small plant, first leaves appear |
| 3 | Growing | Fuller, bushier, getting beautiful |
| 4 | Bloomed | Fully flowering, most beautiful state |

- When stage 4 is reached → **bloom animation plays** (petals open, ~2 seconds)
- After bloom → new plant slot opens beside it, cycle restarts
- Garden fits **8–10 plant slots max**
- All plant positions are **pre-calculated** at build time, spiraling outward from center
- No random placement, no collision detection — just next position in the list

### Garden Fullness & Seasons
- 8–10 slots × 4 logs = **32–40 total wins** fills the garden
- Full garden → **Season ends**
- Old garden saved as a snapshot (Season 1, Season 2, etc.) — viewable anytime
- New season starts fresh with empty garden
- Each season = a chapter of your life

### Visual Detail
- Tiny colored flowers on ground = emoji color from your win
- Older bloomed plants sit in center, newer sprouts at edges
- Today's win gets a subtle label on first open

---

## Deleting a Win

### Rules
- Users can delete any win from the history screen or from the plant detail popup
- Deleting a win **reduces that plant's stage by one**
- The plant shrinks back with a smooth reverse animation (~1 second)
- If a plant drops from stage 1 back to 0 wins → the plant disappears from the garden entirely (small fade-out animation)
- Wins from previous days can also be deleted — the garden always reflects the true total

### Delete Flow
1. User opens history screen or taps a plant
2. Swipe left on a win card → red delete button appears
3. Tap delete → confirmation: *"Remove this win? Your plant will shrink."*
4. Confirm → win deleted, plant animates to previous stage
5. If plant disappears → the garden slot closes, remaining plants do NOT rearrange (gaps are fine — they show where something was)

### Why gaps are okay
Rearranging plants after a delete would be confusing and feel punishing. A small gap where a plant used to be is honest — it shows something was there. Over time new wins fill the space naturally.

### Streak recalculation
- Deleting a win may break a streak if it was the only win on that day
- Streak is recalculated silently after every delete
- No dramatic warning — just updates the number

---

## History Screen

### Access
1. **Tap a plant** — popup card shows win text, emoji, date, time, streak day
2. **History screen** — full scrollable list grouped by date, accessible from garden screen via icon in top corner

### Layout
- Reverse chronological (newest first)
- Grouped by day with date header
- Each win shows: emoji + text + time logged
- Swipe left to delete
- Empty days are not shown — only days with at least one win

### Today's wins
- Tapping the history icon defaults to today's date, scrolled to top
- Today's wins are always visible at the top of the list
- Makes it easy to review and delete same-day entries

---

## Stats (always visible on garden screen)
- Current streak (days in a row)
- Total wins (lifetime count)

---

## Onboarding (4 screens, under 60 seconds)

| Screen | Content |
|--------|---------|
| 1 — Hook | App name, tagline, "Get started" button. Nothing else. |
| 2 — One question | "When should we remind you?" Morning / Evening / Custom / Skip |
| 3 — First win | "What's one thing you did today?" Text + emoji. "Plant it" button. |
| 4 — Garden blooms | First plant appears. Stats show 1 win, 1 day streak. "Go to my garden" button. |

---

## Notifications

- User sets their own time during onboarding
- One notification per day
- Copy direction: dark humor, self-aware, zero guilt
- Example tone: *"I'm a broke dev. You're a broke student. One of us should help the other. Statistically it should be you."*

---

## Screens Summary

1. **Onboarding** (4 screens — one time only)
2. **Garden** (main screen — garden + stats + "+" button)
3. **Log win** (bottom sheet over garden)
4. **History** (scrollable list, grouped by date, swipe to delete)
5. **Plant detail** (popup on tap, delete option)
6. **Season archive** (past seasons as snapshots)
7. **Unlock screen** (paywall — other visualizations)
8. **Settings** (notification time, theme toggle, music/SFX toggles)

---

## Phases

### Phase 1 — Core loop ✅ COMPLETE
- Onboarding (all 4 screens)
- Garden screen (static, no animation yet)
- Log win bottom sheet
- Plant growth logic (4 stages)
- Local storage

### Phase 2 — Garden comes alive ✅ COMPLETE
- Plant growth animations
- Bloom animation (stage 4)
- New plant appearing animation
- Tap a plant → popup
- Delete win → plant shrink animation

### Phase 3 — History & stats ✅ COMPLETE
- History screen with swipe-to-delete
- Season logic + season archive
- Streak + total wins recalculation on delete

### Phase 4 — Polish & monetization
- Other visualizations (constellation, bricks, heat map)
- IAP integration ($1.99 unlock)
- Notification system
- Scene switcher UI (how user picks a scene — TBD)
- App Store assets + submission

---

## Open Questions (to decide later)
- App icon design
- Font choice
- App Store keywords + description
- Whether to add a share/screenshot feature for gardens
- How user switches scenes (settings screen / dedicated shop / long press)

---

---

# Audio System

## Library
**`expo-av`** — handles background music (looping) and one-shot SFX.

## Behavior rules
- **Respects device silent mode** — if phone is muted, all audio off, no override (`playsInSilentModeIOS: false`)
- Music and SFX have **separate controls** — each can be toggled independently
- Music **crossfades** between contexts (300ms fade out → fade in) — never hard cuts
- Audio **pauses when app backgrounds**, resumes on foreground
- Default: both on, silenced if device is on silent

## File structure
```
src/
  audio/
    useAudio.ts       ← hook: playMusic(context), playSFX(name), crossfadeTo, stopMusic
    tracks.ts         ← ALL audio file paths live here — change paths here to swap sounds

assets/
  audio/
    music/
      onboarding.mp3  ← plays during all 4 onboarding steps
      grove.mp3       ← (add when ready) grove main screen music
    sfx/
      level_up.mp3    ← tap sound — fires immediately on "Plant it" press
      tree_grow.mp3   ← grow sound — fires 400ms after plant it (gives plant time to appear)
```

## tracks.ts — the swap file
All audio paths are defined in `src/audio/tracks.ts`. **To experiment with a different sound, change the path in this file only.** Never hardcode audio paths anywhere else.

```typescript
export const MUSIC_TRACKS = {
  onboarding: require('../../assets/audio/music/onboarding.mp3'),
  // grove: require('../../assets/audio/music/grove.mp3'),
}

export const SFX_TRACKS = {
  tap:       require('../../assets/audio/sfx/level_up.mp3'),   // swap to try different tap sounds
  tree_grow: require('../../assets/audio/sfx/tree_grow.mp3'),  // swap to try different grow sounds
}
```

## useAudio hook API
```typescript
const { playMusic, crossfadeTo, playSFX, stopMusic } = useAudio()

crossfadeTo('onboarding')   // fade to a music context
playSFX('tap')              // one-shot SFX
stopMusic()                 // stop and unload current music
```

## Where audio is wired
| Location | What plays |
|----------|-----------|
| `OnboardingScreen.tsx` — mount | `playMusic('onboarding')` starts |
| `OnboardingScreen.tsx` — unmount | `stopMusic()` — cleanup on exit |
| `LogWinSheet.tsx` — "Plant it" tap | `playSFX('tap')` immediately |
| `LogWinSheet.tsx` — 400ms after tap | `playSFX('tree_grow')` |

## Adding more audio later
1. Drop the `.mp3` file into `assets/audio/music/` or `assets/audio/sfx/`
2. Add the entry to `tracks.ts`
3. Call `crossfadeTo('grove')` in `GardenScreen` or `playSFX('bloom')` in `PlantNode` etc.

## Storage keys for settings
```typescript
MUSIC_ENABLED: 'qw_music_enabled',   // boolean, default true
SFX_ENABLED:   'qw_sfx_enabled',     // boolean, default true
```

---

---

# Scene System

## Concept
A **scene** is a self-contained visual + audio package. The current garden becomes the **Grove** scene. Adding a new scene in the future means creating one folder — no rewiring of the app needed.

Each scene owns: its plant colors, its background visuals, its music, and its canvas renderer.

## Scene registry
```
src/
  scenes/
    types.ts              ← Scene and SceneColors interfaces — the contract
    index.ts              ← Registry: SCENES[], DEFAULT_SCENE, getSceneById()
    grove/
      index.ts            ← Grove scene object
      colors.ts           ← Grove colors derived from theme
      music.ts            ← Grove music file reference
      GardenCanvas.tsx    ← Grove canvas renderer
      GardenBackground.tsx ← Grove background (sky, clouds, grass, butterflies, etc.)
      plants/
        Sprout.tsx
        Seedling.tsx
        Growing.tsx
        Bloomed.tsx
        ElderTree.tsx
        PlantNode.tsx
    desert/               ← future scene — same structure, plug and play
      index.ts
      colors.ts
      music.ts
      GardenCanvas.tsx
      GardenBackground.tsx
      plants/
        ...
```

## The Scene contract (`types.ts`)
```typescript
export interface SceneColors {
  trunk: string
  bodyDark: string
  bodyMid: string
  bodyLight: string
  sprout: string
  bloom: string
  backgroundGarden: string
  backgroundGround: string
}

export interface CanvasProps {
  width: number
  height: number
  colors: SceneColors
  theme: Theme          // still needed for accent colors (emoji → flower)
  plants: Plant[]
  wins: Win[]
  onPlantTap?: (plant: Plant) => void
}

export interface Scene {
  id: string
  name: string
  locked: boolean
  music: any                           // require()'d mp3
  getColors: (theme: Theme) => SceneColors
  Canvas: React.ComponentType<CanvasProps>
}
```

## Scene registry (`scenes/index.ts`)
```typescript
import grove from './grove'
// import desert from './desert'   ← uncomment when ready

export const SCENES = [grove]
export const DEFAULT_SCENE = grove
export const getSceneById = (id: string): Scene =>
  SCENES.find(s => s.id === id) ?? DEFAULT_SCENE
```

## How GardenScreen uses a scene
```typescript
const scene = DEFAULT_SCENE  // swap for user-selected scene when switcher is built
const sceneColors = scene.getColors(theme)
const SceneCanvas = scene.Canvas

<SceneCanvas
  width={width}
  height={height * 0.72}
  colors={sceneColors}
  theme={theme}
  plants={plants}
  wins={wins}
  onPlantTap={handlePlantTap}
/>
```

## Critical rules
- **Plant sprites receive `colors: SceneColors`, never `theme: Theme`** — they are scene-agnostic
- **`GardenBackground` owns its own environment colors** (sky, grass, stones) — these are NOT in `SceneColors`. `SceneColors` is for plants only. Each scene's background file is fully custom.
- **`theme` still flows into `GardenCanvas`** for accent/flower colors via `emojiToFlowerColor(emoji, theme)`
- **Never import from `@/components/garden/`** — that folder is deprecated. All garden code now lives in `src/scenes/grove/`
- To add a new scene: copy the `grove/` folder, rename it, change colors/music/background, add to registry. Done.

## Grove scene — default scene
- **Name:** Grove
- **Locked:** false (always free)
- **Music:** `onboarding.mp3` (temporary — replace with `grove.mp3` when ready)
- **Background:** Sky gradient, rolling hills, clouds, birds, butterflies, ladybug, grass layers, stones, wildflowers
- **Plant colors:** Derived from `theme.plant.*` so light/dark mode is respected automatically

## Adding a scene checklist
- [ ] Create `src/scenes/{name}/` folder
- [ ] Copy grove structure exactly
- [ ] Update `colors.ts` with new color palette
- [ ] Update `music.ts` with new audio file
- [ ] Rewrite `GardenBackground.tsx` for the new environment
- [ ] Optionally reskin plant sprites in `plants/`
- [ ] Add to `src/scenes/index.ts` registry
- [ ] Add `locked: true` if it should be behind a paywall

---

---

# Theme & Color System

## Design Identity

**Dark forest green — always.** Both light and dark modes are built on deep green backgrounds, not white or gray. The app feels like standing in a calm forest — day or night. The difference between light and dark mode is depth, not a color flip.

- **Light mode** → deep forest green, like a shaded grove in daylight
- **Dark mode** → near-black forest, like the same grove at night

Bright plant greens pop against both. Accent colors (amber, pink, purple, coral) glow against the dark backgrounds. The whole experience is calm, rich, and alive.

---

## Philosophy

- **Zero hardcoded colors** anywhere in the app. Ever.
- Every UI color references a token from `theme.ts`
- Every plant/canvas color references `SceneColors` from the active scene
- Theme can be set to `light`, `dark`, or `system` (follows device setting)
- Changed from Settings screen, persisted to AsyncStorage
- All components consume colors via `useTheme()` hook
- Default on first install: `system`
- Both modes are dark-green themed — do not introduce white or neutral-gray backgrounds

---

## File Structure

```
src/
  theme/
    theme.ts          ← single source of truth, all UI tokens defined here
    ThemeContext.tsx   ← context provider, useTheme() hook lives here
    index.ts          ← exports
  utils/
    emojiColorMap.ts  ← maps emoji to flower accent color
```

---

## Token Structure (`theme.ts`)

```typescript
export const lightTheme = {
  // Backgrounds — deep forest green, lighter variant
  background: {
    primary: '#1C2B1A',       // main screen bg — deep forest
    secondary: '#243322',     // cards, sheets — slightly lighter
    tertiary: '#2C3D2A',      // inputs, subtle surfaces
    garden: '#1A2E14',        // garden area bg
    gardenGround: '#2D4A20',  // ground strip in garden
  },

  // Text — soft greens and whites on dark bg
  text: {
    primary: '#E8F0E0',       // headings, main content
    secondary: '#9AB890',     // labels, subtitles
    tertiary: '#5A7A52',      // hints, placeholders
    inverse: '#1C2B1A',       // text on bright accent backgrounds
  },

  // Brand greens
  brand: {
    darkest: '#173404',
    dark: '#27500A',
    mid: '#4A8A1A',           // primary buttons, CTAs
    base: '#639922',          // stems, accents
    light: '#97C459',         // leaves, highlights
    lighter: '#C0DD97',       // light fills
    lightest: '#E8F5D8',      // very light tints
  },

  // Plants — consumed by SceneColors in grove/colors.ts
  plant: {
    trunk: '#4A6B2A',
    bodyDark: '#2D5A0F',
    bodyMid: '#4A8A1A',
    bodyLight: '#7AB840',
    sprout: '#639922',
    bloom: '#C0DD97',
  },

  // Accents — flower colors, glow on dark bg
  accent: {
    amber: '#EF9F27',
    pink: '#D4537E',
    purple: '#7F77DD',
    coral: '#D85A30',
  },

  // UI
  ui: {
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',
    overlay: 'rgba(0,0,0,0.6)',
    success: '#97C459',
    danger: '#D85A30',
    deleteRed: '#C0392B',
  },

  // Stats
  stats: {
    streakText: '#97C459',
    winsText: '#C0DD97',
    statsBg: '#243322',
  },
}

export const darkTheme = {
  background: {
    primary: '#0D1A0B',
    secondary: '#141F12',
    tertiary: '#1A2A17',
    garden: '#0A1508',
    gardenGround: '#1A3010',
  },
  text: {
    primary: '#EAF5E0',
    secondary: '#8AAA80',
    tertiary: '#4A6A42',
    inverse: '#0D1A0B',
  },
  brand: {
    darkest: '#173404',
    dark: '#27500A',
    mid: '#5A9E20',
    base: '#76AE2A',
    light: '#A8D468',
    lighter: '#C8E8A0',
    lightest: '#E8F5D8',
  },
  plant: {
    trunk: '#527A30',
    bodyDark: '#355F15',
    bodyMid: '#5A9E20',
    bodyLight: '#8AC840',
    sprout: '#76AE2A',
    bloom: '#C8E8A0',
  },
  accent: {
    amber: '#EF9F27',
    pink: '#D4537E',
    purple: '#7F77DD',
    coral: '#D85A30',
  },
  ui: {
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    overlay: 'rgba(0,0,0,0.75)',
    success: '#A8D468',
    danger: '#D85A30',
    deleteRed: '#C0392B',
  },
  stats: {
    streakText: '#A8D468',
    winsText: '#C8E8A0',
    statsBg: '#141F12',
  },
}

export type Theme = typeof lightTheme
```

---

## ThemeContext (`ThemeContext.tsx`)

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'
import { lightTheme, darkTheme, Theme } from './theme'
import { STORAGE_KEYS } from '@/storage/keys'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme()
  const [mode, setModeState] = useState<ThemeMode>('system')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE).then(saved => {
      if (saved) setModeState(saved as ThemeMode)
    })
  }, [])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode)
  }

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark')

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

---

## Usage in any UI component

```typescript
import { useTheme } from '@/theme'

const GardenScreen = () => {
  const { theme } = useTheme()

  return (
    <View style={{ backgroundColor: theme.background.primary }}>
      <Text style={{ color: theme.text.primary }}>Quiet Wins</Text>
    </View>
  )
}
```

## Usage in Skia (plant sprites)

```typescript
// Plant sprites now receive SceneColors, NOT Theme
import { SceneColors } from '@/scenes/types'

const Sprout = ({ x, y, colors }: { x: number; y: number; colors: SceneColors }) => {
  return (
    <>
      <Path ... color={colors.sprout} />
      <Circle ... color={colors.bodyLight} />
    </>
  )
}
```

---

## Settings Screen — Theme Toggle

| Option | Value | Behavior |
|--------|-------|----------|
| System default | `system` | Follows device light/dark setting |
| Light | `light` | Deep forest — lighter variant |
| Dark | `dark` | Deep forest — darker variant |

Note: both modes are dark-green themed. "Light" means slightly less deep, not white.

---

## Rules for developers

1. **Never** use a raw hex color in a UI component. Always use `theme.*`
2. **Never** use `StyleSheet.create()` with hardcoded colors
3. **Plant sprites (Skia)** use `colors: SceneColors` — never `theme` directly
4. **GardenCanvas** receives both `colors` (for plants) and `theme` (for accent/flower colors)
5. **GardenBackground** owns its own fixed environment colors — these are scene-specific, not from `SceneColors`
6. **Accent/flower colors** use `theme.accent.*` via `emojiColorMap.ts`
7. When adding a new UI color, add it to **both** `lightTheme` and `darkTheme` before using it
8. Both themes are dark-green by design — never introduce white, light gray, or neutral backgrounds
9. **Never import from `@/components/garden/`** — deprecated. Use `@/scenes/grove/` instead

---

## Emoji → Flower Color Mapping (`emojiColorMap.ts`)

```typescript
import { Theme } from '@/theme/theme'

export const emojiToFlowerColor = (emoji: string, theme: Theme): string => {
  const amberEmojis = ['⭐','🌟','✨','🏆','💡','🔥','🌻']
  const pinkEmojis =  ['💪','❤️','🎉','🌸','💝','🎀']
  const purpleEmojis = ['📚','🎯','🧠','💜','🔮','🎓']
  const coralEmojis =  ['🏃','⚡','🚀','🎸','🌊','🍎']

  if (amberEmojis.includes(emoji)) return theme.accent.amber
  if (pinkEmojis.includes(emoji)) return theme.accent.pink
  if (purpleEmojis.includes(emoji)) return theme.accent.purple
  if (coralEmojis.includes(emoji)) return theme.accent.coral
  return theme.accent.amber
}
```

---

## Streak & Grace Skip

- User gets **one grace skip per week** (resets every Monday)
- If they miss a day and haven't used their grace → streak survives silently, grace consumed
- If they miss a day and grace is already used → streak resets to 0
- Streak reset message (gentle, never punishing):
  > *"You missed a day. It happens. Your streak resets but your garden stays."*
- **The garden is never punished.** Plants stay exactly as they are on a streak reset. Only the streak number changes.
- Grace skip indicator shown subtly in Settings or stats area — "1 grace skip available this week" / "Grace skip used"

---

## Elder Tree

### What it is
When a new season begins, the garden is not empty. A single **Elder Tree** stands in the center — ancient, large, more gnarled and beautiful than any regular plant. It is proof the user completed the previous season.

### Rules
- Elder Trees are **permanent** — they cannot be deleted
- Elder Trees **never shrink** — they are not connected to any win data
- Each completed season adds one more Elder Tree to the start of the next season
- Elder Trees occupy the center slots — new plants grow around them outward
- Season 2 starts with 1 Elder Tree
- Season 3 starts with 2 Elder Trees
- Over years the garden becomes a forest of elders surrounded by new growth

### Visual
- Visually distinct from regular plants — wider trunk, more complex canopy, slightly different color (deeper, more muted green with subtle texture)
- A small subtle glow or particle effect on the Elder Tree to make it feel special — nothing flashy, just alive
- Tapping an Elder Tree shows: *"This tree remembers Season 1. You grew 38 wins."*

### Empty season start message
When a new season begins, show a one-time message over the garden:
> *"Season 2 begins. Your garden remembers nothing. You remember everything."*

---

## Notification Copy

10 rotating daily notifications. Dark humor, encouraging, zero guilt. Never the same one twice in a row. Rotate randomly.

1. *"Your plants miss you. Not in a guilt-trippy way. Just, you know. They're plants."*
2. *"What did you do today that was worth remembering? Even something small."*
3. *"You don't have to have a great day. You just have to find one thing in it."*
4. *"Your garden is waiting. It's very patient. Unlike your inbox."*
5. *"One win. That's it. You've survived harder things than opening this app."*
6. *"Today happened. Log something before it disappears."*
7. *"The tree doesn't judge. It just grows. Give it something to work with."*
8. *"You did something today. You just haven't written it down yet."*
9. *"Small wins compound. That's not motivation speak, that's just math."*
10. *"Still here. Still growing. Log a win before you forget what you did today."*

### Notification rules
- Rotate randomly, never repeat the same one back to back
- Deliver at user's chosen time (set during onboarding)
- No notification on days the user has already logged 3 wins — they're done, don't bother them
- If grace skip is active (missed yesterday, streak saved) — use notification #3 or #5 specifically, they're the gentlest

---

---

# Component Rules

## General
- Never use `StyleSheet.create()` with hardcoded colors — always use `useTheme()` inside the component
- Keep every component under 150 lines — if it grows larger, split into smaller components
- No business logic inside components — extract into custom hooks under `src/hooks/`
- No inline styles beyond layout (flex, margin, padding) — colors always from theme or sceneColors
- Every screen component lives in `src/screens/`, every reusable UI piece in `src/components/`

## Naming
- Screens: `PascalCase` + Screen suffix → `GardenScreen.tsx`, `HistoryScreen.tsx`
- Components: `PascalCase` → `WinCard.tsx`, `PlantSprite.tsx`
- Hooks: `camelCase` + use prefix → `useWins.ts`, `useStreak.ts`, `useTheme.ts`
- Utils: `camelCase` → `emojiColorMap.ts`, `gardenPositions.ts`

## Hooks
- All data fetching and storage logic lives in hooks
- All streak/grace skip calculations live in `src/hooks/useStreak.ts`
- All win CRUD operations live in `src/hooks/useWins.ts`
- Garden position calculations live in `src/utils/gardenPositions.ts`

## Skia (garden canvas)
- All Skia drawing code lives in `src/scenes/{sceneName}/`
- **Never import from `src/components/garden/`** — that folder is deprecated
- Never mix Skia and React Native Views in the same component
- Plant rendering logic split by stage in `src/scenes/{sceneName}/plants/`
- Plant sprites receive `colors: SceneColors` — never `theme: Theme` directly

---

---

# Data Models

All data is stored locally using AsyncStorage. No backend. No user accounts.

## Win
```typescript
interface Win {
  id: string           // uuid — e.g. "a1b2c3d4"
  text: string         // user's win text — e.g. "Finally cleaned my desk"
  emoji: string        // single emoji — e.g. "✨"
  createdAt: string    // ISO date string — e.g. "2026-03-30T21:00:00.000Z"
  seasonId: string     // which season this win belongs to — e.g. "season_1"
}
```

## Plant
```typescript
interface Plant {
  id: string           // uuid
  slotIndex: number    // position in garden (0 = center, spirals outward)
  stage: 0 | 1 | 2 | 3 | 4  // 0 = empty slot, 4 = fully bloomed
  winIds: string[]     // ordered list of win IDs that grew this plant (max 4)
  isElder: boolean     // true = Elder Tree, permanent, not connected to wins
  seasonId: string     // which season this plant belongs to
}
```

## Season
```typescript
interface Season {
  id: string           // e.g. "season_1", "season_2"
  number: number       // 1, 2, 3...
  startedAt: string    // ISO date string
  completedAt: string | null  // null if current season
  totalWins: number    // snapshot of wins when season ended
}
```

## Streak
```typescript
interface StreakState {
  current: number          // current streak in days
  longest: number          // all-time longest streak
  lastLoggedDate: string   // ISO date string of last win — e.g. "2026-03-30"
  graceUsedThisWeek: boolean  // resets every Monday
  graceWeekStart: string   // ISO date of the Monday this grace period started
}
```

## Storage Keys
```typescript
const STORAGE_KEYS = {
  WINS: 'qw_wins',                    // Win[]
  PLANTS: 'qw_plants',               // Plant[]
  SEASONS: 'qw_seasons',             // Season[]
  STREAK: 'qw_streak',               // StreakState
  THEME_MODE: 'qw_theme_mode',       // 'light' | 'dark' | 'system'
  ONBOARDED: 'qw_onboarded',         // boolean — has user completed onboarding
  NOTIFICATION_TIME: 'qw_notif_time', // e.g. "21:00"
  MUSIC_ENABLED: 'qw_music_enabled', // boolean, default true
  SFX_ENABLED: 'qw_sfx_enabled',     // boolean, default true
  ACTIVE_SCENE: 'qw_active_scene',   // scene id string, default 'grove'
}
```

---

---

# DECISIONS.md

Key decisions made during planning and development. Read this before making any judgment calls.

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Expo + React Native | One codebase for iOS + Android, fastest path to both stores |
| Graphics | React Native Skia | Best performance for custom 2D garden rendering on both platforms |
| Storage | AsyncStorage / SQLite | No backend needed, fully offline, no user accounts, no privacy concerns |
| Audio | expo-av | Already in Expo ecosystem, handles both music loops and one-shot SFX |
| Theme | Dark forest green always | Core identity — both light and dark modes are green, never white or gray |
| Win limit | 1–3 per day | Keeps logging lightweight, prevents the app feeling like a task manager |
| Plant growth | 4 wins = full bloom | Simple, achievable, satisfying — not too fast, not too slow |
| Garden size | 8–10 slots | Full garden in 32–40 wins — achievable in ~2 months, earns a season reset |
| Seasons | Reset at full garden | Treats each season as a life chapter, old gardens saved as snapshots forever |
| Elder Tree | Permanent, center slot | Rewards completing a season, makes returning users feel legacy and progress |
| Delete behavior | Plant shrinks, no rearrange | Gaps are honest — rearranging feels punishing and confusing |
| Streak grace | 1 skip per week | Forgiving without making streaks meaningless |
| Streak reset tone | Gentle, never punishing | Garden stays intact — only the number resets, not the emotional progress |
| Monetization | Free + $1.99 one-time IAP | No subscription guilt, impulse-buy price, unlocks all visualizations forever |
| Scenes monetization | Paid per scene (price TBD) | Different from visualizations — scenes are environments, sold separately |
| Notifications | 10 rotating, dark humor | Avoids notification fatigue, matches the app's personality |
| No notification if 3 wins logged | Skip notification | Respects the user — they're done for the day, don't bother them |
| Onboarding | 4 screens, first win required | User feels the app before leaving onboarding — retention from minute one |
| Scene system | Self-contained folders | Plug and play — new scene = new folder, no rewiring needed |
| SceneColors vs Theme | Separate contracts | Plant sprites are scene-agnostic; UI components use theme. Clean separation. |
| GardenBackground colors | Fixed per scene | Background environment (sky, grass) is scene-specific, not driven by theme tokens |
| Audio silent mode | Respect device silent switch | Never override the user's intent — if phone is muted, app is muted |
| SFX timing | tap immediate, grow +400ms | tap fires on press for instant feedback; grow fires after sheet closes so it syncs with plant appearing |
| Default scene | Grove | Warm, natural, matches app identity. Free forever. |
| Scene switching UI | TBD | Not decided yet — settings / shop screen / long press all under consideration |

---

---

# Phase Transition Rules

## Critical rule — never auto-advance phases

After completing every task in a phase checklist, Claude Code must STOP and ask:

> "Phase X is complete. All tasks are checked off. Should I move on to Phase Y?"

Do not begin any Phase Y work until the user explicitly confirms. This includes:
- Do not install new dependencies for the next phase
- Do not create new files for the next phase
- Do not refactor existing code in anticipation of the next phase

Wait for a clear "yes" or "go ahead" before proceeding.

## If a task is blocked

If a task cannot be completed due to a technical issue, missing decision, or unclear requirement — stop and ask. Do not skip it, do not work around it silently, do not make assumptions. State exactly what is blocking and what options exist.

## If something is unclear

If any instruction in this file is ambiguous — ask before writing code. A 30 second question saves hours of rework.