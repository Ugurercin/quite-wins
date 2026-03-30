import React, { useRef, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { Theme } from '@/theme/theme'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'

interface Props {
  plant: Plant | null
  wins: Win[]
  theme: Theme
  onClose: () => void
  onDeleteWin: (winId: string) => Promise<void>
}

const STAGE_LABELS = ['', 'Sprout', 'Seedling', 'Growing', 'Bloomed']

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const RELEASE_MESSAGES = [
  'Even gardens need pruning. Let it go. 🍂',
  'The soil remembers, even when you let go.',
  'Roots grow deeper when you release what no longer serves.',
  'Every leaf that falls makes room for new growth.',
  'It happened. It counted. That\'s enough.',
  'Something better replaced it. Release this win.',
  'You logged it. You lived it. Now let it go.',
]

// Module-level ref so it persists across WinRow remounts within the same session
let lastMsgIndex = -1

const pickMessage = (): string => {
  let idx
  do {
    idx = Math.floor(Math.random() * RELEASE_MESSAGES.length)
  } while (idx === lastMsgIndex)
  lastMsgIndex = idx
  return RELEASE_MESSAGES[idx]
}

// Single win row — manages its own swipe + confirmation state
const WinRow = ({
  win,
  theme,
  scrollRef,
  onDeleteWin,
}: {
  win: Win
  theme: Theme
  scrollRef: React.RefObject<ScrollView | null>
  onDeleteWin: (id: string) => Promise<void>
}) => {
  const swipeRef = useRef<Swipeable>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const [deleting, setDeleting] = useState(false)
  const s = rowStyles(theme)

  const handleSwipeButtonPress = () => {
    swipeRef.current?.close()
    setConfirmMsg(pickMessage())
    setConfirming(true)
  }

  const handleConfirm = async () => {
    setDeleting(true)
    await onDeleteWin(win.id)
  }

  const renderRightActions = () => (
    <TouchableOpacity
      style={s.swipeAction}
      onPress={handleSwipeButtonPress}
      accessibilityLabel="Let this win go"
    >
      <Text style={s.swipeActionEmoji}>🍂</Text>
      <Text style={[s.swipeActionText, { color: theme.accent.amber }]}>Let it go</Text>
    </TouchableOpacity>
  )

  if (confirming) {
    return (
      <View style={[s.row, s.confirmRow, { backgroundColor: theme.background.secondary, borderBottomColor: theme.ui.border }]}>
        <Text style={[s.confirmMsg, { color: theme.text.secondary }]}>
          {confirmMsg}
        </Text>
        <View style={s.confirmBtns}>
          <TouchableOpacity
            style={[s.confirmBtn, { borderColor: theme.ui.borderStrong }]}
            onPress={() => setConfirming(false)}
            disabled={deleting}
          >
            <Text style={[s.confirmBtnText, { color: theme.text.secondary }]}>Keep it</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.confirmBtn, s.letItGoBtn, { backgroundColor: theme.accent.amber + '28', borderColor: theme.accent.amber + '60' }]}
            onPress={handleConfirm}
            disabled={deleting}
          >
            <Text style={[s.confirmBtnText, { color: theme.accent.amber }]}>
              {deleting ? '…' : '🍂 Let it go'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    // simultaneousHandlers lets the swipe coexist with the parent ScrollView
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

const rowStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    emoji: {
      fontSize: 26,
      marginRight: 14,
      width: 34,
      textAlign: 'center',
    },
    textBlock: {
      flex: 1,
    },
    winText: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: '500',
    },
    meta: {
      fontSize: 12,
      marginTop: 3,
    },
    // Swipe-reveal action — warm amber, not aggressive red
    swipeAction: {
      backgroundColor: theme.accent.amber + '28',
      justifyContent: 'center',
      alignItems: 'center',
      width: 88,
      gap: 3,
    },
    swipeActionEmoji: {
      fontSize: 18,
    },
    swipeActionText: {
      fontSize: 11,
      fontWeight: '600',
    },
    confirmRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    confirmMsg: {
      fontSize: 14,
      lineHeight: 20,
    },
    confirmBtns: {
      flexDirection: 'row',
      gap: 10,
    },
    confirmBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
    },
    letItGoBtn: {
      borderWidth: 1,
    },
    confirmBtnText: {
      fontSize: 14,
      fontWeight: '600',
    },
  })

// Main popup
const PlantPopup = ({ plant, wins, theme, onClose, onDeleteWin }: Props) => {
  // scrollRef is forwarded to each Swipeable so horizontal swipes coexist
  // with the vertical ScrollView on real devices
  const scrollRef = useRef<ScrollView>(null)

  if (!plant) return null

  const plantWins = plant.winIds
    .map(id => wins.find(w => w.id === id))
    .filter((w): w is Win => !!w)

  const stageLabel = plant.isElder ? 'Elder Tree' : STAGE_LABELS[plant.stage] ?? 'Plant'
  const s = makeStyles(theme)

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      {/*
        GestureHandlerRootView must live INSIDE the Modal.
        React Native Modals render in a separate native view hierarchy —
        the app-root GestureHandlerRootView does not reach inside them,
        so Swipeable gestures silently fail on real devices.
      */}
      <GestureHandlerRootView style={s.gestureRoot}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
        </TouchableWithoutFeedback>

        <View style={[s.sheet, { backgroundColor: theme.background.secondary }]}>
          {/* Handle bar */}
          <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={[s.stageName, { color: theme.text.primary }]}>{stageLabel}</Text>
              <Text style={[s.winsCount, { color: theme.text.secondary }]}>
                {plantWins.length} {plantWins.length === 1 ? 'win' : 'wins'} in this plant
              </Text>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={[s.closeBtnText, { color: theme.text.secondary }]}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Hint */}
          {plantWins.length > 0 && (
            <Text style={[s.hint, { color: theme.text.tertiary }]}>
              Swipe left on a win to release it
            </Text>
          )}

          {/* Wins list */}
          <ScrollView
            ref={scrollRef}
            style={s.list}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {plantWins.map(win => (
              <WinRow
                key={win.id}
                win={win}
                theme={theme}
                scrollRef={scrollRef}
                onDeleteWin={onDeleteWin}
              />
            ))}
            {plantWins.length === 0 && (
              <Text style={[s.emptyText, { color: theme.text.tertiary }]}>
                No wins left in this plant.
              </Text>
            )}
            <View style={s.listPad} />
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    gestureRoot: {
      flex: 1,
    },
    overlay: {
      flex: 1,
    },
    sheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '65%',
      paddingTop: 12,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    stageName: {
      fontSize: 20,
      fontWeight: '700',
    },
    winsCount: {
      fontSize: 13,
      marginTop: 2,
    },
    closeBtn: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    closeBtnText: {
      fontSize: 16,
      fontWeight: '500',
    },
    hint: {
      fontSize: 12,
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    list: {
      flex: 1,
    },
    emptyText: {
      padding: 24,
      textAlign: 'center',
      fontSize: 14,
    },
    listPad: {
      height: 40,
    },
  })

export default PlantPopup
