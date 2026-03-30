import React, { useRef } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Theme } from '@/theme/theme'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'
import SwipeableWinRow from '@/components/SwipeableWinRow'

interface Props {
  plant: Plant | null
  wins: Win[]
  theme: Theme
  onClose: () => void
  onDeleteWin: (winId: string) => Promise<void>
}

const STAGE_LABELS = ['', 'Sprout', 'Seedling', 'Growing', 'Bloomed']

const PlantPopup = ({ plant, wins, theme, onClose, onDeleteWin }: Props) => {
  // scrollRef is forwarded to each Swipeable — prevents ScrollView eating horizontal pans
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
        GestureHandlerRootView must live INSIDE the Modal — RN Modals render
        in a separate native hierarchy that the app-root GHRootView can't reach.
      */}
      <GestureHandlerRootView style={s.root}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
        </TouchableWithoutFeedback>

        <View style={[s.sheet, { backgroundColor: theme.background.secondary }]}>
          <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

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

          {plantWins.length > 0 && (
            <Text style={[s.hint, { color: theme.text.tertiary }]}>
              Swipe left on a win to release it
            </Text>
          )}

          <ScrollView
            ref={scrollRef}
            style={s.list}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {plantWins.map(win => (
              <SwipeableWinRow
                key={win.id}
                win={win}
                theme={theme}
                scrollRef={scrollRef}
                onDeleteWin={onDeleteWin}
              />
            ))}
            {plantWins.length === 0 && (
              <Text style={[s.empty, { color: theme.text.tertiary }]}>
                No wins left in this plant.
              </Text>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { flex: 1 },
    overlay: { flex: 1 },
    sheet: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '65%',
      paddingTop: 12,
    },
    handle: {
      width: 40, height: 4, borderRadius: 2,
      alignSelf: 'center', marginBottom: 16,
    },
    header: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 10,
    },
    stageName: { fontSize: 20, fontWeight: '700' },
    winsCount: { fontSize: 13, marginTop: 2 },
    closeBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    closeBtnText: { fontSize: 16, fontWeight: '500' },
    hint: { fontSize: 12, paddingHorizontal: 20, marginBottom: 8 },
    list: { flex: 1 },
    empty: { padding: 24, textAlign: 'center', fontSize: 14 },
  })

export default PlantPopup
