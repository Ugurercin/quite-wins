import React from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Terrestrial — Stage 1: Small irregular grey asteroid, crater dots.
const Stage1 = ({ x, y }: StageProps) => {
  const ROCK   = '#707080'
  const SHADOW = '#50505E'
  const CRATER = '#3A3A48'

  const rockPath = Skia.Path.Make()
  rockPath.moveTo(x - 10, y - 4)
  rockPath.cubicTo(x - 12, y - 10, x - 8, y - 18, x - 2, y - 18)
  rockPath.cubicTo(x + 6, y - 18, x + 11, y - 12, x + 10, y - 5)
  rockPath.cubicTo(x + 9, y + 1, x + 4, y + 2, x - 2, y + 2)
  rockPath.cubicTo(x - 8, y + 2, x - 10, y, x - 10, y - 4)
  rockPath.close()

  const shadowPath = Skia.Path.Make()
  shadowPath.moveTo(x + 2, y - 5)
  shadowPath.cubicTo(x + 6, y - 5, x + 10, y - 8, x + 10, y - 5)
  shadowPath.cubicTo(x + 9, y + 1, x + 4, y + 2, x - 2, y + 2)
  shadowPath.cubicTo(x + 0, y, x + 1, y - 3, x + 2, y - 5)
  shadowPath.close()

  return (
    <>
      <Path path={rockPath} color={ROCK} style="fill" />
      <Path path={shadowPath} color={SHADOW} style="fill" opacity={0.6} />
      <Circle cx={x - 4} cy={y - 12} r={2.5} color={CRATER} />
      <Circle cx={x - 4} cy={y - 12} r={1}   color={SHADOW} opacity={0.4} />
      <Circle cx={x + 3} cy={y - 7}  r={1.8} color={CRATER} />
      <Circle cx={x - 1} cy={y - 3}  r={1.2} color={CRATER} opacity={0.7} />
    </>
  )
}

export default Stage1
