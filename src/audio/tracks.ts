// Maps music context names to their audio files.
// Add new entries here as you find the mp3s.

export const MUSIC_TRACKS = {
  onboarding: require('../../assets/audio/music/onboarding.mp3'),
  // garden: require('../../assets/audio/music/garden.mp3'),
  // logwin: require('../../assets/audio/music/logwin.mp3'),
  // recap: require('../../assets/audio/music/recap.mp3'),
} as const

export type MusicContext = keyof typeof MUSIC_TRACKS

// ─── SFX ────────────────────────────────────────────────────────────────────
// Swap out any path below to experiment with different sounds.

export const SFX_TRACKS = {
  // Plays when user taps "Plant it" button
  tap: require('../../assets/audio/sfx/level_up.mp3'),

  // Plays after the plant grows a stage
  tree_grow: require('../../assets/audio/sfx/tree_grow.mp3'),

  // Uncomment as you add more files:
  // bloom: require('../../assets/audio/sfx/bloom.mp3'),
  // win_delete: require('../../assets/audio/sfx/win_delete.mp3'),
  // season_complete: require('../../assets/audio/sfx/season_complete.mp3'),
} as const

export type SFXName = keyof typeof SFX_TRACKS