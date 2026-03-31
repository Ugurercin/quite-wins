import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Night Cactus — Stage 2: Barrel body, moonlit silver-blue spines all over.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const SPINE = '#C0C8E0'
  const RIDGE = colors.sprout

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 10, y - 2)
  bodyPath.cubicTo(x - 12, y - 20, x - 12, y - 36, x - 8, y - 42)
  bodyPath.cubicTo(x - 4, y - 46, x + 4, y - 46, x + 8, y - 42)
  bodyPath.cubicTo(x + 12, y - 36, x + 12, y - 20, x + 10, y - 2)
  bodyPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={bodyPath} color={colors.bodyMid} style="fill" />
      <Path path={bodyPath} color={colors.bodyLight} style="fill" opacity={0.08} />

      <Line p1={vec(x, y - 2)} p2={vec(x, y - 44)} color={RIDGE} strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 5, y - 42)} color={RIDGE} strokeWidth={0.8} opacity={0.4} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 5, y - 42)} color={RIDGE} strokeWidth={0.8} opacity={0.4} />

      {[-36, -28, -20, -12].map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 11, y + yOff)} p2={vec(x - 17, y + yOff - 3)} color={SPINE} strokeWidth={1.2} />
          <Line p1={vec(x + 11, y + yOff)} p2={vec(x + 17, y + yOff - 3)} color={SPINE} strokeWidth={1.2} />
          <Line p1={vec(x - 5, y + yOff - 4)} p2={vec(x - 9, y + yOff - 8)} color={SPINE} strokeWidth={0.9} opacity={0.7} />
          <Line p1={vec(x + 5, y + yOff - 4)} p2={vec(x + 9, y + yOff - 8)} color={SPINE} strokeWidth={0.9} opacity={0.7} />
        </React.Fragment>
      ))}
      <Line p1={vec(x, y - 44)} p2={vec(x, y - 51)} color={SPINE} strokeWidth={1.5} />
      <Line p1={vec(x, y - 44)} p2={vec(x - 4, y - 50)} color={SPINE} strokeWidth={1.2} />
      <Line p1={vec(x, y - 44)} p2={vec(x + 4, y - 50)} color={SPINE} strokeWidth={1.2} />
    </>
  )
}

export default Stage2
