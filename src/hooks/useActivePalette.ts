import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export const useActivePalette = () => {
  const [activePaletteId, setActivePaletteIdState] = useState<string>('default')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PALETTE).then(id => {
      if (id) setActivePaletteIdState(id)
    })
  }, [])

  const setActivePalette = (id: string) => {
    setActivePaletteIdState(id)
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PALETTE, id)
  }

  return { activePaletteId, setActivePalette }
}
