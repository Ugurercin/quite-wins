import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Flower — Stage 3: Bushy and beautiful, bud opening.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const stemHeight = 64

  // Organic cubic stem
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 3, y - 20, x + 4, y - 43, x, y - stemHeight)

  // Lower leaves — wide cubic curves, rounded tips
  const lowerLeft = Skia.Path.Make()
  lowerLeft.moveTo(x, y - 22)
  lowerLeft.cubicTo(x - 14, y - 25, x - 27, y - 35, x - 21, y - 24)
  lowerLeft.cubicTo(x - 15, y - 17, x, y - 22, x, y - 22)

  const lowerRight = Skia.Path.Make()
  lowerRight.moveTo(x, y - 22)
  lowerRight.cubicTo(x + 14, y - 25, x + 27, y - 35, x + 21, y - 24)
  lowerRight.cubicTo(x + 15, y - 17, x, y - 22, x, y - 22)

  // Mid leaves — slightly overlapping lower
  const midLeft = Skia.Path.Make()
  midLeft.moveTo(x, y - 38)
  midLeft.cubicTo(x - 12, y - 42, x - 23, y - 53, x - 18, y - 43)
  midLeft.cubicTo(x - 11, y - 36, x, y - 38, x, y - 38)

  const midRight = Skia.Path.Make()
  midRight.moveTo(x, y - 38)
  midRight.cubicTo(x + 12, y - 42, x + 23, y - 53, x + 18, y - 43)
  midRight.cubicTo(x + 11, y - 36, x, y - 38, x, y - 38)

  // Top leaves — dense, sprout color, slightly overlapping mid
  const topLeft = Skia.Path.Make()
  topLeft.moveTo(x, y - 51)
  topLeft.cubicTo(x - 8, y - 55, x - 16, y - 62, x - 12, y - 54)
  topLeft.cubicTo(x - 7, y - 48, x, y - 51, x, y - 51)

  const topRight = Skia.Path.Make()
  topRight.moveTo(x, y - 51)
  topRight.cubicTo(x + 8, y - 55, x + 16, y - 62, x + 12, y - 54)
  topRight.cubicTo(x + 7, y - 48, x, y - 51, x, y - 51)

  // Filled rounded mound
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 18, y)
  moundPath.quadTo(x - 8, y - 11, x, y - 12)
  moundPath.quadTo(x + 8, y - 11, x + 18, y)
  moundPath.close()

  const budCy = y - stemHeight - 7

  return (
    <>
      {/* Soil mound — filled */}
      <Path path={moundPath} color={colors.bodyDark} style="fill" opacity={0.9} />

      {/* Stem */}
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3.5} strokeCap="round" />

      {/* Lower leaves */}
      <Path path={lowerLeft} color={colors.bodyMid} style="fill" />
      <Path path={lowerRight} color={colors.bodyMid} style="fill" />
      <Line p1={vec(x, y - 22)} p2={vec(x - 17, y - 30)} color={colors.bodyDark} strokeWidth={0.7} opacity={0.3} />
      <Line p1={vec(x, y - 22)} p2={vec(x + 17, y - 30)} color={colors.bodyDark} strokeWidth={0.7} opacity={0.3} />

      {/* Mid leaves */}
      <Path path={midLeft} color={colors.bodyLight} style="fill" />
      <Path path={midRight} color={colors.bodyLight} style="fill" />
      <Line p1={vec(x, y - 38)} p2={vec(x - 14, y - 47)} color={colors.bodyMid} strokeWidth={0.7} opacity={0.3} />
      <Line p1={vec(x, y - 38)} p2={vec(x + 14, y - 47)} color={colors.bodyMid} strokeWidth={0.7} opacity={0.3} />

      {/* Top leaves */}
      <Path path={topLeft} color={colors.sprout} style="fill" />
      <Path path={topRight} color={colors.sprout} style="fill" />

      {/* Bud glow — bloom is coming */}
      <Circle cx={x} cy={budCy} r={16} color={colors.bloom} opacity={0.13} />
      <Circle cx={x} cy={budCy} r={10} color={colors.bloom} opacity={0.18} />

      {/* Petal hints — 3 petals peeking out around the bud */}
      <Circle cx={x} cy={budCy - 9} r={4.5} color={colors.bloom} opacity={0.5} />
      <Circle cx={x - 8} cy={budCy - 3} r={3.5} color={colors.bloom} opacity={0.4} />
      <Circle cx={x + 8} cy={budCy - 3} r={3.5} color={colors.bloom} opacity={0.4} />

      {/* Bud body */}
      <Circle cx={x} cy={budCy} r={9} color={colors.bodyMid} />
      {/* Inner bloom center — first glimpse of the flower */}
      <Circle cx={x} cy={budCy} r={6} color={colors.bloom} />
      {/* Highlight */}
      <Circle cx={x - 1} cy={budCy - 2} r={2.5} color={colors.bodyLight} opacity={0.5} />
    </>
  )
}

export default Stage3
