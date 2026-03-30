import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Mushroom — Stage 3: Fuller stem, wider cap, spots appearing.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const stemH = 30

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 14, y)
  moundPath.quadTo(x, y - 7, x + 14, y)

  // Wider stem with slight taper
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 7, y)
  stemPath.cubicTo(x - 7, y - 10, x - 5, y - stemH, x - 4, y - stemH)
  stemPath.lineTo(x + 4, y - stemH)
  stemPath.cubicTo(x + 5, y - stemH, x + 7, y - 10, x + 7, y)
  stemPath.close()

  // Skirt/veil ring around stem
  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 12, y - stemH + 4)
  skirtPath.quadTo(x, y - stemH + 10, x + 12, y - stemH + 4)

  // Wider dome cap
  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 24, y - stemH + 3)
  capPath.quadTo(x - 22, y - stemH - 28, x, y - stemH - 34)
  capPath.quadTo(x + 22, y - stemH - 28, x + 24, y - stemH + 3)
  capPath.close()

  const gillPath = Skia.Path.Make()
  gillPath.moveTo(x - 24, y - stemH + 3)
  gillPath.quadTo(x, y - stemH + 12, x + 24, y - stemH + 3)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color="#D4C8A8" style="fill" />
      <Path path={skirtPath} color="#C8BC9A" style="stroke" strokeWidth={2} opacity={0.7} />
      <Path path={capPath} color="#C43D22" style="fill" />
      {/* Darker edge of cap */}
      <Path path={capPath} color="#A02E14" style="stroke" strokeWidth={1.5} opacity={0.4} />
      <Path path={gillPath} color="#B8907A" style="stroke" strokeWidth={2} opacity={0.5} />
      {/* Spots */}
      <Circle cx={x} cy={y - stemH - 26} r={4} color="#FFFFFF" opacity={0.75} />
      <Circle cx={x - 12} cy={y - stemH - 18} r={3} color="#FFFFFF" opacity={0.7} />
      <Circle cx={x + 11} cy={y - stemH - 20} r={3.5} color="#FFFFFF" opacity={0.65} />
      <Circle cx={x - 4} cy={y - stemH - 12} r={2} color="#FFFFFF" opacity={0.6} />
      {/* Cap sheen */}
      <Circle cx={x - 4} cy={y - stemH - 28} r={4} color="#E86040" opacity={0.25} />
    </>
  )
}

export default Stage3