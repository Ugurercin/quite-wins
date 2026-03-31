import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { Scene } from '@/scenes/types'
import { SCENES } from '@/scenes'

const CARD_W = 140
const CARD_H = 100

interface Props {
  visible: boolean
  activeSceneId: string
  onSelect: (id: string) => void
  onClose: () => void
}

const ScenePickerSheet = ({ visible, activeSceneId, onSelect, onClose }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const [lockedNotice, setLockedNotice] = useState<string | null>(null)
  const s = makeStyles(theme)

  const handleCardPress = (scene: Scene) => {
    if (scene.locked) {
      setLockedNotice(scene.id)
      setTimeout(() => setLockedNotice(null), 2000)
      return
    }
    onSelect(scene.id)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { backgroundColor: theme.background.secondary, paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

        <Text style={[s.title, { color: theme.text.secondary }]}>Your world</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.scrollRow}
        >
          {SCENES.map(scene => {
            const colors = scene.getColors(theme)
            const isActive = scene.id === activeSceneId
            const isLocked = scene.locked
            const showNotice = lockedNotice === scene.id

            return (
              <View key={scene.id} style={s.cardWrap}>
                <TouchableOpacity
                  onPress={() => handleCardPress(scene)}
                  activeOpacity={0.85}
                  style={[
                    s.card,
                    {
                      borderColor: isActive ? theme.brand.light : theme.ui.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  {scene.PreviewCanvas ? (
                    <scene.PreviewCanvas width={CARD_W} height={CARD_H} colors={colors} />
                  ) : (
                    <View style={[s.colorSwatch, { backgroundColor: colors.backgroundGarden }]} />
                  )}

                  {/* Active checkmark */}
                  {isActive && (
                    <View style={s.checkOverlay}>
                      <View style={[s.checkBadge, { backgroundColor: theme.brand.light }]}>
                        <Text style={[s.checkText, { color: theme.text.inverse }]}>✓</Text>
                      </View>
                    </View>
                  )}

                  {/* Locked overlay */}
                  {isLocked && (
                    <View style={s.lockOverlay}>
                      <Text style={s.lockIcon}>🔒</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text style={[s.cardName, { color: theme.text.secondary }]}>{scene.name}</Text>

                {showNotice && (
                  <Text style={[s.comingSoon, { color: theme.text.tertiary }]}>Coming soon</Text>
                )}
              </View>
            )
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
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
      paddingTop: 12,
      paddingHorizontal: 20,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.3,
      marginBottom: 14,
    },
    scrollRow: {
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 4,
    },
    cardWrap: {
      alignItems: 'center',
      gap: 8,
    },
    card: {
      width: CARD_W,
      height: CARD_H,
      borderRadius: 14,
      overflow: 'hidden',
    },
    colorSwatch: {
      width: CARD_W,
      height: CARD_H,
    },
    checkOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      padding: 6,
    },
    checkBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkText: {
      fontSize: 12,
      fontWeight: '700',
    },
    lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.52)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    lockIcon: {
      fontSize: 22,
    },
    cardName: {
      fontSize: 13,
      fontWeight: '600',
    },
    comingSoon: {
      fontSize: 11,
      fontWeight: '500',
    },
  })

export default ScenePickerSheet
