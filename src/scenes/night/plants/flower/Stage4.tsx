import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

const PETAL_R = 9
const SPREAD  = PETAL_R + 3
const DIAG    = 0.7

// Night Flower — Stage 4: Fully open moonlit bloom. Silver-white petals shimmer continuously.
const Stage4 = ({ x, y, colors, accentColor }: StageProps) => {
  const stemH   = 70
  const flowerY = y - stemH - 8
  // Moonlit accent — default to silver-white bloom colour
  const petalColor = accentColor ?? colors.bloom

  const bloom   = useSharedValue(0)
  const shimmer = useSharedValue(0.1)

  useEffect(() => {
    bloom.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(200, withTiming(1, { duration: 1800, easing: Easing.out(Easing.back(1.2)) }))
    )
    shimmer.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 850, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.1,  { duration: 850, easing: Easing.inOut(Easing.sin) })
      ),
      -1, false
    )
  }, [])

  const pr         = useDerivedValue(() => bloom.value * PETAL_R)
  const prSm       = useDerivedValue(() => bloom.value * PETAL_R * 0.82)
  const cR         = useDerivedValue(() => bloom.value * 7)
  const hiR        = useDerivedValue(() => bloom.value * 3.5)
  const shimmerR   = useDerivedValue(() => (8 + bloom.value * 6) * (0.8 + shimmer.value * 0.4))
  const shimmerOp  = useDerivedValue(() => shimmer.value * 0.45)

  const pN_cy  = useDerivedValue(() => flowerY - bloom.value * SPREAD)
  const pS_cy  = useDerivedValue(() => flowerY + bloom.value * SPREAD)
  const pE_cx  = useDerivedValue(() => x + bloom.value * SPREAD)
  const pW_cx  = useDerivedValue(() => x - bloom.value * SPREAD)
  const pNE_cx = useDerivedValue(() => x + bloom.value * SPREAD * DIAG)
  const pNE_cy = useDerivedValue(() => flowerY - bloom.value * SPREAD * DIAG)
  const pNW_cx = useDerivedValue(() => x - bloom.value * SPREAD * DIAG)
  const pNW_cy = useDerivedValue(() => flowerY - bloom.value * SPREAD * DIAG)
  const pSE_cx = useDerivedValue(() => x + bloom.value * SPREAD * DIAG)
  const pSE_cy = useDerivedValue(() => flowerY + bloom.value * SPREAD * DIAG)
  const pSW_cx = useDerivedValue(() => x - bloom.value * SPREAD * DIAG)
  const pSW_cy = useDerivedValue(() => flowerY + bloom.value * SPREAD * DIAG)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 2, y - 24, x + 3, y - 48, x, y - stemH)

  const mkLeaf = (ox: number, oy: number, tx: number, ty: number, bx: number, by: number) => {
    const p = Skia.Path.Make()
    p.moveTo(x, y + oy)
    p.quadTo(x + tx, y + ty, x + bx, y + by)
    p.quadTo(x + ox * 0.65, y + oy * 0.7, x, y + oy)
    return p
  }
  const ll = mkLeaf(0, -26, -23, -38, -19, -28)
  const lr = mkLeaf(0, -26,  23, -38,  19, -28)
  const ml = mkLeaf(0, -42, -19, -56, -15, -46)
  const mr = mkLeaf(0, -42,  19, -56,  15, -46)
  const ul = mkLeaf(0, -54, -13, -62, -9,  -56)
  const ur = mkLeaf(0, -54,  13, -62,  9,  -56)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 17, y)
  moundPath.quadTo(x, y - 8, x + 17, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath}  color={colors.trunk}   style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={ll} color={colors.bodyMid}  style="fill" />
      <Path path={lr} color={colors.bodyMid}  style="fill" />
      <Line p1={vec(x, y - 26)} p2={vec(x - 15, y - 33)} color={colors.bodyDark} strokeWidth={0.7} />
      <Line p1={vec(x, y - 26)} p2={vec(x + 15, y - 33)} color={colors.bodyDark} strokeWidth={0.7} />
      <Path path={ml} color={colors.bodyLight} style="fill" opacity={0.9} />
      <Path path={mr} color={colors.bodyLight} style="fill" opacity={0.9} />
      <Line p1={vec(x, y - 42)} p2={vec(x - 12, y - 50)} color={colors.sprout} strokeWidth={0.7} />
      <Line p1={vec(x, y - 42)} p2={vec(x + 12, y - 50)} color={colors.sprout} strokeWidth={0.7} />
      <Path path={ul} color={colors.sprout} style="fill" opacity={0.8} />
      <Path path={ur} color={colors.sprout} style="fill" opacity={0.8} />

      {/* Petals */}
      <Circle cx={x}      cy={pN_cy}  r={pr}   color={petalColor} />
      <Circle cx={x}      cy={pS_cy}  r={pr}   color={petalColor} />
      <Circle cx={pE_cx}  cy={flowerY} r={pr}  color={petalColor} />
      <Circle cx={pW_cx}  cy={flowerY} r={pr}  color={petalColor} />
      <Circle cx={pNE_cx} cy={pNE_cy} r={prSm} color={petalColor} opacity={0.85} />
      <Circle cx={pNW_cx} cy={pNW_cy} r={prSm} color={petalColor} opacity={0.85} />
      <Circle cx={pSE_cx} cy={pSE_cy} r={prSm} color={petalColor} opacity={0.85} />
      <Circle cx={pSW_cx} cy={pSW_cy} r={prSm} color={petalColor} opacity={0.85} />

      {/* Center */}
      <Circle cx={x} cy={flowerY} r={cR} color={colors.bloom} />
      <Circle cx={x - 1} cy={flowerY - 1} r={hiR} color="#FFFFFF" opacity={0.55} />

      {/* Moonlit shimmer glow */}
      <Circle cx={x} cy={flowerY} r={shimmerR} color={colors.bloom} opacity={shimmerOp} />
    </>
  )
}

export default Stage4
