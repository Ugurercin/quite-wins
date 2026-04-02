import React from 'react'
import { Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Crystal — Stage 1: Tiny faceted hexagonal gem, cold blue-white.
const Stage1 = ({ x, y }: StageProps) => {
  const GEM       = '#A0C0E0'
  const GEM_DARK  = '#6090B0'
  const GEM_LIGHT = '#D8EEFF'

  const cy = y - 14
  const r  = 9

  // Hexagon gem
  const hex = Skia.Path.Make()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const px = x + r * Math.cos(angle)
    const py = cy + r * Math.sin(angle)
    if (i === 0) hex.moveTo(px, py)
    else hex.lineTo(px, py)
  }
  hex.close()

  // Upper facet
  const facetTop = Skia.Path.Make()
  facetTop.moveTo(x, cy)
  facetTop.lineTo(x + r * Math.cos(-Math.PI / 6), cy + r * Math.sin(-Math.PI / 6))
  facetTop.lineTo(x + r * Math.cos(-Math.PI / 2), cy + r * Math.sin(-Math.PI / 2))
  facetTop.lineTo(x + r * Math.cos(-5 * Math.PI / 6), cy + r * Math.sin(-5 * Math.PI / 6))
  facetTop.close()

  // Lower-right facet
  const facetRight = Skia.Path.Make()
  facetRight.moveTo(x, cy)
  facetRight.lineTo(x + r * Math.cos(-Math.PI / 6), cy + r * Math.sin(-Math.PI / 6))
  facetRight.lineTo(x + r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6))
  facetRight.close()

  return (
    <>
      <Path path={hex}       color={GEM}       style="fill" />
      <Path path={facetTop}  color={GEM_LIGHT} style="fill" opacity={0.55} />
      <Path path={facetRight} color={GEM_DARK} style="fill" opacity={0.45} />
    </>
  )
}

export default Stage1
