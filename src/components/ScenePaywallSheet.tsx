import React from 'react'
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { Scene } from '@/scenes/types'
import { COPY } from '@/constants/copy'

interface Props {
  visible: boolean
  scene: Scene | null
  onClose: () => void
  onPurchase: () => void        // stub — Phase 4c
  onPurchaseBundle: () => void  // stub — opens bundle paywall
  onRestore: () => void         // stub
}

const ScenePaywallSheet = ({ visible, scene, onClose, onPurchase, onPurchaseBundle, onRestore }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const s = makeStyles(theme)

  const copy = scene?.id === 'night'
    ? COPY.paywall.nightScene
    : COPY.paywall.spaceScene

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { backgroundColor: theme.background.secondary, paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* 1. Scene thumbnail */}
          {scene && (
            <View style={[s.thumbWrap, { borderColor: theme.ui.border }]}>
              <Image source={scene.thumbnail} style={s.thumb} resizeMode="cover" />
            </View>
          )}

          {/* 2–6. Header */}
          <View style={s.headerSection}>
            <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
              <Text style={[s.badgeText, { color: theme.text.secondary }]}>{copy.badge}</Text>
            </View>
            <Text style={[s.title, { color: theme.text.primary }]}>{copy.title}</Text>
            <Text style={[s.subtitle, { color: theme.text.secondary }]}>{copy.subtitle}</Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{copy.note}</Text>
          </View>

          {/* 7. Price row */}
          <View style={s.priceRow}>
            <Text style={[s.price, { color: theme.text.primary }]}>{copy.price}</Text>
            <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{copy.priceSub}</Text>
          </View>

          {/* 8. CTA */}
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]}
            onPress={onPurchase}
            activeOpacity={0.88}
          >
            <Text style={[s.ctaText, { color: theme.text.inverse }]}>{copy.cta}</Text>
          </TouchableOpacity>

          {/* 9. Bundle upsell banner */}
          <TouchableOpacity
            style={[s.upsellBanner, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}
            onPress={onPurchaseBundle}
            activeOpacity={0.85}
          >
            <Text style={[s.upsellText, { color: theme.text.secondary }]}>{copy.bundleUpsell}</Text>
          </TouchableOpacity>

          {/* 10. Restore */}
          <TouchableOpacity style={s.restoreBtn} onPress={onRestore} activeOpacity={0.7}>
            <Text style={[s.restoreText, { color: theme.text.tertiary }]}>{copy.restore}</Text>
          </TouchableOpacity>

          {/* 11. Fine print */}
          <Text style={[s.finePrint, { color: theme.text.tertiary }]}>{copy.finePrint}</Text>
        </ScrollView>
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
      maxHeight: '90%',
    },
    handle: {
      width: 40, height: 4, borderRadius: 2,
      alignSelf: 'center', marginBottom: 16,
    },
    thumbWrap: {
      borderBottomWidth: 1,
      overflow: 'hidden',
    },
    thumb: {
      width: '100%',
      height: 180,
    },
    headerSection: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 12,
      alignItems: 'center',
      gap: 8,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
    },
    badgeText: { fontSize: 13, fontWeight: '600' },
    title: { fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: -0.3 },
    subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
    itemNote: {
      fontSize: 11,
      fontStyle: 'italic',
      lineHeight: 16,
      textAlign: 'center',
      marginTop: 2,
    },
    priceRow: {
      alignItems: 'center',
      marginBottom: 16,
      gap: 3,
    },
    price: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
    priceSub: { fontSize: 13 },
    ctaBtn: {
      marginHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    ctaText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.1 },
    upsellBanner: {
      marginHorizontal: 20,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: 'center',
      marginBottom: 4,
    },
    upsellText: { fontSize: 14, fontWeight: '600' },
    restoreBtn: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    restoreText: { fontSize: 13 },
    finePrint: {
      fontSize: 11,
      textAlign: 'center',
      paddingHorizontal: 24,
      paddingBottom: 8,
      lineHeight: 16,
    },
  })

export default ScenePaywallSheet
