import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Mushroom — Stage 2: Small stem, dome cap, two faintly glowing spots.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const stemH = 18

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 4, y)
  stemPath.lineTo(x - 3, y - stemH)
  stemPath.lineTo(x + 3, y - stemH)
  stemPath.lineTo(x + 4, y)
  stemPath.close()

  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 15, y - stemH + 2)
  capPath.quadTo(x - 13, y - stemH - 22, x, y - stemH - 26)
  capPath.quadTo(x + 13, y - stemH - 22, x + 15, y - stemH + 2)
  capPath.close()

  const gillPath = Skia.Path.Make()
  gillPath.moveTo(x - 15, y - stemH + 2)
  gillPath.quadTo(x, y - stemH + 8, x + 15, y - stemH + 2)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color="#1A2820" style="fill" />
      <Circle cx={x} cy={y - stemH} r={4} color="#1F3028" opacity={0.8} />
      <Path path={capPath} color="#0D2A1E" style="fill" />
      <Path path={gillPath} color="#0A1E14" style="stroke" strokeWidth={1.5} opacity={0.6} />
      {/* Two glowing spots */}
      <Circle cx={x - 3} cy={y - stemH - 18} r={2.5} color="#7DFFC8" opacity={0.72} />
      <Circle cx={x + 5} cy={y - stemH - 12} r={1.8} color="#7DFFC8" opacity={0.6} />
    </>
  )
}

export default Stage2
