import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Terrestrial — Stage 3: Gas giant phase, swirling atmospheric bands, warm tone.
const Stage3 = ({ x, y }: StageProps) => {
  const BODY   = '#6A508A'
  const BAND1  = '#8065A0'
  const BAND2  = '#5A4078'
  const BAND3  = '#9878B0'

  const cy = y - 40

  // Swirl band paths clipped to sphere radius 28
  const band1 = Skia.Path.Make()
  band1.moveTo(x - 26, cy - 5)
  band1.cubicTo(x - 10, cy - 12, x + 10, cy + 2, x + 26, cy - 5)
  band1.lineTo(x + 26, cy + 1)
  band1.cubicTo(x + 10, cy + 8, x - 10, cy - 4, x - 26, cy + 1)
  band1.close()

  const band2 = Skia.Path.Make()
  band2.moveTo(x - 25, cy + 7)
  band2.cubicTo(x - 8, cy + 14, x + 8, cy + 3, x + 25, cy + 7)
  band2.lineTo(x + 25, cy + 13)
  band2.cubicTo(x + 8, cy + 9, x - 8, cy + 20, x - 25, cy + 13)
  band2.close()

  return (
    <>
      <Circle cx={x} cy={cy} r={28} color={BODY} />
      <Path path={band1} color={BAND1} style="fill" opacity={0.6} />
      <Path path={band2} color={BAND2} style="fill" opacity={0.5} />
      <Circle cx={x - 8} cy={cy + 2} r={6} color={BAND3} opacity={0.4} />
      {/* Atmosphere highlight */}
      <Circle cx={x - 10} cy={cy - 12} r={9} color="#A090C0" opacity={0.2} />
      <Circle cx={x} cy={cy} r={29} color="#8060C0" opacity={0.07} />
    </>
  )
}

export default Stage3
