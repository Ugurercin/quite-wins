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

// Night Cactus — Stage 4: Full two-arm cactus with moonlit spines.
// White night-blooming flowers open on mount.
const Stage4 = ({ x, y, colors }: StageProps) => {
  const SPINE = '#C0C8E0'
  const RIDGE = colors.sprout
  const NIGHT_FLOWER = '#F0F4FF'

  const bloom = useSharedValue(0)
  useEffect(() => {
    bloom.value = withDelay(200, withTiming(1, { duration: 1800, easing: Easing.out(Easing.back(1.2)) }))
  }, [])

  const flowerR = useDerivedValue(() => bloom.value * 5)
  const petalR  = useDerivedValue(() => bloom.value * 3.5)
  const glowR   = useDerivedValue(() => bloom.value * 10)
  const glowOp  = useDerivedValue(() => bloom.value * 0.18)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 16, y)
  moundPath.quadTo(x, y - 8, x + 16, y)

  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 10, y - 2)
  bodyPath.cubicTo(x - 12, y - 28, x - 12, y - 56, x - 8, y - 66)
  bodyPath.cubicTo(x - 4, y - 70, x + 4, y - 70, x + 8, y - 66)
  bodyPath.cubicTo(x + 12, y - 56, x + 12, y - 28, x + 10, y - 2)
  bodyPath.close()

  const leftArmPath = Skia.Path.Make()
  leftArmPath.moveTo(x - 10, y - 38)
  leftArmPath.cubicTo(x - 22, y - 38, x - 32, y - 34, x - 34, y - 24)
  leftArmPath.cubicTo(x - 36, y - 14, x - 32, y - 6, x - 26, y - 8)
  leftArmPath.cubicTo(x - 20, y - 10, x - 18, y - 18, x - 10, y - 30)
  leftArmPath.close()

  const rightArmPath = Skia.Path.Make()
  rightArmPath.moveTo(x + 10, y - 42)
  rightArmPath.cubicTo(x + 22, y - 42, x + 32, y - 36, x + 34, y - 24)
  rightArmPath.cubicTo(x + 36, y - 12, x + 30, y - 6, x + 24, y - 8)
  rightArmPath.cubicTo(x + 18, y - 10, x + 16, y - 20, x + 10, y - 34)
  rightArmPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={leftArmPath}  color={colors.bodyMid} style="fill" />
      <Path path={rightArmPath} color={colors.bodyMid} style="fill" />
      {/* Arm spines */}
      <Line p1={vec(x - 34, y - 20)} p2={vec(x - 40, y - 22)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x - 34, y - 26)} p2={vec(x - 40, y - 24)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x + 34, y - 22)} p2={vec(x + 40, y - 24)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x + 34, y - 28)} p2={vec(x + 40, y - 26)} color={SPINE} strokeWidth={1} />

      <Path path={bodyPath} color={colors.bodyMid} style="fill" />
      <Path path={bodyPath} color={colors.bodyLight} style="fill" opacity={0.07} />
      <Line p1={vec(x, y - 2)} p2={vec(x, y - 68)} color={RIDGE} strokeWidth={1.2} opacity={0.55} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 5, y - 64)} color={RIDGE} strokeWidth={0.9} opacity={0.45} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 5, y - 64)} color={RIDGE} strokeWidth={0.9} opacity={0.45} />
      {[-58, -46, -34, -22, -12].map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 11, y + yOff)} p2={vec(x - 17, y + yOff - 4)} color={SPINE} strokeWidth={1.2} />
          <Line p1={vec(x + 11, y + yOff)} p2={vec(x + 17, y + yOff - 4)} color={SPINE} strokeWidth={1.2} />
        </React.Fragment>
      ))}

      {/* Night-blooming flowers — white, bloom on mount */}
      {/* Main top */}
      <Circle cx={x} cy={y - 72} r={flowerR} color={NIGHT_FLOWER} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 5)} cy={useDerivedValue(() => y - 72 - bloom.value * 2)} r={petalR} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 5)} cy={useDerivedValue(() => y - 72 - bloom.value * 2)} r={petalR} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={x} cy={useDerivedValue(() => y - 72 - bloom.value * 5)} r={petalR} color={NIGHT_FLOWER} opacity={0.85} />
      <Circle cx={x} cy={y - 72} r={glowR} color={colors.bloom} opacity={glowOp} />

      {/* Left arm flower */}
      <Circle cx={x - 26} cy={y - 10} r={useDerivedValue(() => bloom.value * 4)} color={NIGHT_FLOWER} opacity={0.9} />
      <Circle cx={useDerivedValue(() => x - 26 - bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={NIGHT_FLOWER} opacity={0.8} />
      <Circle cx={useDerivedValue(() => x - 26 + bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={NIGHT_FLOWER} opacity={0.8} />

      {/* Right arm flower */}
      <Circle cx={x + 24} cy={y - 10} r={useDerivedValue(() => bloom.value * 4)} color={NIGHT_FLOWER} opacity={0.9} />
      <Circle cx={useDerivedValue(() => x + 24 - bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={NIGHT_FLOWER} opacity={0.8} />
      <Circle cx={useDerivedValue(() => x + 24 + bloom.value * 4)} cy={y - 10} r={useDerivedValue(() => bloom.value * 2.5)} color={NIGHT_FLOWER} opacity={0.8} />
    </>
  )
}

export default Stage4
