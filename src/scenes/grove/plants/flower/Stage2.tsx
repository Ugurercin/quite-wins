import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Flower — Stage 2: Taller stem with first leaves appearing.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const stemHeight = 46

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
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3} strokeCap="round" />
      <Path path={leftLeaf} color={colors.bodyLight} style="fill" />
      <Path path={rightLeaf} color={colors.bodyLight} style="fill" />
      <Line p1={vec(x, y - 28)} p2={vec(x - 10, y - 32)} color={colors.bodyMid} strokeWidth={0.8} />
      <Line p1={vec(x, y - 28)} p2={vec(x + 10, y - 32)} color={colors.bodyMid} strokeWidth={0.8} />
      <Path path={upperLeaf} color={colors.sprout} style="fill" />
      <Circle cx={x} cy={y - stemHeight - 5} r={6} color={colors.sprout} />
      <Circle cx={x - 1} cy={y - stemHeight - 6} r={3} color={colors.bodyLight} opacity={0.6} />
    </>
  )
}

export default Stage2