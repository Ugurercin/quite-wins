import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native'
import { COPY } from '@/constants/copy'

interface Props {
  seasonNumber: number
  totalWins: number
  theme: any
  onReady: () => void
}

const SeasonRecapOverlay = ({ seasonNumber, totalWins, theme, onReady }: Props) => {
  const [motivational] = useState(() => {
    const msgs = COPY.seasonRecap.motivational
    return msgs[Math.floor(Math.random() * msgs.length)]
  })

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.background.primary,
              borderColor: theme.ui.border,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.brand.light }]}>
            {COPY.seasonRecap.eyebrow}
          </Text>

          <Text style={[styles.title, { color: theme.text.primary }]}>
            {COPY.seasonRecap.title(seasonNumber)}
          </Text>

          <Text style={[styles.stats, { color: theme.text.secondary }]}>
            {COPY.seasonRecap.stats(totalWins)}
          </Text>

          <Text style={[styles.motivational, { color: theme.text.secondary }]}>
            {motivational}
          </Text>

          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: theme.brand.mid }]}
            onPress={onReady}
            activeOpacity={0.88}
          >
            <Text style={[styles.ctaBtnText, { color: theme.text.inverse }]}>
              {COPY.seasonRecap.cta(seasonNumber + 1)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    gap: 12,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  stats: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  motivational: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  ctaBtn: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
})

export default SeasonRecapOverlay
