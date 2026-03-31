import React from 'react'
import { Circle, Oval, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Flower — Stage 1: Tiny pale stem, a silver bud catching the moonlight.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const stemH = 28

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 2, y - stemH * 0.5, x, y - stemH)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 10, y)
  moundPath.quadTo(x, y - 5, x + 10, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color={colors.sprout} style="stroke" strokeWidth={2} strokeCap="round" />
      <Oval x={x - 7} y={y - 16} width={7} height={4} color={colors.sprout} />
      {/* Silver bud — moonlit */}
      <Circle cx={x} cy={y - stemH - 3} r={5} color={colors.bloom} opacity={0.75} />
      <Circle cx={x - 1} cy={y - stemH - 4} r={2.5} color="#FFFFFF" opacity={0.45} />
    </>
  )
}

export default Stage1
