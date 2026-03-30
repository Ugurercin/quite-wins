import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Mushroom — Stage 1: Tiny white bump barely poking out of the ground.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 10, y)
  moundPath.quadTo(x, y - 5, x + 10, y)

  // Tiny cap just peeking out
  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 7, y - 2)
  capPath.quadTo(x, y - 14, x + 7, y - 2)
  capPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      {/* Tiny stem nub */}
      <Circle cx={x} cy={y - 2} r={3} color="#E8E0D0" />
      {/* Tiny cap */}
      <Path path={capPath} color="#D4472A" style="fill" />
      {/* Cap highlight */}
      <Circle cx={x - 1} cy={y - 9} r={2} color="#E86040" opacity={0.6} />
    </>
  )
}

export default Stage1