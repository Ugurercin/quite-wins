import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Cactus — Stage 1: Small dark barrel, silver moonlit spines.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const SPINE = '#C0C8E0'  // moonlit silver-blue

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 10, y)
  moundPath.quadTo(x, y - 5, x + 10, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Circle cx={x} cy={y - 8} r={8} color={colors.bodyDark} />
      <Circle cx={x} cy={y - 8} r={6} color={colors.bodyMid} />
      {/* Moonlit ridges */}
      <Line p1={vec(x, y - 1)} p2={vec(x, y - 15)} color={colors.sprout} strokeWidth={0.8} opacity={0.5} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 4, y - 14)} color={colors.sprout} strokeWidth={0.7} opacity={0.4} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 4, y - 14)} color={colors.sprout} strokeWidth={0.7} opacity={0.4} />
      {/* Silver moonlit spines */}
      <Line p1={vec(x, y - 16)} p2={vec(x, y - 21)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x - 8, y - 8)} p2={vec(x - 13, y - 8)} color={SPINE} strokeWidth={1} />
      <Line p1={vec(x + 8, y - 8)} p2={vec(x + 13, y - 8)} color={SPINE} strokeWidth={1} />
    </>
  )
}

export default Stage1
