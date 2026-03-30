import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Theme } from '@/theme/theme'

interface Props {
  seasonNumber: number
  totalWins: number
  theme: Theme
  onReady: () => void
}



const POETIC_LINES = [
  'Every tree here started as a small thing you noticed.',
  'Your garden remembers what your memory forgets.',
  'Seasons end. The roots stay.',
  'You showed up. That\'s the whole story.',
  'Each one was real.',
  'The garden is full. So are you.',
  'A chapter closes. The forest grows.',
]

let lastPoetryIndex = -1
const pickPoeticLine = (): string => {
  let idx: number
  do { idx = Math.floor(Math.random() * POETIC_LINES.length) }
  while (idx === lastPoetryIndex)
  lastPoetryIndex = idx
  return POETIC_LINES[idx]
}

const SeasonRecapOverlay = ({ seasonNumber, totalWins, theme, onReady }: Props) => {
  const poeticLine = useRef(pickPoeticLine()).current
  const [buttonVisible, setButtonVisible] = useState(false)
  const hasCalledReady = useRef(false)

  const opacity = useSharedValue(0)
  const translateY = useSharedValue(24)

  useEffect(() => {
    // Fade in + slide up over 800ms
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) })
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })

    // Button appears after 1500ms — gives user time to read
    const t = setTimeout(() => setButtonVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

const handleReady = () => {
  if (hasCalledReady.current) return  // prevent double-fire
  hasCalledReady.current = true
  
  opacity.value = withTiming(0, { duration: 600, easing: Easing.in(Easing.quad) })
  setTimeout(onReady, 600)
}

  const s = makeStyles(theme)

  return (
    <View style={s.overlay}>
      <Animated.View style={[s.content, contentStyle]}>
        <Text style={[s.badge, { color: theme.brand.light }]}>
          🌱 Season {seasonNumber} Complete
        </Text>
        <Text style={[s.winsCount, { color: theme.text.primary }]}>
          You grew {totalWins} wins.
        </Text>
        <Text style={[s.subtitle, { color: theme.text.secondary }]}>
          Not bad for one chapter.
        </Text>
        <Text style={[s.poeticLine, { color: theme.text.secondary }]}>
          {poeticLine}
        </Text>
        {buttonVisible && (
          <TouchableOpacity
            style={[s.button, { backgroundColor: theme.brand.mid }]}
            onPress={handleReady}
            activeOpacity={0.8}
          >
            <Text style={[s.buttonText, { color: theme.text.inverse }]}>
              Ready for Season {seasonNumber + 1} →
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    content: {
      paddingHorizontal: 40,
      alignItems: 'center',
      gap: 16,
    },
    badge: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.4,
      marginBottom: 4,
    },
    winsCount: {
      fontSize: 32,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
    },
    poeticLine: {
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 22,
      marginTop: 4,
      marginBottom: 8,
    },
    button: {
      marginTop: 8,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 14,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  })

export default SeasonRecapOverlay
