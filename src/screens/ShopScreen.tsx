import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { SCENES } from '@/scenes'
import { GROVE_PALETTES } from '@/scenes/grove/palettes'
import { COPY } from '@/constants/copy'

interface Props {
  onBack: () => void
  onPurchaseNight: () => void        // stub — Phase 4c
  onPurchaseSpace: () => void        // stub
  onPurchaseNightSpace: () => void   // stub
  onPurchasePalettes: () => void     // stub
  onPurchaseEverything: () => void   // stub
  onRestore: () => void              // stub
}

const DOT_SIZE = 32

const ShopScreen = ({ onBack, onPurchaseNight, onPurchaseSpace, onPurchaseNightSpace, onPurchasePalettes, onPurchaseEverything, onRestore }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const s = makeStyles(theme)

  const bundleScenes = SCENES.filter(sc => sc.bundleId === 'night_space_bundle')
  const nightScene = SCENES.find(sc => sc.id === 'night')
  const spaceScene = SCENES.find(sc => sc.id === 'space')

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

      <View style={s.header}>
        <TouchableOpacity
          style={[s.backBtn, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.85}
        >
          <Text style={[s.backArrow, { color: theme.text.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={[s.title, { color: theme.text.primary }]}>{COPY.paywall.shop.title}</Text>
          <Text style={[s.headerSub, { color: theme.text.tertiary }]}>{COPY.paywall.shop.subtitle}</Text>
        </View>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.sectionLabel, { color: theme.text.secondary }]}>
          {COPY.paywall.shop.sectionLabel}
        </Text>

        {/* ── Card 1: Night Grove (individual) ── */}
        {nightScene && (
          <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
            <Image source={nightScene.thumbnail} style={s.thumbSingle} resizeMode="cover" />
            <View style={s.cardBody}>
              <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
                <Text style={[s.badgeText, { color: theme.text.secondary }]}>{COPY.paywall.nightScene.badge}</Text>
              </View>
              <Text style={[s.bundleTitle, { color: theme.text.primary }]}>{COPY.paywall.nightScene.title}</Text>
              <Text style={[s.bundleSubtitle, { color: theme.text.secondary }]}>{COPY.paywall.nightScene.subtitle}</Text>
              <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{COPY.paywall.nightScene.note}</Text>
              <View style={s.priceRow}>
                <Text style={[s.price, { color: theme.text.primary }]}>{COPY.paywall.nightScene.price}</Text>
                <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{COPY.paywall.nightScene.priceSub}</Text>
              </View>
              <TouchableOpacity style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]} onPress={onPurchaseNight} activeOpacity={0.88}>
                <Text style={[s.ctaText, { color: theme.text.inverse }]}>{COPY.paywall.nightScene.cta}</Text>
              </TouchableOpacity>
              <Text style={[s.upsellLink, { color: theme.text.tertiary }]}>{COPY.paywall.nightScene.bundleUpsell}</Text>
            </View>
          </View>
        )}

        {/* ── Card 2: Deep Space (individual) ── */}
        {spaceScene && (
          <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
            <Image source={spaceScene.thumbnail} style={s.thumbSingle} resizeMode="cover" />
            <View style={s.cardBody}>
              <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
                <Text style={[s.badgeText, { color: theme.text.secondary }]}>{COPY.paywall.spaceScene.badge}</Text>
              </View>
              <Text style={[s.bundleTitle, { color: theme.text.primary }]}>{COPY.paywall.spaceScene.title}</Text>
              <Text style={[s.bundleSubtitle, { color: theme.text.secondary }]}>{COPY.paywall.spaceScene.subtitle}</Text>
              <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{COPY.paywall.spaceScene.note}</Text>
              <View style={s.priceRow}>
                <Text style={[s.price, { color: theme.text.primary }]}>{COPY.paywall.spaceScene.price}</Text>
                <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{COPY.paywall.spaceScene.priceSub}</Text>
              </View>
              <TouchableOpacity style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]} onPress={onPurchaseSpace} activeOpacity={0.88}>
                <Text style={[s.ctaText, { color: theme.text.inverse }]}>{COPY.paywall.spaceScene.cta}</Text>
              </TouchableOpacity>
              <Text style={[s.upsellLink, { color: theme.text.tertiary }]}>{COPY.paywall.spaceScene.bundleUpsell}</Text>
            </View>
          </View>
        )}

        {/* ── Card 3: Night & Space Bundle ── */}
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          <View style={s.thumbRow}>
            {bundleScenes.map(sc => (
              <Image key={sc.id} source={sc.thumbnail} style={s.thumb} resizeMode="cover" />
            ))}
          </View>
          <View style={s.cardBody}>
            <View style={s.everythingBadgeRow}>
              <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
                <Text style={[s.badgeText, { color: theme.text.secondary }]}>{COPY.paywall.bundle.badge}</Text>
              </View>
              <View style={[s.bestValuePill, { backgroundColor: theme.accent.amber }]}>
                <Text style={s.bestValueText}>{COPY.paywall.bundle.saveBadge}</Text>
              </View>
            </View>
            <Text style={[s.bundleTitle, { color: theme.text.primary }]}>{COPY.paywall.bundle.title}</Text>
            <Text style={[s.bundleSubtitle, { color: theme.text.secondary }]}>{COPY.paywall.bundle.subtitle}</Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{COPY.paywall.bundle.note}</Text>
            <View style={s.includesList}>
              {COPY.paywall.bundle.includes.map((item, i) => (
                <Text key={i} style={[s.includesItem, { color: theme.text.secondary }]}>{item}</Text>
              ))}
            </View>
            <View style={s.priceRow}>
              <Text style={[s.price, { color: theme.text.primary }]}>{COPY.paywall.bundle.price}</Text>
              <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{COPY.paywall.bundle.priceSub}</Text>
            </View>
            <TouchableOpacity style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]} onPress={onPurchaseNightSpace} activeOpacity={0.88}>
              <Text style={[s.ctaText, { color: theme.text.inverse }]}>{COPY.paywall.bundle.cta}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Card 4: Grove Palettes Bundle ── */}
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          <View style={s.dotsPreviewRow}>
            {GROVE_PALETTES.map(palette => (
              <View key={palette.id} style={[s.previewDot, { backgroundColor: palette.dotColor }]} />
            ))}
          </View>
          <View style={s.cardBody}>
            <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
              <Text style={[s.badgeText, { color: theme.text.secondary }]}>{COPY.paywall.paletteBundle.badge}</Text>
            </View>
            <Text style={[s.bundleTitle, { color: theme.text.primary }]}>{COPY.paywall.paletteBundle.title}</Text>
            <Text style={[s.bundleSubtitle, { color: theme.text.secondary }]}>{COPY.paywall.paletteBundle.subtitle}</Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{COPY.paywall.paletteBundle.note}</Text>
            <View style={s.includesList}>
              {COPY.paywall.paletteBundle.includes.map((item, i) => (
                <Text key={i} style={[s.includesItem, { color: theme.text.secondary }]}>{item}</Text>
              ))}
            </View>
            <View style={s.priceRow}>
              <Text style={[s.price, { color: theme.text.primary }]}>{COPY.paywall.paletteBundle.price}</Text>
              <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{COPY.paywall.paletteBundle.priceSub}</Text>
            </View>
            <TouchableOpacity style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]} onPress={onPurchasePalettes} activeOpacity={0.88}>
              <Text style={[s.ctaText, { color: theme.text.inverse }]}>{COPY.paywall.paletteBundle.cta}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Card 5: Everything Bundle ── */}
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          <View style={s.thumbRow}>
            {bundleScenes.map(sc => (
              <Image key={sc.id} source={sc.thumbnail} style={s.thumb} resizeMode="cover" />
            ))}
          </View>
          <View style={s.dotsOverlayRow}>
            {GROVE_PALETTES.map(palette => (
              <View key={palette.id} style={[s.previewDotSmall, { backgroundColor: palette.dotColor }]} />
            ))}
          </View>
          <View style={s.cardBody}>
            <View style={s.everythingBadgeRow}>
              <View style={[s.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
                <Text style={[s.badgeText, { color: theme.text.secondary }]}>{COPY.paywall.everythingBundle.badge}</Text>
              </View>
              <View style={[s.bestValuePill, { backgroundColor: theme.accent.amber }]}>
                <Text style={s.bestValueText}>BEST VALUE</Text>
              </View>
            </View>
            <Text style={[s.bundleTitle, { color: theme.text.primary }]}>{COPY.paywall.everythingBundle.title}</Text>
            <Text style={[s.bundleSubtitle, { color: theme.text.secondary }]}>{COPY.paywall.everythingBundle.subtitle}</Text>
            <Text style={[s.itemNote, { color: theme.text.tertiary }]}>{COPY.paywall.everythingBundle.note}</Text>
            <View style={s.includesList}>
              {COPY.paywall.everythingBundle.includes.map((item, i) => (
                <Text key={i} style={[s.includesItem, { color: theme.text.secondary }]}>{item}</Text>
              ))}
            </View>
            <View style={s.priceRow}>
              <Text style={[s.price, { color: theme.text.primary }]}>{COPY.paywall.everythingBundle.price}</Text>
              <Text style={[s.priceSub, { color: theme.text.tertiary }]}>{COPY.paywall.everythingBundle.priceSub}</Text>
            </View>
            <TouchableOpacity style={[s.ctaBtn, { backgroundColor: theme.brand.mid }]} onPress={onPurchaseEverything} activeOpacity={0.88}>
              <Text style={[s.ctaText, { color: theme.text.inverse }]}>{COPY.paywall.everythingBundle.cta}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restore */}
        <TouchableOpacity style={s.restoreBtn} onPress={onRestore} activeOpacity={0.7}>
          <Text style={[s.restoreText, { color: theme.text.tertiary }]}>{COPY.paywall.bundle.restore}</Text>
        </TouchableOpacity>

        {/* Fine print */}
        <Text style={[s.finePrint, { color: theme.text.tertiary }]}>{COPY.paywall.bundle.finePrint}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    backBtn: {
      width: 44, height: 44, borderRadius: 22,
      borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    },
    backArrow: { fontSize: 22, fontWeight: '600' },
    headerCenter: { flex: 1, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700' },
    headerSub: { fontSize: 12, marginTop: 2 },
    headerSpacer: { width: 44 },
    content: { paddingHorizontal: 16, paddingTop: 4 },
    sectionLabel: {
      fontSize: 11, fontWeight: '700', letterSpacing: 0.8,
      marginTop: 20, marginBottom: 12, marginLeft: 4,
    },
    card: {
      borderRadius: 20, borderWidth: 1,
      overflow: 'hidden', marginBottom: 16,
    },
    thumbRow: { flexDirection: 'row', height: 140 },
    thumb: { flex: 1, height: 140 },
    thumbSingle: { width: '100%', height: 120 },
    upsellLink: { fontSize: 13, textAlign: 'center', marginTop: 4 },
    dotsPreviewRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 28,
      paddingHorizontal: 20,
    },
    previewDot: {
      width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2,
    },
    dotsOverlayRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      paddingTop: 12,
      paddingBottom: 0,
      paddingHorizontal: 20,
    },
    previewDotSmall: {
      width: 20, height: 20, borderRadius: 10,
    },
    cardBody: { padding: 20, gap: 10 },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12, paddingVertical: 5,
      borderRadius: 20, borderWidth: 1,
    },
    badgeText: { fontSize: 13, fontWeight: '600' },
    everythingBadgeRow: {
      flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap',
    },
    bestValuePill: {
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 20,
    },
    bestValueText: { fontSize: 11, fontWeight: '800', color: '#1C2B1A', letterSpacing: 0.5 },
    bundleTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    bundleSubtitle: { fontSize: 14, lineHeight: 20 },
    priceRow: { gap: 2 },
    price: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
    priceSub: { fontSize: 13 },
    ctaBtn: {
      paddingVertical: 14, borderRadius: 14,
      alignItems: 'center', marginTop: 4,
    },
    ctaText: { fontSize: 16, fontWeight: '700', letterSpacing: 0.1 },
    itemNote: {
      fontSize: 11,
      fontStyle: 'italic',
      lineHeight: 16,
      marginTop: 2,
    },
    includesList: {
      marginTop: 10,
      gap: 6,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.06)',
    },
    includesItem: {
      fontSize: 13,
      lineHeight: 18,
    },
    restoreBtn: { alignItems: 'center', paddingVertical: 12 },
    restoreText: { fontSize: 13 },
    finePrint: {
      fontSize: 11, textAlign: 'center',
      paddingHorizontal: 16, lineHeight: 16,
    },
  })

export default ShopScreen
