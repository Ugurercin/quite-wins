import React from 'react'
import { Circle, Line, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Crystal — Stage 3: Crystal sphere with facet overlay, inner light visible.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const BODY       = '#C0D8F8'
  const INNER      = '#E8F4FF'
  const FACET_DARK = '#8090B0'

  const cy = y - 40

  return (
    <>
      {/* Sphere body */}
      <Circle cx={x} cy={cy} r={28} color={BODY} />
      {/* Inner light */}
      <Circle cx={x} cy={cy} r={14} color={INNER} opacity={0.5} />
      <Circle cx={x} cy={cy} r={6}  color="#FFFFFF" opacity={0.65} />
      {/* Crystal facet lines */}
      <Line p1={vec(x, cy - 28)} p2={vec(x - 20, cy + 18)} color={FACET_DARK} strokeWidth={0.8} opacity={0.35} />
      <Line p1={vec(x, cy - 28)} p2={vec(x + 20, cy + 18)} color={FACET_DARK} strokeWidth={0.8} opacity={0.35} />
      <Line p1={vec(x - 20, cy + 18)} p2={vec(x + 20, cy + 18)} color={FACET_DARK} strokeWidth={0.8} opacity={0.35} />
      <Line p1={vec(x - 28, cy)} p2={vec(x, cy - 28)} color={FACET_DARK} strokeWidth={0.7} opacity={0.25} />
      <Line p1={vec(x + 28, cy)} p2={vec(x, cy - 28)} color={FACET_DARK} strokeWidth={0.7} opacity={0.25} />
      {/* Facet highlights */}
      <Circle cx={x - 8} cy={cy - 14} r={5} color="#FFFFFF" opacity={0.22} />
      {/* Bloom glow */}
      <Circle cx={x} cy={cy} r={30} color={colors.bloom} opacity={0.12} />
    </>
  )
}

export default Stage3
