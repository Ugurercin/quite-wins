import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { Theme } from '@/theme/theme'
import { Season } from '@/hooks/useSeasons'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'
import GardenCanvas from '@/scenes/grove/GardenCanvas'
import { DEFAULT_SCENE } from '@/scenes'

interface Props {
  season: Season | null
  plants: Plant[]
  wins: Win[]
  theme: Theme
  onClose: () => void
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const SeasonSnapshotModal = ({ season, plants, wins, theme, onClose }: Props) => {
  const { width } = useWindowDimensions()

  if (!season) return null

  const canvasHeight = width * 0.7
  const sceneColors = DEFAULT_SCENE.getColors(theme)
  const s = makeStyles(theme)

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { backgroundColor: theme.background.secondary }]}>
        <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

        <View style={s.header}>
          <View>
            <Text style={[s.title, { color: theme.text.primary }]}>Season {season.number}</Text>
            <Text style={[s.subtitle, { color: theme.text.secondary }]}>
              {season.totalWins} wins · Completed {formatDate(season.completedAt!)}
            </Text>
          </View>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={[s.closeBtnText, { color: theme.text.secondary }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.canvasWrap, { borderColor: theme.ui.border }]}>
          <GardenCanvas
            width={width}
            height={canvasHeight}
            colors={sceneColors}
            theme={theme}
            plants={plants}
            wins={wins}
          />
        </View>

        <Text style={[s.hint, { color: theme.text.tertiary }]}>
          A snapshot of everything you grew.
        </Text>
      </View>
    </Modal>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: { flex: 1 },
    sheet: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingBottom: 36,
    },
    handle: {
      width: 40, height: 4, borderRadius: 2,
      alignSelf: 'center', marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: { fontSize: 20, fontWeight: '700' },
    subtitle: { fontSize: 13, marginTop: 3 },
    closeBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    closeBtnText: { fontSize: 16, fontWeight: '500' },
    canvasWrap: {
      marginHorizontal: 16,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
    },
    hint: { fontSize: 12, textAlign: 'center', marginTop: 12 },
  })

export default SeasonSnapshotModal