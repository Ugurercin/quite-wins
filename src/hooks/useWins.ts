import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export interface Win {
  id: string
  text: string
  emoji: string
  createdAt: string
  seasonId: string
}

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2)

const loadWins = async (): Promise<Win[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.WINS)
  return raw ? (JSON.parse(raw) as Win[]) : []
}

const saveWins = async (wins: Win[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(wins))
}

export const useWins = () => {
  const [wins, setWins] = useState<Win[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWins().then(data => {
      setWins(data)
      setLoading(false)
    })
  }, [])

  const addWin = useCallback(
    async (text: string, emoji: string, seasonId: string): Promise<Win> => {
      const win: Win = {
        id: generateId(),
        text,
        emoji,
        createdAt: new Date().toISOString(),
        seasonId,
      }
      const updated = [...wins, win]
      await saveWins(updated)
      setWins(updated)
      return win
    },
    [wins],
  )

  const deleteWin = useCallback(
    async (id: string): Promise<void> => {
      const updated = wins.filter(w => w.id !== id)
      await saveWins(updated)
      setWins(updated)
    },
    [wins],
  )

  const getWinsForDay = useCallback(
    (dateStr: string): Win[] => {
      return wins.filter(w => w.createdAt.startsWith(dateStr))
    },
    [wins],
  )

  const getAllWins = useCallback((): Win[] => wins, [wins])

  return { wins, loading, addWin, deleteWin, getWinsForDay, getAllWins }
}
