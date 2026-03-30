import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export interface StreakState {
  current: number
  longest: number
  lastLoggedDate: string
  graceUsedThisWeek: boolean
  graceWeekStart: string
}

const DEFAULT_STREAK: StreakState = {
  current: 0,
  longest: 0,
  lastLoggedDate: '',
  graceUsedThisWeek: false,
  graceWeekStart: '',
}

const toDateStr = (date: Date): string => date.toISOString().split('T')[0]

const getMondayOf = (date: Date): string => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateStr(d)
}

const daysBetween = (a: string, b: string): number => {
  const msPerDay = 86400000
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay,
  )
}

const loadStreak = async (): Promise<StreakState> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.STREAK)
  return raw ? (JSON.parse(raw) as StreakState) : { ...DEFAULT_STREAK }
}

const saveStreak = async (state: StreakState): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(state))
}

export const useStreak = () => {
  const [streak, setStreak] = useState<StreakState>({ ...DEFAULT_STREAK })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStreak().then(data => {
      setStreak(data)
      setLoading(false)
    })
  }, [])

  // Call after a win is logged.
  const updateStreak = useCallback(async (): Promise<StreakState> => {
    const today = toDateStr(new Date())
    const s = await loadStreak()

    if (s.lastLoggedDate === today) {
      // Already logged today — streak unchanged
      return s
    }

    let newCurrent = s.current
    if (!s.lastLoggedDate) {
      newCurrent = 1
    } else {
      const diff = daysBetween(s.lastLoggedDate, today)
      if (diff === 1) {
        newCurrent = s.current + 1
      } else {
        newCurrent = 1
      }
    }

    const updated: StreakState = {
      ...s,
      current: newCurrent,
      longest: Math.max(s.longest, newCurrent),
      lastLoggedDate: today,
    }

    await saveStreak(updated)
    setStreak(updated)
    return updated
  }, [])

  // Call on app open to check if grace skip should be applied.
  const checkGrace = useCallback(async (): Promise<{ reset: boolean; graceApplied: boolean }> => {
    const today = toDateStr(new Date())
    const s = await loadStreak()

    if (!s.lastLoggedDate) return { reset: false, graceApplied: false }

    const diff = daysBetween(s.lastLoggedDate, today)
    if (diff <= 1) return { reset: false, graceApplied: false }

    // Missed at least one day
    const thisMonday = getMondayOf(new Date())
    const graceWeekIsCurrent = s.graceWeekStart === thisMonday

    // Reset grace if new week
    const graceAvailable = !s.graceUsedThisWeek || !graceWeekIsCurrent

    if (diff === 2 && graceAvailable) {
      // Missed exactly 1 day, grace available — apply it silently
      const updated: StreakState = {
        ...s,
        graceUsedThisWeek: true,
        graceWeekStart: thisMonday,
      }
      await saveStreak(updated)
      setStreak(updated)
      return { reset: false, graceApplied: true }
    }

    // Streak reset
    const updated: StreakState = {
      ...s,
      current: 0,
      graceWeekStart: graceWeekIsCurrent ? s.graceWeekStart : thisMonday,
    }
    await saveStreak(updated)
    setStreak(updated)
    return { reset: true, graceApplied: false }
  }, [])

  // Recalculate streak from scratch after a win is deleted.
  // Accepts ISO date strings (win.createdAt values) for the remaining wins.
  // Returns { wasReset } so callers can show a gentle message when streak drops to 0.
  const recalculateStreak = useCallback(
    async (winDates: string[]): Promise<{ wasReset: boolean }> => {
      // Unique calendar days that still have wins, ascending
      const days = [...new Set(winDates.map(d => d.split('T')[0]))].sort()
      const s = await loadStreak()
      const prevCurrent = s.current

      if (days.length === 0) {
        const updated: StreakState = { ...s, current: 0, lastLoggedDate: '' }
        await saveStreak(updated)
        setStreak(updated)
        return { wasReset: prevCurrent > 0 }
      }

      const lastDate = days[days.length - 1]
      const today = toDateStr(new Date())

      // Count consecutive days working backwards from lastDate
      let current = 1
      for (let i = days.length - 1; i > 0; i--) {
        if (daysBetween(days[i - 1], days[i]) === 1) {
          current++
        } else {
          break
        }
      }

      // If lastDate is more than 1 day ago the streak has expired
      if (daysBetween(lastDate, today) > 1) {
        current = 0
      }

      const updated: StreakState = {
        ...s,
        current,
        longest: Math.max(s.longest, current),
        lastLoggedDate: lastDate,
      }
      await saveStreak(updated)
      setStreak(updated)
      return { wasReset: prevCurrent > 0 && current === 0 }
    },
    [],
  )

  const getCurrentStreak = useCallback((): number => streak.current, [streak])

  // True when the user has a grace skip available this week.
  const graceAvailable =
    !streak.graceUsedThisWeek ||
    streak.graceWeekStart !== getMondayOf(new Date())

  return { streak, loading, updateStreak, checkGrace, getCurrentStreak, recalculateStreak, graceAvailable }
}
