import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Crystal — Stage 2: Larger gem, more facets, slight inner glow.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const GEM       = '#B0D0F0'
  const GEM_DARK  = '#7098C0'
  const GEM_LIGHT = '#E4F4FF'

  const cy = y - 26
  const r  = 16

  const hex = Skia.Path.Make()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const px = x + r * Math.cos(angle)
    const py = cy + r * Math.sin(angle)
    if (i === 0) hex.moveTo(px, py)
    else hex.lineTo(px, py)
  }
  hex.close()

  const facetTop = Skia.Path.Make()
  facetTop.moveTo(x, cy)
  facetTop.lineTo(x + r * Math.cos(-Math.PI / 6), cy + r * Math.sin(-Math.PI / 6))
  facetTop.lineTo(x + r * Math.cos(-Math.PI / 2), cy + r * Math.sin(-Math.PI / 2))
  facetTop.lineTo(x + r * Math.cos(-5 * Math.PI / 6), cy + r * Math.sin(-5 * Math.PI / 6))
  facetTop.close()

  const facetRight = Skia.Path.Make()
  facetRight.moveTo(x, cy)
  facetRight.lineTo(x + r * Math.cos(-Math.PI / 6), cy + r * Math.sin(-Math.PI / 6))
  facetRight.lineTo(x + r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6))
  facetRight.close()

  const facetLeft = Skia.Path.Make()
  facetLeft.moveTo(x, cy)
  facetLeft.lineTo(x + r * Math.cos(-5 * Math.PI / 6), cy + r * Math.sin(-5 * Math.PI / 6))
  facetLeft.lineTo(x + r * Math.cos(5 * Math.PI / 6), cy + r * Math.sin(5 * Math.PI / 6))
  facetLeft.close()

  return (
    <>
      {/* Inner glow */}
      <Circle cx={x} cy={cy} r={r - 2} color={colors.bloom} opacity={0.15} />
      <Path path={hex}        color={GEM}       style="fill" />
      <Path path={facetTop}   color={GEM_LIGHT} style="fill" opacity={0.55} />
      <Path path={facetRight} color={GEM_DARK}  style="fill" opacity={0.45} />
      <Path path={facetLeft}  color={GEM_DARK}  style="fill" opacity={0.25} />
      {/* Inner light center */}
      <Circle cx={x} cy={cy} r={4} color={GEM_LIGHT} opacity={0.6} />
    </>
  )
}

export default Stage2
