import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'
import { GROVE_PALETTES } from '@/scenes/grove/palettes'

export const useActivePalette = () => {
  const [activePaletteId, setActivePaletteIdState] = useState<string>('default')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PALETTE).then(id => {
      if (id) {
        const palette = GROVE_PALETTES.find(p => p.id === id)
        if (!palette || !palette.locked) setActivePaletteIdState(id)
      }
    })
  }, [])

  const setActivePalette = (id: string) => {
    setActivePaletteIdState(id)
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PALETTE, id)
  }

  return { activePaletteId, setActivePalette }
}
