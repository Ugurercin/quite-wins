import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props {
  x: number
  y: number
  colors: SceneColors
}

// Elder Cactus — ancient, massive, multi-armed. Flowers bloom all over.
// Same breathing glow as the other elders.
const ElderCactus = ({ x, y, colors }: Props) => {
  const glow = useSharedValue(0.2)

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(0.5,  { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2,  { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )
  }, [])

  const glowOpacity = useDerivedValue(() => glow.value)
  const glowR       = useDerivedValue(() => 10 + glow.value * 7)

  const CACTUS_DARK   = '#357828'
  const CACTUS_MID    = '#4A9A34'
  const CACTUS_LIGHT  = '#5AAE40'
  const RIDGE         = '#2A6820'
  const SPINE         = '#E0D4B4'
  const FLOWER_PINK   = '#E06080'
  const FLOWER_YELLOW = '#EFC040'

  // Wide root base
  const rootPath = Skia.Path.Make()
  rootPath.moveTo(x - 20, y)
  rootPath.cubicTo(x - 22, y - 4, x - 18, y - 6, x - 14, y - 4)
  rootPath.lineTo(x + 14, y - 4)
  rootPath.cubicTo(x + 18, y - 6, x + 22, y - 4, x + 20, y)
  rootPath.close()

  // Main thick column
  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 14, y - 4)
  bodyPath.cubicTo(x - 16, y - 30, x - 14, y - 65, x - 10, y - 78)
  bodyPath.cubicTo(x - 6, y - 84, x + 6, y - 84, x + 10, y - 78)
  bodyPath.cubicTo(x + 14, y - 65, x + 16, y - 30, x + 14, y - 4)
  bodyPath.close()

  // Left lower arm — wide elbow
  const leftLowArm = Skia.Path.Make()
  leftLowArm.moveTo(x - 14, y - 36)
  leftLowArm.cubicTo(x - 30, y - 36, x - 44, y - 30, x - 46, y - 18)
  leftLowArm.cubicTo(x - 48, y - 8, x - 42, y - 2, x - 36, y - 4)
  leftLowArm.cubicTo(x - 28, y - 6, x - 24, y - 16, x - 14, y - 28)
  leftLowArm.close()

  // Left upper arm — reaches higher
  const leftHighArm = Skia.Path.Make()
  leftHighArm.moveTo(x - 13, y - 56)
  leftHighArm.cubicTo(x - 26, y - 58, x - 38, y - 52, x - 40, y - 38)
  leftHighArm.cubicTo(x - 42, y - 26, x - 36, y - 20, x - 30, y - 22)
  leftHighArm.cubicTo(x - 24, y - 24, x - 20, y - 34, x - 13, y - 46)
  leftHighArm.close()

  // Right lower arm
  const rightLowArm = Skia.Path.Make()
  rightLowArm.moveTo(x + 14, y - 42)
  rightLowArm.cubicTo(x + 28, y - 44, x + 40, y - 36, x + 42, y - 22)
  rightLowArm.cubicTo(x + 44, y - 10, x + 38, y - 4, x + 32, y - 6)
  rightLowArm.cubicTo(x + 24, y - 8, x + 22, y - 20, x + 14, y - 34)
  rightLowArm.close()

  // Right upper arm — short stub pointing up-right
  const rightHighArm = Skia.Path.Make()
  rightHighArm.moveTo(x + 13, y - 62)
  rightHighArm.cubicTo(x + 24, y - 64, x + 34, y - 58, x + 36, y - 46)
  rightHighArm.cubicTo(x + 38, y - 36, x + 32, y - 28, x + 26, y - 30)
  rightHighArm.cubicTo(x + 20, y - 32, x + 18, y - 42, x + 13, y - 52)
  rightHighArm.close()

  const spineOffsets = [-68, -56, -44, -32, -20, -10]

  return (
    <>
      {/* Root */}
      <Path path={rootPath} color={CACTUS_DARK} style="fill" />

      {/* Arms — drawn behind body */}
      <Path path={leftLowArm}  color={CACTUS_DARK} style="fill" />
      <Path path={leftHighArm} color={CACTUS_DARK} style="fill" />
      <Path path={rightLowArm}  color={CACTUS_DARK} style="fill" />
      <Path path={rightHighArm} color={CACTUS_DARK} style="fill" />

      {/* Arm ridges */}
      <Line p1={vec(x - 30, y - 18)} p2={vec(x - 38, y - 10)} color={RIDGE} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x - 26, y - 30)} p2={vec(x - 34, y - 24)} color={RIDGE} strokeWidth={1} opacity={0.4} />
      <Line p1={vec(x + 28, y - 18)} p2={vec(x + 36, y - 12)} color={RIDGE} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x + 22, y - 30)} p2={vec(x + 30, y - 26)} color={RIDGE} strokeWidth={1} opacity={0.4} />

      {/* Arm spines */}
      <Line p1={vec(x - 46, y - 18)} p2={vec(x - 52, y - 20)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x - 46, y - 24)} p2={vec(x - 52, y - 22)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x - 40, y - 4)} p2={vec(x - 44, y + 1)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x - 40, y - 36)} p2={vec(x - 46, y - 38)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 42, y - 22)} p2={vec(x + 48, y - 24)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 42, y - 28)} p2={vec(x + 48, y - 26)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x + 36, y - 6)} p2={vec(x + 40, y + 0)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 36, y - 44)} p2={vec(x + 42, y - 46)} color={SPINE} strokeWidth={1.2} />

      {/* Main body */}
      <Path path={bodyPath} color={CACTUS_MID} style="fill" />
      {/* Body highlight side */}
      <Path path={bodyPath} color={CACTUS_LIGHT} style="fill" opacity={0.2} />

      {/* Body ridges */}
      <Line p1={vec(x, y - 4)} p2={vec(x, y - 80)} color={RIDGE} strokeWidth={1.5} opacity={0.6} />
      <Line p1={vec(x - 6, y - 5)} p2={vec(x - 7, y - 76)} color={RIDGE} strokeWidth={1.2} opacity={0.5} />
      <Line p1={vec(x + 6, y - 5)} p2={vec(x + 7, y - 76)} color={RIDGE} strokeWidth={1.2} opacity={0.5} />

      {/* Body spines */}
      {spineOffsets.map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 14, y + yOff)} p2={vec(x - 20, y + yOff - 4)} color={SPINE} strokeWidth={1.4} />
          <Line p1={vec(x + 14, y + yOff)} p2={vec(x + 20, y + yOff - 4)} color={SPINE} strokeWidth={1.4} />
          <Line p1={vec(x - 6, y + yOff - 6)} p2={vec(x - 10, y + yOff - 10)} color={SPINE} strokeWidth={1} opacity={0.7} />
          <Line p1={vec(x + 6, y + yOff - 6)} p2={vec(x + 10, y + yOff - 10)} color={SPINE} strokeWidth={1} opacity={0.7} />
        </React.Fragment>
      ))}

      {/* Flowers all over — top + arms */}
      {/* Main top */}
      <Circle cx={x} cy={y - 86} r={6} color={FLOWER_PINK} />
      <Circle cx={x - 6} cy={y - 86} r={4} color={FLOWER_PINK} opacity={0.85} />
      <Circle cx={x + 6} cy={y - 86} r={4} color={FLOWER_PINK} opacity={0.85} />
      <Circle cx={x} cy={y - 92} r={4} color={FLOWER_PINK} opacity={0.85} />
      <Circle cx={x} cy={y - 86} r={2.5} color="#FFFFFF" opacity={0.7} />

      {/* Left low arm tip */}
      <Circle cx={x - 40} cy={y - 6} r={5} color={FLOWER_YELLOW} />
      <Circle cx={x - 45} cy={y - 6} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x - 35} cy={y - 6} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x - 40} cy={y - 11} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x - 40} cy={y - 6} r={2} color="#FFFFFF" opacity={0.6} />

      {/* Left high arm tip */}
      <Circle cx={x - 34} cy={y - 24} r={4.5} color={FLOWER_PINK} />
      <Circle cx={x - 34} cy={y - 24} r={2} color="#FFFFFF" opacity={0.6} />

      {/* Right low arm tip */}
      <Circle cx={x + 36} cy={y - 8} r={5} color={FLOWER_YELLOW} />
      <Circle cx={x + 41} cy={y - 8} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x + 31} cy={y - 8} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x + 36} cy={y - 13} r={3.5} color={FLOWER_YELLOW} opacity={0.8} />
      <Circle cx={x + 36} cy={y - 8} r={2} color="#FFFFFF" opacity={0.6} />

      {/* Right high arm tip */}
      <Circle cx={x + 30} cy={y - 32} r={4.5} color={FLOWER_PINK} />
      <Circle cx={x + 30} cy={y - 32} r={2} color="#FFFFFF" opacity={0.6} />

      {/* Breathing glow — golden, feels ancient and warm */}
      <Circle cx={x} cy={y - 50} r={glowR} color="#FFD080" opacity={glowOpacity} />
      <Circle cx={x} cy={y - 86} r={useDerivedValue(() => 8 + glow.value * 5)} color={FLOWER_PINK} opacity={useDerivedValue(() => glow.value * 0.4)} />

      {/* Ground accent */}
      <Circle cx={x} cy={y - 2} r={4} color={CACTUS_DARK} opacity={0.6} />
    </>
  )
}

export default ElderCactus