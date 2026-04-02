import React from 'react'
import { Circle } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Terrestrial — Stage 2: Rocky proto-planet, dark surface, no atmosphere.
const Stage2 = ({ x, y }: StageProps) => {
  const SURFACE    = '#2A2840'
  const HIGHLIGHT  = '#403C5A'
  const DARK_PATCH = '#1E1C30'

  const cy = y - 30

  return (
    <>
      <Circle cx={x} cy={cy} r={22} color={SURFACE} />
      <Circle cx={x - 6} cy={cy - 6} r={10} color={HIGHLIGHT} opacity={0.5} />
      <Circle cx={x + 6} cy={cy + 5} r={8}  color={DARK_PATCH} opacity={0.6} />
      <Circle cx={x - 2} cy={cy - 3} r={3}  color={DARK_PATCH} opacity={0.5} />
      <Circle cx={x + 8} cy={cy - 8} r={4}  color={DARK_PATCH} opacity={0.4} />
      {/* Surface highlight top-left */}
      <Circle cx={x - 7} cy={cy - 10} r={5} color="#5A5470" opacity={0.35} />
    </>
  )
}

export default Stage2
