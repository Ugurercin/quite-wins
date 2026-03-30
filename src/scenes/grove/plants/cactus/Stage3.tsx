import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Cactus — Stage 3: Taller column, first arm stub appearing on the right.
const Stage3 = ({ x, y, colors }: StageProps) => {
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 14, y)
  moundPath.quadTo(x, y - 7, x + 14, y)

  // Main column — taller
  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 10, y - 2)
  bodyPath.cubicTo(x - 12, y - 28, x - 12, y - 52, x - 8, y - 60)
  bodyPath.cubicTo(x - 4, y - 64, x + 4, y - 64, x + 8, y - 60)
  bodyPath.cubicTo(x + 12, y - 52, x + 12, y - 28, x + 10, y - 2)
  bodyPath.close()

  // Right arm stub — short, points up-right
  const armPath = Skia.Path.Make()
  armPath.moveTo(x + 10, y - 34)
  armPath.cubicTo(x + 18, y - 34, x + 26, y - 30, x + 28, y - 22)
  armPath.cubicTo(x + 30, y - 16, x + 26, y - 12, x + 22, y - 14)
  armPath.cubicTo(x + 18, y - 16, x + 16, y - 22, x + 10, y - 26)
  armPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={armPath} color="#4A8A3A" style="fill" />
      {/* Arm ridge */}
      <Line p1={vec(x + 19, y - 24)} p2={vec(x + 25, y - 18)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />
      {/* Arm spines */}
      <Line p1={vec(x + 28, y - 22)} p2={vec(x + 33, y - 24)} color="#D4C8A8" strokeWidth={1.2} />
      <Line p1={vec(x + 27, y - 16)} p2={vec(x + 32, y - 14)} color="#D4C8A8" strokeWidth={1} />

      <Path path={bodyPath} color="#4A8A3A" style="fill" />
      {/* Ridges */}
      <Line p1={vec(x, y - 2)} p2={vec(x, y - 62)} color="#3A7A2A" strokeWidth={1.2} opacity={0.6} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 5, y - 58)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 5, y - 58)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />
      {/* Spines */}
      {[-52, -42, -32, -22, -12].map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 11, y + yOff)} p2={vec(x - 16, y + yOff - 3)} color="#D4C8A8" strokeWidth={1.2} />
          <Line p1={vec(x + 11, y + yOff)} p2={vec(x + 16, y + yOff - 3)} color="#D4C8A8" strokeWidth={1.2} />
        </React.Fragment>
      ))}
      {/* Top spines */}
      <Line p1={vec(x, y - 63)} p2={vec(x, y - 70)} color="#D4C8A8" strokeWidth={1.5} />
      <Line p1={vec(x - 3, y - 63)} p2={vec(x - 6, y - 69)} color="#D4C8A8" strokeWidth={1.2} />
      <Line p1={vec(x + 3, y - 63)} p2={vec(x + 6, y - 69)} color="#D4C8A8" strokeWidth={1.2} />
    </>
  )
}

export default Stage3