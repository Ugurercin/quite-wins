import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Cactus — Stage 1: Single tiny round nub with first spines.
const Stage1 = ({ x, y, colors }: StageProps) => {
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 10, y)
  moundPath.quadTo(x, y - 5, x + 10, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      {/* Tiny barrel */}
      <Circle cx={x} cy={y - 8} r={8} color="#4A8A3A" />
      <Circle cx={x} cy={y - 8} r={6} color="#5A9E44" />
      {/* Ridges */}
      <Line p1={vec(x, y - 1)} p2={vec(x, y - 15)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 4, y - 14)} color="#3A7A2A" strokeWidth={0.8} opacity={0.4} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 4, y - 14)} color="#3A7A2A" strokeWidth={0.8} opacity={0.4} />
      {/* Tiny spines */}
      <Line p1={vec(x, y - 16)} p2={vec(x, y - 20)} color="#D4C8A8" strokeWidth={1} />
      <Line p1={vec(x - 8, y - 8)} p2={vec(x - 12, y - 8)} color="#D4C8A8" strokeWidth={1} />
      <Line p1={vec(x + 8, y - 8)} p2={vec(x + 12, y - 8)} color="#D4C8A8" strokeWidth={1} />
    </>
  )
}

export default Stage1