import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Flower — Stage 2: Taller stem, silver-blue leaves catching moonlight.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const stemH = 44

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.quadTo(x + 2, y - stemH * 0.5, x, y - stemH)

  const leftLeaf = Skia.Path.Make()
  leftLeaf.moveTo(x, y - 26)
  leftLeaf.quadTo(x - 15, y - 34, x - 13, y - 28)
  leftLeaf.quadTo(x - 9, y - 22, x, y - 26)

  const rightLeaf = Skia.Path.Make()
  rightLeaf.moveTo(x, y - 26)
  rightLeaf.quadTo(x + 15, y - 34, x + 13, y - 28)
  rightLeaf.quadTo(x + 9, y - 22, x, y - 26)

  const upperLeaf = Skia.Path.Make()
  upperLeaf.moveTo(x, y - 36)
  upperLeaf.quadTo(x - 9, y - 42, x - 7, y - 36)
  upperLeaf.quadTo(x - 4, y - 32, x, y - 36)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3} strokeCap="round" />
      <Path path={leftLeaf} color={colors.bodyLight} style="fill" opacity={0.85} />
      <Path path={rightLeaf} color={colors.bodyLight} style="fill" opacity={0.85} />
      <Line p1={vec(x, y - 26)} p2={vec(x - 9, y - 30)} color={colors.sprout} strokeWidth={0.8} />
      <Line p1={vec(x, y - 26)} p2={vec(x + 9, y - 30)} color={colors.sprout} strokeWidth={0.8} />
      <Path path={upperLeaf} color={colors.bloom} style="fill" opacity={0.6} />
      {/* Moonlit bud */}
      <Circle cx={x} cy={y - stemH - 4} r={6} color={colors.sprout} />
      <Circle cx={x - 1} cy={y - stemH - 5} r={3} color={colors.bloom} opacity={0.65} />
    </>
  )
}

export default Stage2
