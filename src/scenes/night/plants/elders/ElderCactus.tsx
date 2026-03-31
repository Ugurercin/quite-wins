import React, { useEffect } from 'react'
import { Circle, Group, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props { x: number; y: number; colors: SceneColors }

// Night Elder Cactus — massive multi-armed silhouette, silver moonlit spines everywhere.
// White night flowers. Breathing scale + silver moonlit glow.
const ElderCactus = ({ x, y, colors }: Props) => {
  const SPINE        = '#C0C8E0'
  const RIDGE        = colors.sprout
  const NIGHT_FLOWER = '#F0F4FF'

  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.2)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.05, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.96, { duration: 1800, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.52, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.2,  { duration: 3000, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
  }, [])

  const transform  = useDerivedValue(() => [{ scale: scale.value }])
  const glowOp     = useDerivedValue(() => glow.value)
  const glowR      = useDerivedValue(() => 11 + glow.value * 7)
  const flowerGlow = useDerivedValue(() => glow.value * 0.35)

  const rootPath = Skia.Path.Make()
  rootPath.moveTo(x - 20, y); rootPath.cubicTo(x - 22, y - 4, x - 18, y - 6, x - 14, y - 4)
  rootPath.lineTo(x + 14, y - 4); rootPath.cubicTo(x + 18, y - 6, x + 22, y - 4, x + 20, y); rootPath.close()

  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 14, y - 4); bodyPath.cubicTo(x - 16, y - 30, x - 14, y - 65, x - 10, y - 78)
  bodyPath.cubicTo(x - 6, y - 84, x + 6, y - 84, x + 10, y - 78)
  bodyPath.cubicTo(x + 14, y - 65, x + 16, y - 30, x + 14, y - 4); bodyPath.close()

  const llArm = Skia.Path.Make()
  llArm.moveTo(x - 14, y - 36); llArm.cubicTo(x - 30, y - 36, x - 44, y - 30, x - 46, y - 18)
  llArm.cubicTo(x - 48, y - 8, x - 42, y - 2, x - 36, y - 4); llArm.cubicTo(x - 28, y - 6, x - 24, y - 16, x - 14, y - 28); llArm.close()

  const lhArm = Skia.Path.Make()
  lhArm.moveTo(x - 13, y - 56); lhArm.cubicTo(x - 26, y - 58, x - 38, y - 52, x - 40, y - 38)
  lhArm.cubicTo(x - 42, y - 26, x - 36, y - 20, x - 30, y - 22); lhArm.cubicTo(x - 24, y - 24, x - 20, y - 34, x - 13, y - 46); lhArm.close()

  const rlArm = Skia.Path.Make()
  rlArm.moveTo(x + 14, y - 42); rlArm.cubicTo(x + 28, y - 44, x + 40, y - 36, x + 42, y - 22)
  rlArm.cubicTo(x + 44, y - 10, x + 38, y - 4, x + 32, y - 6); rlArm.cubicTo(x + 24, y - 8, x + 22, y - 20, x + 14, y - 34); rlArm.close()

  const rhArm = Skia.Path.Make()
  rhArm.moveTo(x + 13, y - 62); rhArm.cubicTo(x + 24, y - 64, x + 34, y - 58, x + 36, y - 46)
  rhArm.cubicTo(x + 38, y - 36, x + 32, y - 28, x + 26, y - 30); rhArm.cubicTo(x + 20, y - 32, x + 18, y - 42, x + 13, y - 52); rhArm.close()

  const spineY = [-68, -56, -44, -32, -20, -10]

  return (
    <Group transform={transform} origin={vec(x, y)}>
      <Path path={rootPath} color={colors.bodyDark} style="fill" />
      <Path path={llArm} color={colors.bodyDark} style="fill" />
      <Path path={lhArm} color={colors.bodyDark} style="fill" />
      <Path path={rlArm} color={colors.bodyDark} style="fill" />
      <Path path={rhArm} color={colors.bodyDark} style="fill" />

      {/* Arm spines */}
      <Line p1={vec(x - 46, y - 18)} p2={vec(x - 52, y - 20)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x - 46, y - 24)} p2={vec(x - 52, y - 22)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x - 40, y - 36)} p2={vec(x - 46, y - 38)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 42, y - 22)} p2={vec(x + 48, y - 24)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 42, y - 28)} p2={vec(x + 48, y - 26)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x + 36, y - 44)} p2={vec(x + 42, y - 46)} color={SPINE} strokeWidth={1.2} />

      <Path path={bodyPath} color={colors.bodyMid} style="fill" />
      <Path path={bodyPath} color={colors.bodyLight} style="fill" opacity={0.06} />
      <Line p1={vec(x, y - 4)} p2={vec(x, y - 80)} color={RIDGE} strokeWidth={1.4} opacity={0.55} />
      <Line p1={vec(x - 6, y - 5)} p2={vec(x - 7, y - 76)} color={RIDGE} strokeWidth={1.1} opacity={0.45} />
      <Line p1={vec(x + 6, y - 5)} p2={vec(x + 7, y - 76)} color={RIDGE} strokeWidth={1.1} opacity={0.45} />
      {spineY.map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 14, y + yOff)} p2={vec(x - 20, y + yOff - 4)} color={SPINE} strokeWidth={1.4} />
          <Line p1={vec(x + 14, y + yOff)} p2={vec(x + 20, y + yOff - 4)} color={SPINE} strokeWidth={1.4} />
        </React.Fragment>
      ))}

      {/* Night flowers */}
      <Circle cx={x} cy={y - 86} r={6} color={NIGHT_FLOWER} />
      <Circle cx={x - 6} cy={y - 86} r={4} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={x + 6} cy={y - 86} r={4} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={x} cy={y - 92} r={4} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={x - 40} cy={y - 6} r={5}  color={NIGHT_FLOWER} />
      <Circle cx={x - 45} cy={y - 6} r={3.5} color={NIGHT_FLOWER} opacity={0.8} />
      <Circle cx={x + 36} cy={y - 8} r={5}  color={NIGHT_FLOWER} />
      <Circle cx={x + 41} cy={y - 8} r={3.5} color={NIGHT_FLOWER} opacity={0.8} />
      <Circle cx={x - 34} cy={y - 24} r={4.5} color={NIGHT_FLOWER} />
      <Circle cx={x + 30} cy={y - 32} r={4.5} color={NIGHT_FLOWER} />

      {/* Silver moonlit breathing glow */}
      <Circle cx={x} cy={y - 50} r={glowR} color={colors.bloom} opacity={glowOp} />
      <Circle cx={x} cy={y - 86} r={useDerivedValue(() => 9 + glow.value * 5)} color={NIGHT_FLOWER} opacity={flowerGlow} />
    </Group>
  )
}

export default ElderCactus
