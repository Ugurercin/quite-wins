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
import { SCENES } from '@/scenes'
import { COPY } from '@/constants/copy'

interface Props {
  visible: boolean
  triggerScene: Scene | null  // scene user tapped — shown in preview. null = opened from Settings
  onClose: () => void
  onPurchase: () => void      // stub — real IAP in Phase 4c
  onRestore: () => void       // stub
}

const THUMB_W = 60
const THUMB_H = 40

const BundlePaywallSheet = ({ visible, triggerScene, onClose, onPurchase, onRestore }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const s = makeStyles(theme)

  const bundleScenes = SCENES.filter(sc => sc.bundleId === 'night_space_bundle')

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { backgroundColor: theme.background.secondary, paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* 1. Scene preview */}
          {triggerScene && (
            <View style={[s.previewWrap, { borderColor: theme.ui.border }]}>
              <Image
                source={triggerScene.thumbnail}
                style={s.previewImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* 2. Bundle header */}
          <View style={s.headerSection}>
            <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
              <Text style={[s.badgeText, { color: theme.text.secondary }]}>
                {COPY.paywall.bundle.badge}
              </Text>
            </View>
            <Text style={[s.title, { color: theme.text.primary }]}>
              {COPY.paywall.bundle.title}
            </Text>
            <Text style={[s.subtitle, { color: theme.text.secondary }]}>
              {COPY.paywall.bundle.subtitle}
            </Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>
              {COPY.paywall.bundle.note}
            </Text>
            <View style={s.includesList}>
              {COPY.paywall.bundle.includes.map((item, i) => (
                <Text key={i} style={[s.includesItem, { color: theme.text.secondary }]}>{item}</Text>
              ))}
            </View>
          </View>

          {/* 3. What's included */}
          <View style={[s.includedSection, { borderColor: theme.ui.border }]}>
            {bundleScenes.map(sc => {
              const scCopyKey = sc.id as 'night' | 'space'
              const sceneCopy = COPY.paywall.scenes[scCopyKey]
              return (
                <View key={sc.id} style={[s.includedRow, { borderColor: theme.ui.border }]}>
                  <Image
                    source={sc.thumbnail}
                    style={[s.thumb, { borderColor: theme.ui.border }]}
                    resizeMode="cover"
                  />
                  <View style={s.includedText}>
                    <Text style={[s.includedName, { color: theme.text.primary }]}>
                      {sceneCopy?.name ?? sc.name}
                    </Text>
                    <Text style={[s.includedDesc, { color: theme.text.tertiary }]}>
                      {sceneCopy?.description}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          {/* 4. Price row */}
          <View style={s.priceRow}>
            <Text style={[s.price, { color: theme.text.primary }]}>
              {COPY.paywall.bundle.price}
            </Text>
            <Text style={[s.priceSub, { color: theme.text.tertiary }]}>
              {COPY.paywall.bundle.priceSub}
            </Text>
          </View>

          {/* 5. CTA */}
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]}
            onPress={onPurchase}
            activeOpacity={0.88}
          >
            <Text style={[s.ctaText, { color: theme.text.inverse }]}>
              {COPY.paywall.bundle.cta}
            </Text>
          </TouchableOpacity>

          {/* 6. Restore */}
          <TouchableOpacity style={s.restoreBtn} onPress={onRestore} activeOpacity={0.7}>
            <Text style={[s.restoreText, { color: theme.text.tertiary }]}>
              {COPY.paywall.bundle.restore}
            </Text>
          </TouchableOpacity>

          {/* 7. Fine print */}
          <Text style={[s.finePrint, { color: theme.text.tertiary }]}>
            {COPY.paywall.bundle.finePrint}
          </Text>
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
    previewWrap: {
      marginHorizontal: 0,
      borderBottomWidth: 1,
      overflow: 'hidden',
    },
    previewImage: {
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
      marginTop: 2,
      textAlign: 'center',
    },
    includesList: {
      marginTop: 10,
      gap: 6,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.06)',
      alignSelf: 'stretch',
    },
    includesItem: {
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
    includedSection: {
      marginHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 20,
    },
    includedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.ui.border,
    },
    thumb: {
      width: THUMB_W,
      height: THUMB_H,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
    },
    includedText: { flex: 1 },
    includedName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    includedDesc: { fontSize: 12, lineHeight: 16 },
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
      marginBottom: 10,
    },
    ctaText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.1 },
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

export default BundlePaywallSheet
