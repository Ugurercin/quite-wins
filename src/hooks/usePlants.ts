import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export interface Plant {
  id: string
  slotIndex: number
  stage: 0 | 1 | 2 | 3 | 4
  winIds: string[]
  isElder: boolean
  seasonId: string
}

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2)

const loadPlants = async (): Promise<Plant[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PLANTS)
  return raw ? (JSON.parse(raw) as Plant[]) : []
}

const savePlants = async (plants: Plant[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants))
}

const nextSlotIndex = (plants: Plant[]): number => {
  const used = new Set(plants.map(p => p.slotIndex))
  for (let i = 0; i < 10; i++) {
    if (!used.has(i)) return i
  }
  return plants.length
}

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlants().then(data => {
      setPlants(data)
      setLoading(false)
    })
  }, [])

  // Grow the current active plant by one stage, adding the win.
  // If no active plant exists (or current plant is fully bloomed), creates a new one.
  const growPlant = useCallback(
    async (winId: string, seasonId: string): Promise<Plant[]> => {
      const current = [...plants]

      // Find an active (non-elder, not fully bloomed) plant for this season
      const activePlant = current.find(
        p => !p.isElder && p.stage < 4 && p.seasonId === seasonId,
      )

      let updated: Plant[]
      if (activePlant) {
        updated = current.map(p => {
          if (p.id !== activePlant.id) return p
          const newStage = Math.min(p.stage + 1, 4) as 0 | 1 | 2 | 3 | 4
          return { ...p, stage: newStage, winIds: [...p.winIds, winId] }
        })
      } else {
        // Create new plant in next available slot
        const newPlant: Plant = {
          id: generateId(),
          slotIndex: nextSlotIndex(current),
          stage: 1,
          winIds: [winId],
          isElder: false,
          seasonId,
        }
        updated = [...current, newPlant]
      }

      await savePlants(updated)
      setPlants(updated)
      return updated
    },
    [plants],
  )

  // Shrink the plant that owns this win by one stage.
  const shrinkPlant = useCallback(
    async (winId: string): Promise<Plant[]> => {
      const current = [...plants]
      const target = current.find(p => p.winIds.includes(winId))
      if (!target) return current

      let updated: Plant[]
      const newWinIds = target.winIds.filter(id => id !== winId)
      const newStage = Math.max(0, target.stage - 1) as 0 | 1 | 2 | 3 | 4

      if (newStage === 0) {
        // Remove the plant entirely (keep gap — don't rearrange)
        updated = current.filter(p => p.id !== target.id)
      } else {
        updated = current.map(p =>
          p.id === target.id ? { ...p, stage: newStage, winIds: newWinIds } : p,
        )
      }

      await savePlants(updated)
      setPlants(updated)
      return updated
    },
    [plants],
  )

  const addElderTree = useCallback(
    async (seasonId: string): Promise<Plant[]> => {
      const slotIndex = nextSlotIndex(plants)
      const elder: Plant = {
        id: generateId(),
        slotIndex,
        stage: 4,
        winIds: [],
        isElder: true,
        seasonId,
      }
      const updated = [...plants, elder]
      await savePlants(updated)
      setPlants(updated)
      return updated
    },
    [plants],
  )

  // Add N elder trees in a single AsyncStorage write, avoiding stale-closure issues
  // that would occur with N sequential addElderTree calls.
  const addElderTrees = useCallback(
    async (count: number, seasonId: string): Promise<Plant[]> => {
      let working = [...plants]
      for (let i = 0; i < count; i++) {
        const elder: Plant = {
          id: generateId(),
          slotIndex: nextSlotIndex(working),
          stage: 4,
          winIds: [],
          isElder: true,
          seasonId,
        }
        working = [...working, elder]
      }
      await savePlants(working)
      setPlants(working)
      return working
    },
    [plants],
  )

  // Called on season transition — removes all non-elder plants so the new season
  // starts with only Elder Trees. Elder Trees carry forward permanently.
  // Reads from AsyncStorage directly to avoid using a stale state closure
  // (growPlant may have set new state that hasn't re-rendered yet).
  const clearNonElderPlants = useCallback(async (): Promise<Plant[]> => {
    const current = await loadPlants()
    const eldersOnly = current.filter(p => p.isElder)
    await savePlants(eldersOnly)
    setPlants(eldersOnly)
    return eldersOnly
  }, [])

  return { plants, loading, growPlant, shrinkPlant, addElderTree, addElderTrees, clearNonElderPlants }
}
