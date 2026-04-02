import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { GROVE_PALETTES } from '@/scenes/grove/palettes'
import { COPY } from '@/constants/copy'

interface Props {
  visible: boolean
  onClose: () => void
  onPurchase: () => void   // stub — Phase 4c
  onRestore: () => void    // stub
}

const PalettePaywallSheet = ({ visible, onClose, onPurchase, onRestore }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const s = makeStyles(theme)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { backgroundColor: theme.background.secondary, paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
        <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* 1. Palette preview row */}
          <View style={s.previewRow}>
            {GROVE_PALETTES.map(palette => (
              <View key={palette.id} style={s.previewItem}>
                <View style={[s.previewDot, { backgroundColor: palette.dotColor }]} />
                <Text style={[s.previewDotName, { color: theme.text.tertiary }]} numberOfLines={1}>
                  {COPY.paywall.palettes[palette.id as keyof typeof COPY.paywall.palettes]?.name ?? palette.name}
                </Text>
              </View>
            ))}
          </View>

          {/* 2. Bundle header */}
          <View style={s.headerSection}>
            <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
              <Text style={[s.badgeText, { color: theme.text.secondary }]}>
                {COPY.paywall.paletteBundle.badge}
              </Text>
            </View>
            <Text style={[s.title, { color: theme.text.primary }]}>
              {COPY.paywall.paletteBundle.title}
            </Text>
            <Text style={[s.subtitle, { color: theme.text.secondary }]}>
              {COPY.paywall.paletteBundle.subtitle}
            </Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>
              {COPY.paywall.paletteBundle.note}
            </Text>
            <View style={s.includesList}>
              {COPY.paywall.paletteBundle.includes.map((item, i) => (
                <Text key={i} style={[s.includesItem, { color: theme.text.secondary }]}>{item}</Text>
              ))}
            </View>
          </View>

          {/* 3. Palette list */}
          <View style={[s.listSection, { borderColor: theme.ui.border }]}>
            {GROVE_PALETTES.map((palette, idx) => {
              const paletteCopy = COPY.paywall.palettes[palette.id as keyof typeof COPY.paywall.palettes]
              return (
                <View
                  key={palette.id}
                  style={[
                    s.listRow,
                    { borderColor: theme.ui.border },
                    idx === GROVE_PALETTES.length - 1 && s.listRowLast,
                  ]}
                >
                  <View style={[s.listDot, { backgroundColor: palette.dotColor }]} />
                  <View style={s.listText}>
                    <Text style={[s.listName, { color: theme.text.primary }]}>
                      {paletteCopy?.name ?? palette.name}
                    </Text>
                    <Text style={[s.listDesc, { color: theme.text.tertiary }]}>
                      {paletteCopy?.description}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          {/* 4. Price row */}
          <View style={s.priceRow}>
            <Text style={[s.price, { color: theme.text.primary }]}>
              {COPY.paywall.paletteBundle.price}
            </Text>
            <Text style={[s.priceSub, { color: theme.text.tertiary }]}>
              {COPY.paywall.paletteBundle.priceSub}
            </Text>
          </View>

          {/* 5. CTA */}
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]}
            onPress={onPurchase}
            activeOpacity={0.88}
          >
            <Text style={[s.ctaText, { color: theme.text.inverse }]}>
              {COPY.paywall.paletteBundle.cta}
            </Text>
          </TouchableOpacity>

          {/* 6. Restore */}
          <TouchableOpacity style={s.restoreBtn} onPress={onRestore} activeOpacity={0.7}>
            <Text style={[s.restoreText, { color: theme.text.tertiary }]}>
              {COPY.paywall.paletteBundle.restore}
            </Text>
          </TouchableOpacity>

          {/* 7. Fine print */}
          <Text style={[s.finePrint, { color: theme.text.tertiary }]}>
            {COPY.paywall.paletteBundle.finePrint}
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
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
    },
    previewItem: {
      alignItems: 'center',
      gap: 6,
    },
    previewDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    previewDotName: {
      fontSize: 10,
      fontWeight: '500',
      maxWidth: 48,
      textAlign: 'center',
    },
    headerSection: {
      paddingHorizontal: 24,
      paddingTop: 16,
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
    listSection: {
      marginHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 20,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: 1,
    },
    listRowLast: {
      borderBottomWidth: 0,
    },
    listDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      flexShrink: 0,
    },
    listText: { flex: 1 },
    listName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    listDesc: { fontSize: 12, lineHeight: 16 },
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

export default PalettePaywallSheet
