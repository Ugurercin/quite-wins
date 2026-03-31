import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'
import { ELDER_SLOT_INDICES, REGULAR_SLOT_INDICES } from '@/utils/gardenPositions'
import { PlantType, randomPlantType } from '@/scenes/grove/plants/plantTypes'

export interface Plant {
  id: string
  slotIndex: number
  stage: 0 | 1 | 2 | 3 | 4
  winIds: string[]
  isElder: boolean
  seasonId: string
  plantType: PlantType
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

const nextRegularSlot = (plants: Plant[]): number => {
  const used = new Set(plants.map(p => p.slotIndex))
  for (const idx of REGULAR_SLOT_INDICES) {
    if (!used.has(idx)) return idx
  }
  return plants.length
}

const nextElderSlot = (plants: Plant[]): number => {
  const used = new Set(plants.map(p => p.slotIndex))
  for (const idx of ELDER_SLOT_INDICES) {
    if (!used.has(idx)) return idx
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

  const growPlant = useCallback(
    async (winId: string, seasonId: string): Promise<Plant[]> => {
      const current = [...plants]
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
        const newPlant: Plant = {
          id: generateId(),
          slotIndex: nextRegularSlot(current),
          stage: 1,
          winIds: [winId],
          isElder: false,
          seasonId,
          plantType: randomPlantType(),
        }
        updated = [...current, newPlant]
      }

      await savePlants(updated)
      setPlants(updated)
      return updated
    },
    [plants],
  )

  const shrinkPlant = useCallback(
    async (winId: string): Promise<Plant[]> => {
      const current = [...plants]
      const target = current.find(p => p.winIds.includes(winId))
      if (!target) return current

      const newWinIds = target.winIds.filter(id => id !== winId)
      const newStage = Math.max(0, target.stage - 1) as 0 | 1 | 2 | 3 | 4

      let updated: Plant[]
      if (newStage === 0) {
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

  // Season transition:
  // - keep all existing elder trees
  // - remove all regular plants from the finished season
  // - add exactly ONE new elder if the user selected one
  const transitionSeason = useCallback(
    async (seasonId: string, chosenElderType: PlantType | null): Promise<Plant[]> => {
      const current = await loadPlants()
      const existingElders = current.filter(p => p.isElder)

      let working = [...existingElders]

      if (chosenElderType) {
        const slot = nextElderSlot(working)

        const elder: Plant = {
          id: generateId(),
          slotIndex: slot,
          stage: 4,
          winIds: [],
          isElder: true,
          seasonId,
          plantType: chosenElderType,
        }

        working = [...working, elder]
      }

      await savePlants(working)
      setPlants(working)
      return working
    },
    [],
  )

  const addElderTree = useCallback(
    async (seasonId: string, plantType: PlantType): Promise<Plant[]> => {
      const current = await loadPlants()
      const elder: Plant = {
        id: generateId(),
        slotIndex: nextElderSlot(current),
        stage: 4,
        winIds: [],
        isElder: true,
        seasonId,
        plantType,
      }
      const updated = [...current, elder]
      await savePlants(updated)
      setPlants(updated)
      return updated
    },
    [],
  )

  const clearAllPlants = useCallback(async (): Promise<void> => {
    await savePlants([])
    setPlants([])
  }, [])

  const clearNonElderPlants = useCallback(async (): Promise<Plant[]> => {
    const current = await loadPlants()
    const eldersOnly = current.filter(p => p.isElder)
    await savePlants(eldersOnly)
    setPlants(eldersOnly)
    return eldersOnly
  }, [])

  return {
    plants,
    loading,
    growPlant,
    shrinkPlant,
    transitionSeason,
    addElderTree,
    clearAllPlants,
    clearNonElderPlants,
  }
}