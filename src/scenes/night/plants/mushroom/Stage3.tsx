import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Mushroom — Stage 3: Fuller stem, wider dark cap, several bioluminescent spots.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const stemH = 28

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 13, y)
  moundPath.quadTo(x, y - 6, x + 13, y)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 6, y)
  stemPath.cubicTo(x - 6, y - 10, x - 4, y - stemH, x - 3, y - stemH)
  stemPath.lineTo(x + 3, y - stemH)
  stemPath.cubicTo(x + 4, y - stemH, x + 6, y - 10, x + 6, y)
  stemPath.close()

  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 11, y - stemH + 3)
  skirtPath.quadTo(x, y - stemH + 8, x + 11, y - stemH + 3)

  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 22, y - stemH + 2)
  capPath.quadTo(x - 20, y - stemH - 28, x, y - stemH - 34)
  capPath.quadTo(x + 20, y - stemH - 28, x + 22, y - stemH + 2)
  capPath.close()

  const gillPath = Skia.Path.Make()
  gillPath.moveTo(x - 22, y - stemH + 2)
  gillPath.quadTo(x, y - stemH + 11, x + 22, y - stemH + 2)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color="#1A2820" style="fill" />
      <Path path={skirtPath} color="#243A2E" style="stroke" strokeWidth={2} opacity={0.7} />
      <Path path={capPath} color="#0B2218" style="fill" />
      <Path path={capPath} color="#0D2A1E" style="stroke" strokeWidth={1.5} opacity={0.4} />
      <Path path={gillPath} color="#0A1810" style="stroke" strokeWidth={2} opacity={0.5} />
      {/* Bioluminescent spots — growing in count */}
      <Circle cx={x} cy={y - stemH - 27} r={4} color="#7DFFC8" opacity={0.75} />
      <Circle cx={x - 11} cy={y - stemH - 18} r={3} color="#7DFFC8" opacity={0.68} />
      <Circle cx={x + 10} cy={y - stemH - 20} r={3.5} color="#7DFFC8" opacity={0.65} />
      <Circle cx={x - 4} cy={y - stemH - 10} r={2} color="#7DFFC8" opacity={0.58} />
      {/* Faint glow under cap */}
      <Circle cx={x} cy={y - stemH - 14} r={14} color="#40D890" opacity={0.07} />
    </>
  )
}

export default Stage3
