import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export interface Season {
  id: string
  number: number
  startedAt: string
  completedAt: string | null
  totalWins: number
}

const loadSeasons = async (): Promise<Season[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SEASONS)
  return raw ? (JSON.parse(raw) as Season[]) : []
}

const saveSeasons = async (seasons: Season[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons))
}

const createSeason = (number: number): Season => ({
  id: `season_${number}`,
  number,
  startedAt: new Date().toISOString(),
  completedAt: null,
  totalWins: 0,
})

export const useSeasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeasons().then(async data => {
      if (data.length === 0) {
        // First launch — initialize season 1
        const season1 = createSeason(1)
        await saveSeasons([season1])
        setSeasons([season1])
      } else {
        setSeasons(data)
      }
      setLoading(false)
    })
  }, [])

  const getCurrentSeason = useCallback((): Season | undefined => {
    return seasons.find(s => s.completedAt === null)
  }, [seasons])

  const completeSeason = useCallback(
    async (totalWins: number): Promise<Season> => {
      const current = seasons.find(s => s.completedAt === null)
      if (!current) throw new Error('No active season')

      const completedAt = new Date().toISOString()
      const nextNumber = current.number + 1
      const nextSeason = createSeason(nextNumber)

      const updated = seasons.map(s =>
        s.id === current.id ? { ...s, completedAt, totalWins } : s,
      )
      updated.push(nextSeason)

      await saveSeasons(updated)
      setSeasons(updated)
      return nextSeason
    },
    [seasons],
  )

  return { seasons, loading, getCurrentSeason, completeSeason }
}
