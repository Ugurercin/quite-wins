import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { Theme } from '@/theme/theme'

interface Props {
  seasonNumber: number
  theme: Theme
  onDone: () => void
}

const SeasonTransitionOverlay = ({ seasonNumber, theme, onDone }: Props) => {
  const opacity = useSharedValue(0)

  useEffect(() => {
    // Fade in over 600ms, hold for 2.4s, fade out over 800ms
    opacity.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }),
      withDelay(2400, withTiming(0, { duration: 800, easing: Easing.in(Easing.quad) })),
    )
    const total = 600 + 2400 + 800
    const timer = setTimeout(onDone, total)
    return () => clearTimeout(timer)
  }, [])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const line1 = `Season ${seasonNumber} begins.`
  const line2 = 'Your garden remembers nothing.\nYou remember everything.'

  return (
    <Animated.View
      style={[s.overlay, { backgroundColor: theme.background.primary }, animStyle]}
      pointerEvents="none"
    >
      <View style={s.content}>
        <Text style={[s.line1, { color: theme.text.secondary }]}>{line1}</Text>
        <Text style={[s.line2, { color: theme.text.primary }]}>{line2}</Text>
      </View>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  content: {
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 16,
  },
  line1: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  line2: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
})

export default SeasonTransitionOverlay
