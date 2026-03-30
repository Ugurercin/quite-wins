import React from 'react'
import { Circle, Line, Oval, Path, Skia, vec } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'

interface Props {
  x: number
  y: number
  theme: Theme
}

// Stage 1 — Tiny stem with a small bud just poking out of the ground.
// Curved stem, small soil mound at base, bud with inner highlight.
const Sprout = ({ x, y, theme }: Props) => {
  const stemHeight = 30

  // Curved stem path — slight lean to the right
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 3, y - stemHeight * 0.5, x + 1, y - stemHeight)

  // Small soil mound
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={theme.plant.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      {/* Curved stem */}
      <Path path={stemPath} color={theme.plant.sprout} style="stroke" strokeWidth={2.5} strokeCap="round" />
      {/* Tiny leaf nub — left */}
      <Oval x={x - 8} y={y - 18} width={8} height={5} color={theme.plant.sprout} />
      {/* Bud */}
      <Circle cx={x + 1} cy={y - stemHeight - 4} r={5} color={theme.plant.sprout} />
      {/* Bud highlight */}
      <Circle cx={x} cy={y - stemHeight - 5} r={2.5} color={theme.plant.bodyLight} opacity={0.7} />
    </>
  )
}

export default Sprout
