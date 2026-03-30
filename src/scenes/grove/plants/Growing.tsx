import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { SceneColors } from '@/scenes/types'

interface Props {
  x: number
  y: number
  colors: SceneColors
}

// Stage 3 — Fuller, bushier plant. Multiple leaf tiers, partially open flower bud.
const Growing = ({ x, y, colors }: Props) => {
  const stemHeight = 62

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 2, y - 20, x + 3, y - 40, x, y - stemHeight)

  const lowerLeftLeaf = Skia.Path.Make()
  lowerLeftLeaf.moveTo(x, y - 22)
  lowerLeftLeaf.quadTo(x - 22, y - 32, x - 18, y - 24)
  lowerLeftLeaf.quadTo(x - 12, y - 18, x, y - 22)

  const lowerRightLeaf = Skia.Path.Make()
  lowerRightLeaf.moveTo(x, y - 22)
  lowerRightLeaf.quadTo(x + 22, y - 32, x + 18, y - 24)
  lowerRightLeaf.quadTo(x + 12, y - 18, x, y - 22)

  const midLeftLeaf = Skia.Path.Make()
  midLeftLeaf.moveTo(x, y - 38)
  midLeftLeaf.quadTo(x - 18, y - 50, x - 14, y - 42)
  midLeftLeaf.quadTo(x - 8, y - 36, x, y - 38)

  const midRightLeaf = Skia.Path.Make()
  midRightLeaf.moveTo(x, y - 38)
  midRightLeaf.quadTo(x + 18, y - 50, x + 14, y - 42)
  midRightLeaf.quadTo(x + 8, y - 36, x, y - 38)

  const topLeftLeaf = Skia.Path.Make()
  topLeftLeaf.moveTo(x, y - 50)
  topLeftLeaf.quadTo(x - 12, y - 58, x - 9, y - 52)
  topLeftLeaf.quadTo(x - 5, y - 48, x, y - 50)

  const topRightLeaf = Skia.Path.Make()
  topRightLeaf.moveTo(x, y - 50)
  topRightLeaf.quadTo(x + 12, y - 58, x + 9, y - 52)
  topRightLeaf.quadTo(x + 5, y - 48, x, y - 50)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 16, y)
  moundPath.quadTo(x, y - 8, x + 16, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3.5} strokeCap="round" />
      <Path path={lowerLeftLeaf} color={colors.bodyMid} style="fill" />
      <Path path={lowerRightLeaf} color={colors.bodyMid} style="fill" />
      <Line p1={vec(x, y - 22)} p2={vec(x - 14, y - 28)} color={colors.bodyDark} strokeWidth={0.7} />
      <Line p1={vec(x, y - 22)} p2={vec(x + 14, y - 28)} color={colors.bodyDark} strokeWidth={0.7} />
      <Path path={midLeftLeaf} color={colors.bodyLight} style="fill" />
      <Path path={midRightLeaf} color={colors.bodyLight} style="fill" />
      <Line p1={vec(x, y - 38)} p2={vec(x - 11, y - 45)} color={colors.bodyMid} strokeWidth={0.7} />
      <Line p1={vec(x, y - 38)} p2={vec(x + 11, y - 45)} color={colors.bodyMid} strokeWidth={0.7} />
      <Path path={topLeftLeaf} color={colors.sprout} style="fill" />
      <Path path={topRightLeaf} color={colors.sprout} style="fill" />
      <Circle cx={x} cy={y - stemHeight - 4} r={9} color={colors.bodyMid} />
      <Circle cx={x} cy={y - stemHeight - 4} r={6} color={colors.bloom} />
      <Circle cx={x - 1} cy={y - stemHeight - 5} r={3} color={colors.bodyLight} opacity={0.5} />
    </>
  )
}

export default Growing