import React from 'react'
import { Circle, Line, Oval, Path, Skia, vec } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'

interface Props {
  x: number
  y: number
  theme: Theme
}

// Stage 3 — Fuller, bushier plant. Multiple leaf tiers, partially open flower bud.
const Growing = ({ x, y, theme }: Props) => {
  const stemHeight = 62

  // Main stem — slight S-curve for organic feel
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 2, y - 20, x + 3, y - 40, x, y - stemHeight)

  // Lower leaf pair — larger, drooping slightly
  const lowerLeftLeaf = Skia.Path.Make()
  lowerLeftLeaf.moveTo(x, y - 22)
  lowerLeftLeaf.quadTo(x - 22, y - 32, x - 18, y - 24)
  lowerLeftLeaf.quadTo(x - 12, y - 18, x, y - 22)

  const lowerRightLeaf = Skia.Path.Make()
  lowerRightLeaf.moveTo(x, y - 22)
  lowerRightLeaf.quadTo(x + 22, y - 32, x + 18, y - 24)
  lowerRightLeaf.quadTo(x + 12, y - 18, x, y - 22)

  // Mid leaf pair — medium, angled upward
  const midLeftLeaf = Skia.Path.Make()
  midLeftLeaf.moveTo(x, y - 38)
  midLeftLeaf.quadTo(x - 18, y - 50, x - 14, y - 42)
  midLeftLeaf.quadTo(x - 8, y - 36, x, y - 38)

  const midRightLeaf = Skia.Path.Make()
  midRightLeaf.moveTo(x, y - 38)
  midRightLeaf.quadTo(x + 18, y - 50, x + 14, y - 42)
  midRightLeaf.quadTo(x + 8, y - 36, x, y - 38)

  // Small top leaves — tight to stem
  const topLeftLeaf = Skia.Path.Make()
  topLeftLeaf.moveTo(x, y - 50)
  topLeftLeaf.quadTo(x - 12, y - 58, x - 9, y - 52)
  topLeftLeaf.quadTo(x - 5, y - 48, x, y - 50)

  const topRightLeaf = Skia.Path.Make()
  topRightLeaf.moveTo(x, y - 50)
  topRightLeaf.quadTo(x + 12, y - 58, x + 9, y - 52)
  topRightLeaf.quadTo(x + 5, y - 48, x, y - 50)

  // Soil mound
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 16, y)
  moundPath.quadTo(x, y - 8, x + 16, y)

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={theme.plant.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      {/* Stem */}
      <Path path={stemPath} color={theme.plant.trunk} style="stroke" strokeWidth={3.5} strokeCap="round" />
      {/* Lower leaves — darkest */}
      <Path path={lowerLeftLeaf} color={theme.plant.bodyMid} style="fill" />
      <Path path={lowerRightLeaf} color={theme.plant.bodyMid} style="fill" />
      {/* Leaf veins — lower */}
      <Line p1={vec(x, y - 22)} p2={vec(x - 14, y - 28)} color={theme.plant.bodyDark} strokeWidth={0.7} />
      <Line p1={vec(x, y - 22)} p2={vec(x + 14, y - 28)} color={theme.plant.bodyDark} strokeWidth={0.7} />
      {/* Mid leaves — medium green */}
      <Path path={midLeftLeaf} color={theme.plant.bodyLight} style="fill" />
      <Path path={midRightLeaf} color={theme.plant.bodyLight} style="fill" />
      {/* Leaf veins — mid */}
      <Line p1={vec(x, y - 38)} p2={vec(x - 11, y - 45)} color={theme.plant.bodyMid} strokeWidth={0.7} />
      <Line p1={vec(x, y - 38)} p2={vec(x + 11, y - 45)} color={theme.plant.bodyMid} strokeWidth={0.7} />
      {/* Top leaves — brightest */}
      <Path path={topLeftLeaf} color={theme.plant.sprout} style="fill" />
      <Path path={topRightLeaf} color={theme.plant.sprout} style="fill" />
      {/* Flower bud — partially formed, showing color */}
      <Circle cx={x} cy={y - stemHeight - 4} r={9} color={theme.plant.bodyMid} />
      <Circle cx={x} cy={y - stemHeight - 4} r={6} color={theme.plant.bloom} />
      {/* Inner bud highlight */}
      <Circle cx={x - 1} cy={y - stemHeight - 5} r={3} color={theme.plant.bodyLight} opacity={0.5} />
    </>
  )
}

export default Growing
