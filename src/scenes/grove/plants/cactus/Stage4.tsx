import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

// Cactus — Stage 4: Classic two-arm cactus. Small flowers bloom on top on mount.
const Stage4 = ({ x, y, colors, accentColor }: StageProps) => {
  const flowerColor = accentColor ?? '#EF9F27'

  // Flowers bloom open on mount
  const bloom = useSharedValue(0)
  useEffect(() => {
    bloom.value = withDelay(
      200,
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.back(1.2)) })
    )
  }, [])

  const flowerR = useDerivedValue(() => bloom.value * 5)
  const petalR  = useDerivedValue(() => bloom.value * 3.5)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 16, y)
  moundPath.quadTo(x, y - 8, x + 16, y)

  // Main column
  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 10, y - 2)
  bodyPath.cubicTo(x - 12, y - 28, x - 12, y - 56, x - 8, y - 66)
  bodyPath.cubicTo(x - 4, y - 70, x + 4, y - 70, x + 8, y - 66)
  bodyPath.cubicTo(x + 12, y - 56, x + 12, y - 28, x + 10, y - 2)
  bodyPath.close()

  // Left arm — goes left then up
  const leftArmPath = Skia.Path.Make()
  leftArmPath.moveTo(x - 10, y - 38)
  leftArmPath.cubicTo(x - 22, y - 38, x - 32, y - 34, x - 34, y - 24)
  leftArmPath.cubicTo(x - 36, y - 14, x - 32, y - 6, x - 26, y - 8)
  leftArmPath.cubicTo(x - 20, y - 10, x - 18, y - 18, x - 10, y - 30)
  leftArmPath.close()

  // Right arm — goes right then up
  const rightArmPath = Skia.Path.Make()
  rightArmPath.moveTo(x + 10, y - 42)
  rightArmPath.cubicTo(x + 22, y - 42, x + 32, y - 36, x + 34, y - 24)
  rightArmPath.cubicTo(x + 36, y - 12, x + 30, y - 6, x + 24, y - 8)
  rightArmPath.cubicTo(x + 18, y - 10, x + 16, y - 20, x + 10, y - 34)
  rightArmPath.close()

  const CACTUS_GREEN = '#4A8A3A'
  const RIDGE_COLOR = '#3A7A2A'
  const SPINE_COLOR = '#D4C8A8'

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />

      {/* Arms behind body */}
      <Path path={leftArmPath} color={CACTUS_GREEN} style="fill" />
      <Line p1={vec(x - 22, y - 20)} p2={vec(x - 28, y - 14)} color={RIDGE_COLOR} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x - 34, y - 20)} p2={vec(x - 40, y - 22)} color={SPINE_COLOR} strokeWidth={1.2} />
      <Line p1={vec(x - 34, y - 26)} p2={vec(x - 40, y - 24)} color={SPINE_COLOR} strokeWidth={1} />
      <Line p1={vec(x - 26, y - 9)} p2={vec(x - 28, y - 3)} color={SPINE_COLOR} strokeWidth={1.2} />

      <Path path={rightArmPath} color={CACTUS_GREEN} style="fill" />
      <Line p1={vec(x + 22, y - 22)} p2={vec(x + 28, y - 16)} color={RIDGE_COLOR} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x + 34, y - 22)} p2={vec(x + 40, y - 24)} color={SPINE_COLOR} strokeWidth={1.2} />
      <Line p1={vec(x + 34, y - 28)} p2={vec(x + 40, y - 26)} color={SPINE_COLOR} strokeWidth={1} />
      <Line p1={vec(x + 24, y - 9)} p2={vec(x + 26, y - 3)} color={SPINE_COLOR} strokeWidth={1.2} />

      {/* Main body on top */}
      <Path path={bodyPath} color={CACTUS_GREEN} style="fill" />
      {/* Body ridges */}
      <Line p1={vec(x, y - 2)} p2={vec(x, y - 68)} color={RIDGE_COLOR} strokeWidth={1.2} opacity={0.6} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 5, y - 64)} color={RIDGE_COLOR} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 5, y - 64)} color={RIDGE_COLOR} strokeWidth={1} opacity={0.5} />
      {/* Body spines */}
      {[-58, -46, -34, -22, -12].map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 11, y + yOff)} p2={vec(x - 16, y + yOff - 4)} color={SPINE_COLOR} strokeWidth={1.2} />
          <Line p1={vec(x + 11, y + yOff)} p2={vec(x + 16, y + yOff - 4)} color={SPINE_COLOR} strokeWidth={1.2} />
          <Line p1={vec(x - 5, y + yOff - 5)} p2={vec(x - 8, y + yOff - 9)} color={SPINE_COLOR} strokeWidth={0.9} opacity={0.7} />
          <Line p1={vec(x + 5, y + yOff - 5)} p2={vec(x + 8, y + yOff - 9)} color={SPINE_COLOR} strokeWidth={0.9} opacity={0.7} />
        </React.Fragment>
      ))}

      {/* Blooming flowers on top — animated */}
      {/* Main top flower */}
      <Circle cx={x} cy={y - 72} r={flowerR} color={flowerColor} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 5)} cy={useDerivedValue(() => y - 72 - bloom.value * 2)} r={petalR} color={flowerColor} opacity={0.85} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 5)} cy={useDerivedValue(() => y - 72 - bloom.value * 2)} r={petalR} color={flowerColor} opacity={0.85} />
      <Circle cx={x} cy={useDerivedValue(() => y - 72 - bloom.value * 5)} r={petalR} color={flowerColor} opacity={0.85} />
      <Circle cx={x} cy={y - 72} r={useDerivedValue(() => bloom.value * 2.5)} color="#FFFFFF" opacity={0.6} />

      {/* Left arm flower */}
      <Circle cx={x - 26} cy={y - 10} r={useDerivedValue(() => bloom.value * 4)} color={flowerColor} opacity={0.9} />
      <Circle cx={useDerivedValue(() => x - 26 - bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={flowerColor} opacity={0.8} />
      <Circle cx={useDerivedValue(() => x - 26 + bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={flowerColor} opacity={0.8} />
      <Circle cx={x - 26} cy={y - 10} r={useDerivedValue(() => bloom.value * 1.8)} color="#FFFFFF" opacity={0.5} />

      {/* Right arm flower */}
      <Circle cx={x + 24} cy={y - 10} r={useDerivedValue(() => bloom.value * 4)} color={flowerColor} opacity={0.9} />
      <Circle cx={useDerivedValue(() => x + 24 - bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={flowerColor} opacity={0.8} />
      <Circle cx={useDerivedValue(() => x + 24 + bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={flowerColor} opacity={0.8} />
      <Circle cx={x + 24} cy={y - 10} r={useDerivedValue(() => bloom.value * 1.8)} color="#FFFFFF" opacity={0.5} />

      {/* Ground accent */}
      <Circle cx={x} cy={y - 2} r={3} color={CACTUS_GREEN} opacity={0.6} />
    </>
  )
}

export default Stage4