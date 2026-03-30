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

---

## Monetization

- **Free:** Garden visualization only
- **$1.99 one-time IAP:** Unlocks all visualizations (constellation, wall of bricks, heat map)
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
8. **Settings** (notification time, theme toggle)

---

## Phases

### Phase 1 — Core loop
- Onboarding (all 4 screens)
- Garden screen (static, no animation yet)
- Log win bottom sheet
- Plant growth logic (4 stages)
- Local storage

### Phase 2 — Garden comes alive
- Plant growth animations
- Bloom animation (stage 4)
- New plant appearing animation
- Tap a plant → popup
- Delete win → plant shrink animation

### Phase 3 — History & stats
- History screen with swipe-to-delete
- Season logic + season archive
- Streak + total wins recalculation on delete

### Phase 4 — Polish & monetization
- Other visualizations (constellation, bricks, heat map)
- IAP integration ($1.99 unlock)
- Notification system
- App Store assets + submission

---

## Open Questions (to decide later)
- App icon design
- Font choice
- App Store keywords + description
- Whether to add a share/screenshot feature for gardens

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
- Every color references a token from `theme.ts`
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
    theme.ts          ← single source of truth, all tokens defined here
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

  // Plants
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
  // Backgrounds — near-black forest, deeper variant
  background: {
    primary: '#0D1A0B',
    secondary: '#141F12',
    tertiary: '#1A2A17',
    garden: '#0A1508',
    gardenGround: '#1A3010',
  },

  // Text — slightly brighter for contrast
  text: {
    primary: '#EAF5E0',
    secondary: '#8AAA80',
    tertiary: '#4A6A42',
    inverse: '#0D1A0B',
  },

  // Brand — slightly brighter to pop on deeper bg
  brand: {
    darkest: '#173404',
    dark: '#27500A',
    mid: '#5A9E20',
    base: '#76AE2A',
    light: '#A8D468',
    lighter: '#C8E8A0',
    lightest: '#E8F5D8',
  },

  // Plants — brighter on deeper bg
  plant: {
    trunk: '#527A30',
    bodyDark: '#355F15',
    bodyMid: '#5A9E20',
    bodyLight: '#8AC840',
    sprout: '#76AE2A',
    bloom: '#C8E8A0',
  },

  // Accents — same, pop on any dark bg
  accent: {
    amber: '#EF9F27',
    pink: '#D4537E',
    purple: '#7F77DD',
    coral: '#D85A30',
  },

  // UI
  ui: {
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    overlay: 'rgba(0,0,0,0.75)',
    success: '#A8D468',
    danger: '#D85A30',
    deleteRed: '#C0392B',
  },

  // Stats
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
    AsyncStorage.getItem('themeMode').then(saved => {
      if (saved) setModeState(saved as ThemeMode)
    })
  }, [])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    AsyncStorage.setItem('themeMode', newMode)
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

## Usage in any component

```typescript
import { useTheme } from '@/theme'

const GardenScreen = () => {
  const { theme } = useTheme()

  return (
    <View style={{ backgroundColor: theme.background.primary }}>
      <Text style={{ color: theme.text.primary }}>Quiet Wins</Text>
      <View style={{ backgroundColor: theme.background.garden }}>
        {/* garden renders here */}
      </View>
    </View>
  )
}
```

---

## Usage in Skia (garden canvas)

```typescript
import { useTheme } from '@/theme'
import { Canvas, Rect } from '@shopify/react-native-skia'

const GardenCanvas = () => {
  const { theme } = useTheme()

  return (
    <Canvas style={{ flex: 1 }}>
      <Rect
        x={0} y={0} width={width} height={height}
        color={theme.background.garden}
      />
      {/* plant colors from theme.plant.* */}
    </Canvas>
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

1. **Never** use a raw hex color in a component. Always use `theme.*`
2. **Never** use `StyleSheet.create()` with hardcoded colors — create styles inside the component where `theme` is available, or pass colors as props
3. **Garden canvas (Skia)** uses `theme.plant.*` and `theme.background.garden` exclusively
4. **Accent/flower colors** use `theme.accent.*` via `emojiColorMap.ts`
5. When adding a new color need, add it to **both** `lightTheme` and `darkTheme` before using it
6. Both themes are dark-green by design — never introduce white, light gray, or neutral backgrounds

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
- No inline styles beyond layout (flex, margin, padding) — colors always from theme
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
- All Skia drawing code lives in `src/components/garden/`
- Never mix Skia and React Native Views in the same component
- Plant rendering logic split by stage: `Sprout.tsx`, `Seedling.tsx`, `Growing.tsx`, `Bloomed.tsx`, `ElderTree.tsx`
- Colors always from `theme.plant.*` — never hardcoded in Skia components

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
  WINS: 'qw_wins',               // Win[]
  PLANTS: 'qw_plants',           // Plant[]
  SEASONS: 'qw_seasons',         // Season[]
  STREAK: 'qw_streak',           // StreakState
  THEME_MODE: 'qw_theme_mode',   // 'light' | 'dark' | 'system'
  ONBOARDED: 'qw_onboarded',     // boolean — has user completed onboarding
  NOTIFICATION_TIME: 'qw_notif_time',  // e.g. "21:00"
}
```

---

---

# TASKS.md — Phase 1

Work through these in order. Check off each task before moving to the next. Do not start Phase 2 until all Phase 1 tasks are complete.

## Setup
- [ ] Confirm `src/theme/theme.ts` exists with `lightTheme`, `darkTheme`, and `Theme` type
- [ ] Confirm `src/theme/ThemeContext.tsx` exists with `ThemeProvider` and `useTheme()`
- [ ] Confirm `src/theme/index.ts` exports both
- [ ] Confirm `App.tsx` is wrapped in `<ThemeProvider>`
- [ ] Confirm `STORAGE_KEYS` constants are defined in `src/storage/keys.ts`

## Data layer
- [ ] Create `src/hooks/useWins.ts` — addWin, deleteWin, getWinsForDay, getAllWins
- [ ] Create `src/hooks/usePlants.ts` — getPlants, growPlant, shrinkPlant, addElderTree
- [ ] Create `src/hooks/useStreak.ts` — getCurrentStreak, updateStreak, checkGrace
- [ ] Create `src/hooks/useSeasons.ts` — getCurrentSeason, completeSeason
- [ ] Create `src/utils/gardenPositions.ts` — pre-calculated list of 10 slot positions spiraling from center
- [ ] Create `src/utils/emojiColorMap.ts` — emojiToFlowerColor(emoji, theme)

## Onboarding
- [ ] Create `src/screens/OnboardingScreen.tsx` with 4 steps managed internally
- [ ] Step 1: App name + tagline + "Get started" button
- [ ] Step 2: Notification time picker (Morning / Evening / Custom / Skip)
- [ ] Step 3: First win input (text + emoji picker + "Plant it" button)
- [ ] Step 4: Garden with first plant visible + stats (1 win, 1 day streak) + "Go to my garden"
- [ ] On complete: set `STORAGE_KEYS.ONBOARDED` to true, save notification time, save first win
- [ ] App.tsx checks `ONBOARDED` on launch — shows OnboardingScreen or GardenScreen

## Garden screen (static — no animations yet)
- [ ] Create `src/screens/GardenScreen.tsx`
- [ ] Stats row at top: streak + total wins, both from theme.stats.*
- [ ] Garden area: renders plants based on current Plant[] data, using Skia canvas
- [ ] Each plant renders correct stage (Sprout / Seedling / Growing / Bloomed / Elder)
- [ ] "+" button at bottom — opens LogWinSheet
- [ ] History icon in top corner — navigates to HistoryScreen
- [ ] All colors from theme — zero hardcoded values

## Plant sprites (static — no animations yet)
- [ ] Create `src/components/garden/Sprout.tsx` — stage 1 Skia component
- [ ] Create `src/components/garden/Seedling.tsx` — stage 2 Skia component
- [ ] Create `src/components/garden/Growing.tsx` — stage 3 Skia component
- [ ] Create `src/components/garden/Bloomed.tsx` — stage 4 Skia component
- [ ] Create `src/components/garden/ElderTree.tsx` — permanent elder, visually distinct
- [ ] Each sprite receives `x`, `y`, `theme` as props — no internal theme access

## Log win bottom sheet
- [ ] Create `src/components/LogWinSheet.tsx`
- [ ] Slides up from bottom, garden visible behind it
- [ ] Text input: "What did you win today?"
- [ ] Emoji quick-pick row (8–10 common emojis) + "more" option
- [ ] "Plant it" button — disabled if text is empty
- [ ] On submit: calls addWin, calls growPlant, closes sheet
- [ ] If 3 wins already logged today: show message instead of form — *"You've planted 3 wins today. Come back tomorrow."*

## Local storage
- [ ] All hooks read and write via AsyncStorage using STORAGE_KEYS
- [ ] On first launch (no data): initialize empty wins [], plants [], season_1, streak state
- [ ] Verify data persists across app restarts

## Checklist before Phase 2
- [ ] Can complete full onboarding flow
- [ ] Can log a win from garden screen
- [ ] Plant appears in correct slot at correct stage
- [ ] Stats update after logging
- [ ] Data persists after closing and reopening app
- [ ] All screens use theme colors — no hardcoded hex values anywhere

---

---

# DECISIONS.md

Key decisions made during planning and the reasoning behind them. Read this before making any judgment calls during development.

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Expo + React Native | One codebase for iOS + Android, fastest path to both stores |
| Graphics | React Native Skia | Best performance for custom 2D garden rendering on both platforms |
| Storage | AsyncStorage / SQLite | No backend needed, fully offline, no user accounts, no privacy concerns |
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
| Notifications | 10 rotating, dark humor | Avoids notification fatigue, matches the app's personality |
| No notification if 3 wins logged | Skip notification | Respects the user — they're done for the day, don't bother them |
| Onboarding | 4 screens, first win required | User feels the app before leaving onboarding — retention from minute one |

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