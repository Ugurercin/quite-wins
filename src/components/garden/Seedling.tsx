import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'

interface Props {
  x: number
  y: number
  theme: Theme
}

// Stage 2 — Taller stem with first leaves appearing.
const Seedling = ({ x, y, theme }: Props) => {
  const stemHeight = 46
  const budCy = y - stemHeight - 5

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 2, y - stemHeight * 0.5, x, y - stemHeight)

  const leftLeaf = Skia.Path.Make()
  leftLeaf.moveTo(x, y - 28)
  leftLeaf.quadTo(x - 16, y - 36, x - 14, y - 30)
  leftLeaf.quadTo(x - 10, y - 24, x, y - 28)

  const rightLeaf = Skia.Path.Make()
  rightLeaf.moveTo(x, y - 28)
  rightLeaf.quadTo(x + 16, y - 36, x + 14, y - 30)
  rightLeaf.quadTo(x + 10, y - 24, x, y - 28)

  const upperLeaf = Skia.Path.Make()
  upperLeaf.moveTo(x, y - 38)
  upperLeaf.quadTo(x - 10, y - 44, x - 8, y - 38)
  upperLeaf.quadTo(x - 5, y - 34, x, y - 38)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 14, y)
  moundPath.quadTo(x, y - 7, x + 14, y)

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={theme.plant.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />

      {/* Stem */}
      <Path path={stemPath} color={theme.plant.trunk} style="stroke" strokeWidth={3} strokeCap="round" />

      {/* Lower leaves */}
      <Path path={leftLeaf} color={theme.plant.bodyLight} style="fill" />
      <Path path={rightLeaf} color={theme.plant.bodyLight} style="fill" />

      {/* Leaf vein hints */}
      <Line p1={vec(x, y - 28)} p2={vec(x - 10, y - 32)} color={theme.plant.bodyMid} strokeWidth={0.8} />
      <Line p1={vec(x, y - 28)} p2={vec(x + 10, y - 32)} color={theme.plant.bodyMid} strokeWidth={0.8} />

      {/* Small upper leaf */}
      <Path path={upperLeaf} color={theme.plant.sprout} style="fill" />

      {/* Bud glow */}
      <Circle cx={x} cy={budCy} r={12} color={theme.plant.sprout} opacity={0.07} />
      <Circle cx={x} cy={budCy} r={9} color={theme.plant.sprout} opacity={0.12} />

      {/* Bud */}
      <Circle cx={x} cy={budCy} r={6} color={theme.plant.sprout} />

      {/* Bud highlight */}
      <Circle cx={x - 1} cy={budCy - 1} r={3} color={theme.plant.bodyLight} opacity={0.78} />

      {/* Tiny side mote */}
      <Circle cx={x + 7} cy={budCy - 6} r={1.3} color={theme.plant.bodyLight} opacity={0.35} />
    </>
  )
}

export default Seedling