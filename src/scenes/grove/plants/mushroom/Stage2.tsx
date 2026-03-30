import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Mushroom — Stage 2: Small stem with a round cap starting to form.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const stemH = 20

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  // Stem — short and stubby
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 5, y)
  stemPath.lineTo(x - 4, y - stemH)
  stemPath.lineTo(x + 4, y - stemH)
  stemPath.lineTo(x + 5, y)
  stemPath.close()

  // Cap — dome shape
  const capPath = Skia.Path.Make()
  capPath.moveTo(x - 16, y - stemH + 2)
  capPath.quadTo(x - 14, y - stemH - 22, x, y - stemH - 26)
  capPath.quadTo(x + 14, y - stemH - 22, x + 16, y - stemH + 2)
  capPath.close()

  // Gills underside
  const gillPath = Skia.Path.Make()
  gillPath.moveTo(x - 16, y - stemH + 2)
  gillPath.quadTo(x, y - stemH + 8, x + 16, y - stemH + 2)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={stemPath} color="#D4C8A8" style="fill" />
      {/* Veil skirt */}
      <Circle cx={x} cy={y - stemH} r={5} color="#E8DEBA" opacity={0.8} />
      <Path path={capPath} color="#C43D22" style="fill" />
      <Path path={gillPath} color="#B8907A" style="stroke" strokeWidth={1.5} opacity={0.6} />
      {/* First spot */}
      <Circle cx={x} cy={y - stemH - 18} r={3} color="#FFFFFF" opacity={0.7} />
      {/* Cap highlight */}
      <Circle cx={x - 3} cy={y - stemH - 20} r={2} color="#E86040" opacity={0.4} />
    </>
  )
}

export default Stage2