import React from 'react'
import { Circle, Oval, Path, Skia } from '@shopify/react-native-skia'
import { SceneColors } from '@/scenes/types'

interface Props {
  x: number
  y: number
  colors: SceneColors
}

// Stage 1 — Tiny stem with a small bud just poking out of the ground.
const Sprout = ({ x, y, colors }: Props) => {
  const stemHeight = 30

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 3, y - stemHeight * 0.5, x + 1, y - stemHeight)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color={colors.sprout} style="stroke" strokeWidth={2.5} strokeCap="round" />
      <Oval x={x - 8} y={y - 18} width={8} height={5} color={colors.sprout} />
      <Circle cx={x + 1} cy={y - stemHeight - 4} r={5} color={colors.sprout} />
      <Circle cx={x} cy={y - stemHeight - 5} r={2.5} color={colors.bodyLight} opacity={0.7} />
    </>
  )
}

export default Sprout