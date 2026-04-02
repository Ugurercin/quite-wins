// Maps music context names to audio files.
// PLACEHOLDER entries use copies of existing files — replace with real audio.

export const MUSIC_TRACKS = {
  onboarding: require('../../assets/audio/music/onboarding.mp3'),
  grove:      require('../../assets/audio/music/grove.mp3'),       // PLACEHOLDER — replace with real file
  night:      require('../../assets/audio/music/night.mp3'),       // PLACEHOLDER — replace with real file
  space:      require('../../assets/audio/music/space.mp3'),       // PLACEHOLDER — replace with real file
} as const

export type MusicContext = keyof typeof MUSIC_TRACKS

// ─── SFX ────────────────────────────────────────────────────────────────────
// Swap out any path below to experiment with different sounds.

export const SFX_TRACKS = {
  // Plays when user taps "Plant it" button
  tap:              require('../../assets/audio/sfx/level_up.mp3'),

  // Plays after the plant grows a stage
  tree_grow:        require('../../assets/audio/sfx/tree_grow.mp3'),

  bloom:            require('../../assets/audio/sfx/bloom.mp3'),            // PLACEHOLDER — replace with real file
  season_complete:  require('../../assets/audio/sfx/season_complete.mp3'),  // PLACEHOLDER — replace with real file
  elder_appears:    require('../../assets/audio/sfx/elder_appears.mp3'),    // PLACEHOLDER — replace with real file
  win_deleted:      require('../../assets/audio/sfx/win_deleted.mp3'),      // PLACEHOLDER — replace with real file
  scene_switch:     require('../../assets/audio/sfx/scene_switch.mp3'),     // PLACEHOLDER — replace with real file
} as const

export type SFXName = keyof typeof SFX_TRACKS
