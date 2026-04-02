import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Gas — Stage 3: Gas giant with horizontal banded stripes, 3 colors.
const Stage3 = ({ x, y }: StageProps) => {
  const BODY   = '#A07040'
  const BAND1  = '#C09050'
  const BAND2  = '#8A5C30'
  const BAND3  = '#D4A868'

  const cy = y - 40

  const band1 = Skia.Path.Make()
  band1.moveTo(x - 27, cy - 7)
  band1.cubicTo(x - 12, cy - 2, x + 12, cy - 14, x + 27, cy - 7)
  band1.lineTo(x + 27, cy + 1)
  band1.cubicTo(x + 12, cy + 6, x - 12, cy - 6, x - 27, cy + 1)
  band1.close()

  const band2 = Skia.Path.Make()
  band2.moveTo(x - 26, cy + 8)
  band2.cubicTo(x - 10, cy + 15, x + 10, cy + 4, x + 26, cy + 8)
  band2.lineTo(x + 26, cy + 16)
  band2.cubicTo(x + 10, cy + 12, x - 10, cy + 23, x - 26, cy + 16)
  band2.close()

  return (
    <>
      <Circle cx={x} cy={cy} r={28} color={BODY} />
      <Path path={band1} color={BAND1} style="fill" opacity={0.65} />
      <Path path={band2} color={BAND2} style="fill" opacity={0.55} />
      <Circle cx={x - 10} cy={cy + 2} r={5} color={BAND3} opacity={0.5} />
      {/* Haze rim */}
      <Circle cx={x} cy={cy} r={30} color={BAND1} opacity={0.12} />
      {/* Highlight */}
      <Circle cx={x - 9} cy={cy - 12} r={8} color="#E0C080" opacity={0.18} />
    </>
  )
}

export default Stage3
