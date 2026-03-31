import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'

export const NOTIFICATION_MESSAGES = [
  "Your plants miss you. Not in a guilt-trippy way. Just, you know. They're plants.",
  "What did you do today that was worth remembering? Even something small.",
  "You don't have to have a great day. You just have to find one thing in it.",
  "Your garden is waiting. It's very patient. Unlike your inbox.",
  "One win. That's it. You've survived harder things than opening this app.",
  "Today happened. Log something before it disappears.",
  "The tree doesn't judge. It just grows. Give it something to work with.",
  "You did something today. You just haven't written it down yet.",
  "Small wins compound. That's not motivation speak, that's just math.",
  "Still here. Still growing. Log a win before you forget what you did today.",
] as const

// Gentlest two — used when grace skip is active
export const GRACE_NOTIFICATION_MESSAGES = [
  NOTIFICATION_MESSAGES[2],
  NOTIFICATION_MESSAGES[4],
] as const

export async function getNextNotificationMessage(isGrace?: boolean): Promise<string> {
  const pool = isGrace ? GRACE_NOTIFICATION_MESSAGES : NOTIFICATION_MESSAGES
  const lastRaw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_NOTIF_INDEX)
  const last = lastRaw !== null ? parseInt(lastRaw, 10) : -1

  let idx: number
  if (pool.length === 1) {
    idx = 0
  } else {
    do {
      idx = Math.floor(Math.random() * pool.length)
    } while (idx === last)
  }

  await AsyncStorage.setItem(STORAGE_KEYS.LAST_NOTIF_INDEX, String(idx))
  return pool[idx]
}

export async function scheduleDailyNotification(time: string, todayWinCount: number): Promise<void> {
  if (todayWinCount >= 3) {
    await cancelAllNotifications()
    return
  }

  let granted = false
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    granted = status === 'granted'
  } catch {
    return
  }
  if (!granted) return

  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (isNaN(hour) || isNaN(minute)) return

  await cancelAllNotifications()
  const body = await getNextNotificationMessage()

  try {
    await Notifications.scheduleNotificationAsync({
      content: { body },
      trigger: { hour, minute, repeats: true },
    })
  } catch {
    // Fail silently — permissions revoked or invalid trigger
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
  } catch {
    // Fail silently
  }
}

export async function onWinLogged(todayWinCount: number, _notifTime: string): Promise<void> {
  if (todayWinCount >= 3) {
    await cancelAllNotifications()
  }
}
