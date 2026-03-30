import { useMemo } from 'react'
import { useWins, Win } from '@/hooks/useWins'

export interface DayGroup {
  dateStr: string  // 'YYYY-MM-DD'
  label: string    // 'Today', 'Yesterday', or 'March 28' / 'March 28, 2025'
  wins: Win[]      // sorted newest-first within the day
}

const formatDateLabel = (dateStr: string): string => {
  const d = new Date(dateStr + 'T12:00:00')
  const thisYear = new Date().getFullYear()
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === thisYear
      ? { month: 'long', day: 'numeric' }
      : { month: 'long', day: 'numeric', year: 'numeric' }
  return d.toLocaleDateString('en-US', opts)
}

export const useHistory = () => {
  const { wins, loading, deleteWin } = useWins()

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const groups: DayGroup[] = useMemo(() => {
    // Group wins by calendar day
    const map = new Map<string, Win[]>()
    wins.forEach(win => {
      const day = win.createdAt.split('T')[0]
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(win)
    })

    // Sort each group newest-first within the day, then sort groups newest-first
    return [...map.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateStr, dayWins]) => ({
        dateStr,
        label:
          dateStr === today
            ? 'Today'
            : dateStr === yesterday
              ? 'Yesterday'
              : formatDateLabel(dateStr),
        wins: [...dayWins].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wins])

  return { groups, loading, deleteWin, totalWins: wins.length }
}
