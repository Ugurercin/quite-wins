import React from 'react'
import { Circle } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Gas — Stage 2: Small sphere, hazy edge, warm amber-brown.
const Stage2 = ({ x, y }: StageProps) => {
  const BODY = '#8A6030'
  const HAZE = '#C09050'

  const cy = y - 28

  return (
    <>
      {/* Haze rim */}
      <Circle cx={x} cy={cy} r={22} color={HAZE} opacity={0.22} />
      {/* Body */}
      <Circle cx={x} cy={cy} r={18} color={BODY} />
      {/* Band hint */}
      <Circle cx={x - 4} cy={cy - 2} r={8} color="#A07040" opacity={0.4} />
      {/* Highlight */}
      <Circle cx={x - 6} cy={cy - 7} r={5} color="#C0A060" opacity={0.3} />
    </>
  )
}

export default Stage2
