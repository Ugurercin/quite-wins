import React from 'react'
import { Circle, Oval, Path, Skia } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'

interface Props {
  x: number
  y: number
  theme: Theme
}

// Stage 1 — Tiny stem with a small glowing bud just poking out of the ground.
const Sprout = ({ x, y, theme }: Props) => {
  const stemHeight = 30

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 3, y - stemHeight * 0.5, x + 1, y - stemHeight)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  const budCx = x + 1
  const budCy = y - stemHeight - 4

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={theme.plant.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />

      {/* Curved stem */}
      <Path path={stemPath} color={theme.plant.sprout} style="stroke" strokeWidth={2.5} strokeCap="round" />

      {/* Tiny leaf nub */}
      <Oval x={x - 8} y={y - 18} width={8} height={5} color={theme.plant.sprout} />

      {/* Bud glow */}
      <Circle cx={budCx} cy={budCy} r={9} color={theme.plant.sprout} opacity={0.06} />
      <Circle cx={budCx} cy={budCy} r={7} color={theme.plant.sprout} opacity={0.1} />

      {/* Bud */}
      <Circle cx={budCx} cy={budCy} r={5} color={theme.plant.sprout} />

      {/* Bud highlight */}
      <Circle cx={budCx - 1} cy={budCy - 1} r={2.5} color={theme.plant.bodyLight} opacity={0.8} />

      {/* Tiny magical mote */}
      <Circle cx={budCx + 6} cy={budCy - 5} r={1.2} color={theme.plant.bodyLight} opacity={0.35} />
    </>
  )
}

export default Sprout