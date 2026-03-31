import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Mushroom — Stage 1: Tiny dark cap peeking out. A single faint bioluminescent spot.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 10, y)
  moundPath.quadTo(x, y - 5, x + 10, y)

  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 7, y - 2)
  capPath.quadTo(x, y - 14, x + 7, y - 2)
  capPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      {/* Pale stem nub */}
      <Circle cx={x} cy={y - 2} r={3} color="#1A2820" />
      {/* Dark cap */}
      <Path path={capPath} color="#0D2A1E" style="fill" />
      {/* Single bioluminescent spot */}
      <Circle cx={x} cy={y - 8} r={2.2} color="#7DFFC8" opacity={0.7} />
    </>
  )
}

export default Stage1
