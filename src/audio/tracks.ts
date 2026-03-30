// Maps music context names to their audio files.
// Add new entries here as you find the mp3s.

export const MUSIC_TRACKS = {
  onboarding: require('../../assets/audio/music/onboarding.mp3'),
  // garden: require('../../assets/audio/music/garden.mp3'),
  // logwin: require('../../assets/audio/music/logwin.mp3'),
  // recap: require('../../assets/audio/music/recap.mp3'),
} as const

export type MusicContext = keyof typeof MUSIC_TRACKS

// SFX — uncomment as you add files
export const SFX_TRACKS = {
  // plant_it: require('../../assets/audio/sfx/plant_it.mp3'),
  // stage_grow: require('../../assets/audio/sfx/stage_grow.mp3'),
  // bloom: require('../../assets/audio/sfx/bloom.mp3'),
  // win_delete: require('../../assets/audio/sfx/win_delete.mp3'),
  // season_complete: require('../../assets/audio/sfx/season_complete.mp3'),
  // onboarding_start: require('../../assets/audio/sfx/onboarding_start.mp3'),
} as const

export type SFXName = keyof typeof SFX_TRACKS