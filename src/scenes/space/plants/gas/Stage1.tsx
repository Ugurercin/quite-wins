import React from 'react'
import { Circle } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Gas — Stage 1: Tiny dust cloud, a few small circles clustered.
const Stage1 = ({ x, y }: StageProps) => {
  const DUST = '#806040'
  const HAZE = '#A08060'

  const cy = y - 16

  return (
    <>
      <Circle cx={x - 6} cy={cy + 3}  r={6}   color={DUST} opacity={0.55} />
      <Circle cx={x + 5} cy={cy + 2}  r={5}   color={DUST} opacity={0.50} />
      <Circle cx={x}     cy={cy - 2}  r={7}   color={HAZE} opacity={0.45} />
      <Circle cx={x - 2} cy={cy + 6}  r={4}   color={DUST} opacity={0.40} />
      <Circle cx={x + 7} cy={cy - 2}  r={3.5} color={HAZE} opacity={0.35} />
      <Circle cx={x - 8} cy={cy - 1}  r={3}   color={DUST} opacity={0.30} />
    </>
  )
}

export default Stage1
