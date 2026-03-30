import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Theme } from '@/theme/theme'
import { Win } from '@/hooks/useWins'
import { pickReleaseMessage } from '@/utils/releaseMessages'

interface Props {
  win: Win
  theme: Theme
  scrollRef: React.RefObject<ScrollView | null>
  onDeleteWin: (id: string) => Promise<void>
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const SwipeableWinRow = ({ win, theme, scrollRef, onDeleteWin }: Props) => {
  const swipeRef = useRef<Swipeable>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const [deleting, setDeleting] = useState(false)
  const s = makeStyles(theme)

  const handleSwipePress = () => {
    swipeRef.current?.close()
    setConfirmMsg(pickReleaseMessage())
    setConfirming(true)
  }

  const handleConfirm = async () => {
    setDeleting(true)
    await onDeleteWin(win.id)
  }

  const renderRightActions = () => (
    <TouchableOpacity
      style={s.swipeAction}
      onPress={handleSwipePress}
      accessibilityLabel="Let this win go"
    >
      <Text style={s.swipeEmoji}>🍂</Text>
      <Text style={[s.swipeLabel, { color: theme.accent.amber }]}>Let it go</Text>
    </TouchableOpacity>
  )

  if (confirming) {
    return (
      <View style={[s.row, s.confirmRow, { backgroundColor: theme.background.secondary, borderBottomColor: theme.ui.border }]}>
        <Text style={[s.confirmMsg, { color: theme.text.secondary }]}>{confirmMsg}</Text>
        <View style={s.confirmBtns}>
          <TouchableOpacity
            style={[s.btn, { borderColor: theme.ui.borderStrong }]}
            onPress={() => setConfirming(false)}
            disabled={deleting}
          >
            <Text style={[s.btnText, { color: theme.text.secondary }]}>Keep it</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: theme.accent.amber + '28', borderColor: theme.accent.amber + '60' }]}
            onPress={handleConfirm}
            disabled={deleting}
          >
            <Text style={[s.btnText, { color: theme.accent.amber }]}>
              {deleting ? '…' : '🍂 Let it go'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      simultaneousHandlers={scrollRef}
    >
      <View style={[s.row, { backgroundColor: theme.background.secondary, borderBottomColor: theme.ui.border }]}>
        <Text style={s.emoji}>{win.emoji}</Text>
        <View style={s.textBlock}>
          <Text style={[s.winText, { color: theme.text.primary }]} numberOfLines={2}>
            {win.text}
          </Text>
          <Text style={[s.meta, { color: theme.text.tertiary }]}>
            {formatDate(win.createdAt)} · {formatTime(win.createdAt)}
          </Text>
        </View>
      </View>
    </Swipeable>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    emoji: { fontSize: 26, marginRight: 14, width: 34, textAlign: 'center' },
    textBlock: { flex: 1 },
    winText: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
    meta: { fontSize: 12, marginTop: 3 },
    swipeAction: {
      backgroundColor: theme.accent.amber + '28',
      justifyContent: 'center',
      alignItems: 'center',
      width: 88,
      gap: 3,
    },
    swipeEmoji: { fontSize: 18 },
    swipeLabel: { fontSize: 11, fontWeight: '600' },
    confirmRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    confirmMsg: { fontSize: 14, lineHeight: 20 },
    confirmBtns: { flexDirection: 'row', gap: 10 },
    btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
    btnText: { fontSize: 14, fontWeight: '600' },
  })

export default SwipeableWinRow
