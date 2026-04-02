import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Flower — Stage 1: Tiny sprout, full of promise.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const stemHeight = 32

  // Soft filled mound — rounded soil
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 15, y)
  moundPath.quadTo(x - 7, y - 10, x, y - 11)
  moundPath.quadTo(x + 7, y - 10, x + 15, y)
  moundPath.close()

  // Organic S-curve stem
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y - 9)
  stemPath.cubicTo(x + 4, y - 17, x - 3, y - 25, x + 1, y - stemHeight)

  // Tiny left leaf nub — just a hint of growth
  const leftNub = Skia.Path.Make()
  leftNub.moveTo(x, y - 19)
  leftNub.quadTo(x - 9, y - 25, x - 7, y - 18)
  leftNub.quadTo(x - 3, y - 14, x, y - 19)

  // Tiny right leaf nub
  const rightNub = Skia.Path.Make()
  rightNub.moveTo(x, y - 19)
  rightNub.quadTo(x + 9, y - 25, x + 7, y - 18)
  rightNub.quadTo(x + 3, y - 14, x, y - 19)

  // Teardrop bud — slightly tilted, two-tone
  const budBase = y - stemHeight
  const budOuter = Skia.Path.Make()
  budOuter.moveTo(x + 1, budBase)
  budOuter.cubicTo(x + 7, budBase - 2, x + 7, budBase - 12, x + 1, budBase - 15)
  budOuter.cubicTo(x - 5, budBase - 12, x - 4, budBase - 2, x + 1, budBase)

  const budInner = Skia.Path.Make()
  budInner.moveTo(x + 1, budBase - 4)
  budInner.cubicTo(x + 4, budBase - 6, x + 4, budBase - 12, x + 1, budBase - 14)
  budInner.cubicTo(x - 2, budBase - 12, x - 2, budBase - 6, x + 1, budBase - 4)

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={colors.bodyDark} style="fill" opacity={0.85} />
      {/* Stem */}
      <Path path={stemPath} color={colors.sprout} style="stroke" strokeWidth={2.5} strokeCap="round" />
      {/* Leaf nubs */}
      <Path path={leftNub} color={colors.sprout} style="fill" />
      <Path path={rightNub} color={colors.sprout} style="fill" />
      {/* Teardrop bud — darker base, lighter tip */}
      <Path path={budOuter} color={colors.bodyMid} style="fill" />
      <Path path={budInner} color={colors.sprout} style="fill" />
      {/* Highlight on bud tip */}
      <Circle cx={x + 1} cy={budBase - 12} r={1.5} color="#FFFFFF" opacity={0.55} />
    </>
  )
}

export default Stage1
