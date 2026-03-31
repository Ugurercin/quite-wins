import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Flower — Stage 3: Fuller, silver-blue leaf tiers, partially open moonlit bud.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const stemH = 60

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 2, y - 20, x + 3, y - 40, x, y - stemH)

  const mkLeaf = (ox: number, oy: number, tx: number, ty: number, bx: number, by: number) => {
    const p = Skia.Path.Make()
    p.moveTo(x, y + oy)
    p.quadTo(x + tx, y + ty, x + bx, y + by)
    p.quadTo(x + ox * 0.6, y + oy * 0.7, x, y + oy)
    return p
  }

  const ll = mkLeaf(0, -22, -20, -32, -16, -24)
  const lr = mkLeaf(0, -22,  20, -32,  16, -24)
  const ml = mkLeaf(0, -36, -17, -48, -13, -40)
  const mr = mkLeaf(0, -36,  17, -48,  13, -40)
  const tl = mkLeaf(0, -48, -11, -56,  -8, -50)
  const tr = mkLeaf(0, -48,  11, -56,   8, -50)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 15, y)
  moundPath.quadTo(x, y - 7, x + 15, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3.5} strokeCap="round" />
      <Path path={ll} color={colors.bodyMid} style="fill" />
      <Path path={lr} color={colors.bodyMid} style="fill" />
      <Line p1={vec(x, y - 22)} p2={vec(x - 13, y - 28)} color={colors.bodyDark} strokeWidth={0.7} />
      <Line p1={vec(x, y - 22)} p2={vec(x + 13, y - 28)} color={colors.bodyDark} strokeWidth={0.7} />
      <Path path={ml} color={colors.bodyLight} style="fill" opacity={0.9} />
      <Path path={mr} color={colors.bodyLight} style="fill" opacity={0.9} />
      <Line p1={vec(x, y - 36)} p2={vec(x - 10, y - 43)} color={colors.sprout} strokeWidth={0.7} />
      <Line p1={vec(x, y - 36)} p2={vec(x + 10, y - 43)} color={colors.sprout} strokeWidth={0.7} />
      <Path path={tl} color={colors.sprout} style="fill" opacity={0.8} />
      <Path path={tr} color={colors.sprout} style="fill" opacity={0.8} />
      {/* Partially open moonlit bud */}
      <Circle cx={x} cy={y - stemH - 3} r={9} color={colors.bodyMid} />
      <Circle cx={x} cy={y - stemH - 3} r={6} color={colors.bloom} opacity={0.7} />
      <Circle cx={x - 1} cy={y - stemH - 4} r={3} color="#FFFFFF" opacity={0.4} />
    </>
  )
}

export default Stage3
