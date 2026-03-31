# Quiet Wins — CLAUDE.md

> "The small stuff adds up."

Mobile app (iOS + Android) for logging daily wins that grow into a garden. Simple, emotional, permanent. **Read fully before writing any code.**

---

## Stack
- **Framework:** Expo + React Native
- **Graphics:** React Native Skia (garden canvas)
- **Animations:** React Native Reanimated
- **Storage:** AsyncStorage (local, no backend)
- **Audio:** expo-av
- **Notifications:** expo-notifications

---

## Core Concept
1–3 wins/day (text + emoji). Each win grows a plant through 4 stages. 7 regular slots × 4 wins = season ends at 28 wins. Garden is permanent record of all accomplishments.

---

## Monetization
- **Free:** Garden + Grove scene
- **$1.99 one-time IAP:** All visualizations (constellation, wall of bricks, heat map)
- **Scenes:** Paid per scene (price TBD)
- No subscription. Ever.
- Paywall copy: *"Unlock everything — $1.99. No subscription, ever. Just a one-time thanks."*

---

## Visualizations
| Name | Free? | Description |
|------|-------|-------------|
| Garden | ✅ | Plants grow from center outward, bloom at 4 logs |
| Constellation | 💰 | Each win is a star |
| Wall of bricks | 💰 | Each win adds a brick |
| Heat map | 💰 | GitHub-style grid |

---

## Win Logging
- 1–3 wins/day, text + emoji
- Bottom sheet slides up over garden (garden visible behind)
- Fields: text input + emoji quick-pick + "Plant it" button
- At 3 wins: show *"You've planted 3 wins today. Come back tomorrow."*

---

## Garden Logic

### Plant Growth
| Log # | Stage | Visual |
|-------|-------|--------|
| 1 | Stage 1 | Tiny — just appeared |
| 2 | Stage 2 | Small, first features |
| 3 | Stage 3 | Fuller, getting beautiful |
| 4 | Stage 4 | Fully bloomed |

- Stage 4 → bloom animation plays (~2s), new slot opens, cycle restarts
- 10 slots total: 7 regular (front/mid rows) + 3 elder (back row)

### Plant Types
Randomly assigned at slot birth, never changes. Stored as `plantType` on `Plant`.

| Type | Elder form |
|------|-----------|
| Flower | ElderFlower — wide gnarled canopy, breathing bloom glow |
| Mushroom | ElderMushroom — massive ancient cap, glowing spots, baby mushrooms at base |
| Cactus | ElderCactus — huge multi-arm, flowers everywhere, golden breathing glow |

### Garden Positions
```
BACK ROW   y ≈ 0.64–0.66  — Elder slots (7, 8, 9)
MID ROW    y ≈ 0.74–0.80  — Established plants
FRONT ROW  y ≈ 0.85–0.87  — Newest growth
```
```typescript
GARDEN_POSITIONS = [
  { x: 0.50, y: 0.87 }, // 0 — front center (first win always here)
  { x: 0.64, y: 0.85 }, // 1 — front right
  { x: 0.36, y: 0.85 }, // 2 — front left
  { x: 0.50, y: 0.76 }, // 3 — mid center
  { x: 0.68, y: 0.74 }, // 4 — mid right
  { x: 0.32, y: 0.74 }, // 5 — mid left
  { x: 0.78, y: 0.80 }, // 6 — mid far-right
  { x: 0.50, y: 0.66 }, // 7 — back center  ← elder slot 1
  { x: 0.67, y: 0.64 }, // 8 — back right   ← elder slot 2
  { x: 0.33, y: 0.64 }, // 9 — back left    ← elder slot 3
]
// REGULAR_SLOT_INDICES = [0..6], ELDER_SLOT_INDICES = [7, 8, 9]
// Keep all y values between 0.65–0.92. Never go above 0.60 (sky/hill territory).
```

---

## Seasons & Elder Trees

- Garden fills at 28 wins (7 regular slots × 4) → season ends
- Old garden saved as snapshot; new season starts with only elders from prior seasons
- Each completed season adds one Elder to the next season's back row (slot 7, 8, 9)
- Elder inherits `plantType` of the plant that completed the season
- Elders are **permanent** — cannot be deleted, never shrink, not connected to win data
- Tapping an Elder: *"This tree remembers Season N. You grew X wins."*
- Season start message: *"Season 2 begins. Your garden remembers nothing. You remember everything."*

### Season Transition — CRITICAL
**Never use `clearAllPlants` + `addElderTrees` separately** — causes race condition (all elders land on slot 7).

Always use atomic `transitionSeason(nextSeasonId, elderTypes)` from `usePlants.ts`. It:
1. Loads existing elders from storage
2. Builds working array from existing elders (slot calc sees occupied slots)
3. Adds new elders in next available back-row slots
4. Saves atomically

```typescript
// GardenScreen — handleRecapReady:
const elderTypes = updatedPlants.filter(p => !p.isElder && p.stage === 4).map(p => p.plantType)
await transitionSeason(nextSeason.id, elderTypes)
```

---

## Deleting a Win
- Deleting → plant stage −1, smooth reverse animation (~1s)
- Plant drops to 0 → disappears (fade-out animation)
- Remaining plants **do NOT rearrange** — gaps are fine, honest, fill naturally
- Streak recalculated silently after every delete

### Delete Flow
1. History screen or plant tap → swipe left on win card → red delete button
2. Confirmation: *"Remove this win? Your plant will shrink."*
3. Confirm → win deleted, plant animates back one stage

---

## History Screen
- Reverse chronological, grouped by date
- Each win: emoji + text + time logged
- Swipe left to delete; empty days not shown
- History icon defaults to today's date scrolled to top

---

## Stats (always visible on garden screen)
- Current streak (days in a row)
- Total wins (lifetime)

---

## Streak & Grace Skip
- 1 grace skip/week (resets every Monday)
- Miss a day + grace available → streak survives, grace consumed
- Miss a day + grace used → streak resets to 0
- Reset message: *"You missed a day. It happens. Your streak resets but your garden stays."*
- **Garden never punished** — only streak number changes
- Grace indicator shown subtly in Settings/stats area

---

## Onboarding (6 steps)
Progress bar on steps 2–6. Back nav on steps 2–5. Music plays throughout.

| Step | Name | Content |
|------|------|---------|
| 1 | Hero | App name, "Grow a little world from the things you did right", 3 feature pills, "Start my garden" |
| 2 | Inspiration | Motivational copy about small moments, quote card, "Let's keep going" |
| 3 | Why small | Explains 1–3 win limit, two point cards, quote card, "That makes sense" |
| 4 | Notification | Morning / Evening / Custom / Skip. Custom shows inline time input. "Continue" |
| 5 | First win | Emoji picker + text input + "Plant this win" (plants into season_1) |
| 6 | Garden reveal | Stats row, garden canvas with first plant, "Go to my garden". No back button. |

On complete: set `ONBOARDED=true`, save notification time (first win saved at step 5).

---

## Notifications
- One/day at user-chosen time; 10 rotating, dark humor, never repeat back-to-back
- Skip if user already logged 3 wins today
- Use copy #3 or #5 if grace skip active (gentlest)

Copy:
1. "Your plants miss you. Not in a guilt-trippy way. Just, you know. They're plants."
2. "What did you do today that was worth remembering? Even something small."
3. "You don't have to have a great day. You just have to find one thing in it."
4. "Your garden is waiting. It's very patient. Unlike your inbox."
5. "One win. That's it. You've survived harder things than opening this app."
6. "Today happened. Log something before it disappears."
7. "The tree doesn't judge. It just grows. Give it something to work with."
8. "You did something today. You just haven't written it down yet."
9. "Small wins compound. That's not motivation speak, that's just math."
10. "Still here. Still growing. Log a win before you forget what you did today."

---

## Screens
1. Onboarding (6 steps, one-time)
2. Garden (main — garden + stats + "+" button)
3. Log Win (bottom sheet over garden)
4. History (grouped list, swipe to delete)
5. Plant Detail (popup on tap, delete option)
6. Season Archive (past seasons as snapshots)
7. Unlock Screen (paywall — other visualizations)
8. Settings (notification time, theme toggle, music/SFX toggles)

---

## Audio System
- Library: `expo-av`
- Respects device silent mode (`playsInSilentModeIOS: false`)
- Music and SFX independently toggled
- Music crossfades between contexts (300ms)
- Pauses on app background, resumes on foreground

Audio wiring:
| Location | What |
|----------|------|
| OnboardingScreen mount | `playMusic('onboarding')` |
| OnboardingScreen unmount | `stopMusic()` |
| LogWinSheet "Plant it" tap | `playSFX('tap')` immediately |
| LogWinSheet 400ms after tap | `playSFX('tree_grow')` |

All audio paths defined in `src/audio/tracks.ts` only — never hardcode elsewhere.

Storage keys: `qw_music_enabled` (bool), `qw_sfx_enabled` (bool)

---

## Scene System
A **scene** is a self-contained visual + audio package. Current scene: **Grove** (free, always).

### File structure
```
src/scenes/
  types.ts          ← Scene, SceneColors, CanvasProps, StageProps, ElderProps
  index.ts          ← Registry: SCENES[], DEFAULT_SCENE, getSceneById()
  grove/
    index.ts
    colors.ts       ← SceneColors derived from theme
    music.ts
    GardenCanvas.tsx
    GardenBackground.tsx  ← sky, clouds, grass, birds, butterflies (owns its own env colors)
    plants/
      plantTypes.ts   ← PlantType, PLANT_TYPES[], randomPlantType(), StageProps, ElderProps
      PlantNode.tsx   ← reads plantType → STAGE_REGISTRY + ELDER_REGISTRY
      flower/Stage1–4.tsx
      mushroom/Stage1–4.tsx
      cactus/Stage1–4.tsx
      elders/ElderFlower.tsx, ElderMushroom.tsx, ElderCactus.tsx
```

### Key interfaces (see `src/scenes/types.ts` for full source)
```typescript
SceneColors  { trunk, bodyDark, bodyMid, bodyLight, sprout, bloom, backgroundGarden, backgroundGround }
CanvasProps  { width, height, colors: SceneColors, theme: Theme, plants, wins, onPlantTap? }
Scene        { id, name, locked, music, getColors(theme): SceneColors, Canvas, PreviewCanvas? }
// PreviewCanvas: React.ComponentType<{ width, height, colors: SceneColors }>
// Optional — renders background only (no plants) for the scene picker card.
// If absent, picker falls back to a solid backgroundGarden color swatch.
```

### GardenScreen usage
```typescript
const { activeScene } = useActiveScene()   // hook reads qw_active_scene from AsyncStorage
const sceneColors = activeScene.getColors(theme)
<activeScene.Canvas width={w} height={h*0.72} colors={sceneColors} theme={theme} plants={plants} wins={wins} onPlantTap={handlePlantTap} />
```

### Scene picker
- Opened via a pill button (bottom-left of GardenScreen, opposite the "+" button)
- Horizontal scroll of scene cards (~140×100px), each renders `scene.PreviewCanvas` or color fallback
- Active scene: `theme.brand.light` border + checkmark overlay
- Locked scene: dark overlay + lock icon + *"Coming soon"* on tap (no IAP yet)
- Implemented in `src/components/ScenePickerSheet.tsx`
- Active scene persisted to `qw_active_scene` via `src/hooks/useActiveScene.ts`

### Registered scenes
| id | Name | Locked | Status |
|----|------|--------|--------|
| `grove` | Grove | false | ✅ Built |
| `night` | Night Grove | true | ✅ Built |

### Night Grove — `src/scenes/night/`
Fully self-contained. Zero imports from `src/scenes/grove/`.

**Identity:** Deep navy sky, moon with halo glow, twinkling stars (staggered), fireflies drifting across lower canvas, dark hill silhouette, deep earth ground.

**Colors (mostly fixed — moonlight doesn't shift with light/dark mode):**
```
trunk:            '#2A2D1A'   deep charcoal brown
bodyDark:         '#0D1F0D'   deep midnight green
bodyMid:          '#1E3D2A'   moonlit mid-green
bodyLight:        '#7AA8C0'   silver-blue leaf highlight
sprout:           '#3A6B5A'   cool blue-green
bloom:            '#C8D8F0'   moonlit silver-white
backgroundGarden: '#080C1F'   near-black navy
backgroundGround: '#0D1A0D'   deep dark earth
```

**Background elements:** sky gradient (`#0A0E2A`→`#111836`), moon top-right with glow rings, ~30 stars (8–10 twinkling with staggered opacity animation), dark hill bezier silhouette, 4 drifting fireflies (`#C8FF80`), dark grass blades along ground.

**Plant types:** flower, mushroom, cactus — same three types as Grove, night-themed visuals.
- Flower: silver-white moonlit petals, bloom shimmer animation at stage 4
- Mushroom: bioluminescent glowing spots (staggered pulse), light pool on ground at stage 4
- Cactus: moonlit spine highlights, white night-blooming flowers at stage 4
- All elders: breathing scale animation (~3s cycle) + scene-appropriate glow

**Animations:** all via Reanimated (`useSharedValue`, `withRepeat`, `withTiming`). Stars staggered — never all pulse in sync. Fireflies each have independent drift timing.

### To add a new plant type (any scene)
1. Create `src/scenes/{scene}/plants/{type}/Stage1–4.tsx` + `elders/Elder{Type}.tsx`
2. Import into that scene's `PlantNode.tsx`, add to `STAGE_REGISTRY` + `ELDER_REGISTRY`
3. Add to `PLANT_TYPES[]` in `plantTypes.ts`

### To add a new scene
1. Copy `grove/` folder, rename, update colors/music/background/plants, add to `scenes/index.ts` with `locked: true`
2. Add entry to the Registered scenes table above

---

## Theme & Color System

**Dark forest green — always.** Light mode = deep forest grove; dark mode = same grove at night. Never white or neutral-gray backgrounds.

- All UI colors → `theme.*` via `useTheme()`
- All plant/canvas colors → `SceneColors` from active scene
- Theme options: `light` | `dark` | `system` (default: `system`)
- **Never hardcode hex colors in components**

### Theme tokens — see `src/theme/theme.ts` for full source
Key groups: `background`, `text`, `brand`, `plant`, `accent` (amber/pink/purple/coral), `ui`, `stats`

Light: primary bg `#1C2B1A` | Dark: primary bg `#0D1A0B`

### Rules
1. Never use raw hex in a component — always `theme.*`
2. Never `StyleSheet.create()` with hardcoded colors
3. Plant sprites use `colors: SceneColors` — never `theme` directly
4. `GardenCanvas` gets both `colors` (plants) and `theme` (accent/emoji colors)
5. `GardenBackground` owns its own environment colors — not from `SceneColors`
6. Never import from `@/components/garden/` — **deprecated**. Use `@/scenes/grove/`
7. `plantType` on elders must always inherit from the plant that earned it — never hardcode
8. New color needs → add to **both** `lightTheme` and `darkTheme` before using

### Emoji → Flower Color
`emojiToFlowerColor(emoji, theme)` in `src/utils/emojiColorMap.ts`:
- ⭐🌟✨🏆💡🔥🌻 → amber | 💪❤️🎉🌸💝🎀 → pink | 📚🎯🧠💜🔮🎓 → purple | 🏃⚡🚀🎸🌊🍎 → coral | default → amber

---

## Data Models

```typescript
interface Win      { id, text, emoji, createdAt: ISO, seasonId }
interface Plant    { id, slotIndex: 0–9, stage: 0|1|2|3|4, winIds: string[], isElder: boolean, seasonId, plantType: PlantType }
interface Season   { id, number, startedAt: ISO, completedAt: ISO|null, totalWins, plantSnapshot: Plant[] }
interface StreakState { current, longest, lastLoggedDate: ISO, graceUsedThisWeek: boolean, graceWeekStart: ISO }
type PlantType = 'flower' | 'mushroom' | 'cactus'
```

### Storage Keys (`src/storage/keys.ts`)
```typescript
STORAGE_KEYS = {
  WINS: 'qw_wins', PLANTS: 'qw_plants', SEASONS: 'qw_seasons',
  STREAK: 'qw_streak', THEME_MODE: 'qw_theme_mode', ONBOARDED: 'qw_onboarded',
  NOTIFICATION_TIME: 'qw_notif_time', MUSIC_ENABLED: 'qw_music_enabled',
  SFX_ENABLED: 'qw_sfx_enabled', ACTIVE_SCENE: 'qw_active_scene',
}
```

---

## Component Rules
- Components < 150 lines — split if larger
- No business logic in components — extract to `src/hooks/`
- Screens → `src/screens/`, reusable UI → `src/components/`
- All Skia drawing code → `src/scenes/{sceneName}/`
- All streak/grace logic → `src/hooks/useStreak.ts`
- All win CRUD → `src/hooks/useWins.ts`
- Garden positions → `src/utils/gardenPositions.ts`
- Season transition → `transitionSeason()` in `usePlants.ts` — never two-step clear+add

### Naming
- Screens: `PascalCase` + Screen → `GardenScreen.tsx`
- Components: `PascalCase` → `WinCard.tsx`
- Hooks: `use` prefix → `useWins.ts`
- Utils: camelCase → `emojiColorMap.ts`

---

## Phases
- ✅ Phase 1 — Core loop (onboarding, garden static, log win, storage)
- ✅ Phase 2 — Garden comes alive (animations, bloom, plant tap/delete)
- ✅ Phase 3 — History & stats (history screen, seasons, streak recalc)
- 🔲 Phase 4a — Scene selector (ScenePickerSheet, useActiveScene, PreviewCanvas per scene)
- 🔲 Phase 4b — Notifications (expo-notifications wiring, 10 rotating copy, grace skip logic)
- 🔲 Phase 4c — IAP ($1.99 visualizations unlock, restore purchases, expo-in-app-purchases)
- 🔲 Phase 4d — App Store submission (icon, screenshots, metadata)

---

## Key Decisions
| Decision | Choice |
|----------|--------|
| No subscription | $1.99 one-time IAP only |
| Plant growth | 4 wins = full bloom |
| Garden size | 10 slots (7 regular + 3 elder) |
| Zones | Front/mid = regular; back = elders only |
| Season end | 28 wins (7 slots × 4) |
| Elder type | Inherits plantType of completing plant |
| Delete | Plant shrinks, no rearrange (gaps are honest) |
| Streak grace | 1 skip/week, resets Monday |
| Streak reset | Garden never punished — only number changes |
| Season transition | Atomic `transitionSeason()` — never two-step |
| Theme | Dark forest green always — no white/gray |
| Scenes vs Theme | Plant sprites use SceneColors; UI uses Theme |
| Audio | Respects silent mode; SFX tap=immediate, grow=+400ms |
| Default scene | Grove (free forever) |
| Scene switching UI | Pill button bottom-left → ScenePickerSheet (bottom sheet, horizontal preview cards) |
| Scene picker preview | Each scene exports optional `PreviewCanvas` (background only, no plants) — live in card |
| Active scene persistence | `qw_active_scene` via `useActiveScene` hook |
| Night Grove | `locked: true`, moonlit silver-blue palette, stars/moon/fireflies background |
| Onboarding | 6 steps — user plants first win before leaving |

---

## Open Questions
- App icon, font choice, App Store keywords
- Share/screenshot feature for gardens
- How user switches scenes (settings / shop / long press)
- Whether plant type selection replaces random assignment

---

## Phase Transition Rules

**Never auto-advance phases.** After all tasks in a phase are done, STOP and ask:
> "Phase X is complete. Should I move on to Phase Y?"

**If blocked:** Stop and describe exactly what's blocking and what options exist. Never skip, work around, or assume.

**If unclear:** Ask before writing code.