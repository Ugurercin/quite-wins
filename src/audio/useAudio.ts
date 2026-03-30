import { useEffect, useRef, useCallback } from 'react'
import { Audio } from 'expo-av'
import { MUSIC_TRACKS, SFX_TRACKS, MusicContext, SFXName } from './tracks'

// How long the crossfade takes in ms
const FADE_DURATION = 300
const FADE_STEPS = 10

export const useAudio = () => {
  const musicRef = useRef<Audio.Sound | null>(null)
  const currentContext = useRef<MusicContext | null>(null)
  const isFading = useRef(false)

  // Set up audio mode once on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,   // respects device silent switch
      staysActiveInBackground: false,
    })

    return () => {
      // Cleanup on unmount
      if (musicRef.current) {
        musicRef.current.unloadAsync()
        musicRef.current = null
      }
    }
  }, [])

  const stopMusic = useCallback(async () => {
    if (!musicRef.current) return
    try {
      await musicRef.current.stopAsync()
      await musicRef.current.unloadAsync()
      musicRef.current = null
      currentContext.current = null
    } catch (_) {}
  }, [])

  const fadeOut = useCallback(async () => {
    if (!musicRef.current) return
    const stepTime = FADE_DURATION / FADE_STEPS
    for (let i = FADE_STEPS; i >= 0; i--) {
      try {
        await musicRef.current.setVolumeAsync(i / FADE_STEPS)
      } catch (_) { break }
      await new Promise(r => setTimeout(r, stepTime))
    }
  }, [])

  const fadeIn = useCallback(async (sound: Audio.Sound) => {
    const stepTime = FADE_DURATION / FADE_STEPS
    for (let i = 0; i <= FADE_STEPS; i++) {
      try {
        await sound.setVolumeAsync(i / FADE_STEPS)
      } catch (_) { break }
      await new Promise(r => setTimeout(r, stepTime))
    }
  }, [])

  const playMusic = useCallback(async (context: MusicContext) => {
    // Already playing this context — do nothing
    if (currentContext.current === context) return

    // Check the track exists
    const source = MUSIC_TRACKS[context]
    if (!source) return

    // Prevent overlapping fades
    if (isFading.current) return
    isFading.current = true

    try {
      // Fade out existing track
      if (musicRef.current) {
        await fadeOut()
        await stopMusic()
      }

      // Load and play new track
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: true,
        volume: 0,
        shouldPlay: true,
      })
      musicRef.current = sound
      currentContext.current = context

      await fadeIn(sound)
    } catch (e) {
      console.warn('[useAudio] playMusic error:', e)
    } finally {
      isFading.current = false
    }
  }, [fadeOut, fadeIn, stopMusic])

  const crossfadeTo = useCallback(async (context: MusicContext) => {
    await playMusic(context)
  }, [playMusic])

  const playSFX = useCallback(async (name: SFXName) => {
    const source = SFX_TRACKS[name]
    if (!source) return
    try {
      const { sound } = await Audio.Sound.createAsync(source, {
        shouldPlay: true,
        volume: 1,
      })
      // Auto-unload after playing
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync()
        }
      })
    } catch (e) {
      console.warn('[useAudio] playSFX error:', e)
    }
  }, [])

  return { playMusic, crossfadeTo, playSFX, stopMusic }
}