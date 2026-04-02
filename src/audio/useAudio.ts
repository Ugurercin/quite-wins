import { useEffect, useRef, useCallback } from 'react'
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'
import { MUSIC_TRACKS, SFX_TRACKS, MusicContext, SFXName } from './tracks'

// How long the crossfade takes in ms
const FADE_DURATION = 300
const FADE_STEPS = 10

export const useAudio = () => {
  // Persistent music player — source swapped via player.replace()
  const musicPlayer = useAudioPlayer(null)
  const currentContext = useRef<MusicContext | null>(null)
  const isFading = useRef(false)

  // Pre-create one player per SFX track (hooks must not be called conditionally)
  const sfxTap            = useAudioPlayer(SFX_TRACKS.tap)
  const sfxTreeGrow       = useAudioPlayer(SFX_TRACKS.tree_grow)
  const sfxBloom          = useAudioPlayer(SFX_TRACKS.bloom)
  const sfxSeasonComplete = useAudioPlayer(SFX_TRACKS.season_complete)
  const sfxElderAppears   = useAudioPlayer(SFX_TRACKS.elder_appears)
  const sfxWinDeleted     = useAudioPlayer(SFX_TRACKS.win_deleted)
  const sfxSceneSwitch    = useAudioPlayer(SFX_TRACKS.scene_switch)

  // Set up audio mode once on mount
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,   // respects device silent switch
      shouldDuckAndroid: true,
    }).catch(() => {})

    return () => {
      try { musicPlayer.pause() } catch (_) {}
    }
  }, [])

  // Steps volume from `from` → `to` over FADE_DURATION ms
  const fadeVolume = (from: number, to: number): Promise<void> =>
    new Promise(resolve => {
      const stepTime = FADE_DURATION / FADE_STEPS
      let step = 0
      const interval = setInterval(() => {
        step++
        const vol = from + (to - from) * (step / FADE_STEPS)
        try { musicPlayer.volume = Math.max(0, Math.min(1, vol)) } catch (_) {}
        if (step >= FADE_STEPS) {
          clearInterval(interval)
          resolve()
        }
      }, stepTime)
    })

  const stopMusic = useCallback(async () => {
    try {
      await fadeVolume(1, 0)
      musicPlayer.pause()
      musicPlayer.seekTo(0)
      currentContext.current = null
    } catch (_) {}
  }, [])

  const playMusic = useCallback(async (context: MusicContext) => {
    // Already playing this context — do nothing
    if (currentContext.current === context) return

    // Check music setting
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.MUSIC_ENABLED)
      if (enabled === 'false') return
    } catch (_) {}

    const source = MUSIC_TRACKS[context]
    if (!source) return

    // Prevent overlapping fades
    if (isFading.current) return
    isFading.current = true

    try {
      // Fade out existing track before swapping
      if (currentContext.current !== null) {
        await fadeVolume(1, 0)
        musicPlayer.pause()
      }

      musicPlayer.replace(source)
      musicPlayer.loop = true
      musicPlayer.volume = 0
      musicPlayer.play()
      currentContext.current = context

      await fadeVolume(0, 1)
    } catch (e) {
      console.warn('[useAudio] playMusic error:', e)
    } finally {
      isFading.current = false
    }
  }, [])

  const crossfadeTo = useCallback(async (context: MusicContext) => {
    await playMusic(context)
  }, [playMusic])

  const playSFX = useCallback(async (name: SFXName) => {
    // Check SFX setting
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.SFX_ENABLED)
      if (enabled === 'false') return
    } catch (_) {}

    try {
      const playerMap: Record<SFXName, ReturnType<typeof useAudioPlayer>> = {
        tap:             sfxTap,
        tree_grow:       sfxTreeGrow,
        bloom:           sfxBloom,
        season_complete: sfxSeasonComplete,
        elder_appears:   sfxElderAppears,
        win_deleted:     sfxWinDeleted,
        scene_switch:    sfxSceneSwitch,
      }
      const player = playerMap[name]
      if (!player) return
      // Seek to start so the same player can be reused for rapid triggers
      player.seekTo(0)
      player.play()
    } catch (e) {
      console.warn('[useAudio] playSFX error:', e)
    }
  }, [sfxTap, sfxTreeGrow, sfxBloom, sfxSeasonComplete, sfxElderAppears, sfxWinDeleted, sfxSceneSwitch])

  return { playMusic, crossfadeTo, playSFX, stopMusic }
}
