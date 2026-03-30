import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Cactus — Stage 2: Small barrel cactus with ridges and more spines.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 12, y)
  moundPath.quadTo(x, y - 6, x + 12, y)

  // Barrel body
  const bodyPath = Skia.Path.Make()
  bodyPath.moveTo(x - 10, y - 2)
  bodyPath.cubicTo(x - 12, y - 20, x - 12, y - 36, x - 8, y - 42)
  bodyPath.cubicTo(x - 4, y - 46, x + 4, y - 46, x + 8, y - 42)
  bodyPath.cubicTo(x + 12, y - 36, x + 12, y - 20, x + 10, y - 2)
  bodyPath.close()

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={bodyPath} color="#4A8A3A" style="fill" />
      {/* Highlight side */}
      <Path path={bodyPath} color="#5AAA44" style="fill" opacity={0.4} />

      {/* Vertical ridges */}
      <Line p1={vec(x, y - 2)} p2={vec(x, y - 44)} color="#3A7A2A" strokeWidth={1.2} opacity={0.6} />
      <Line p1={vec(x - 5, y - 3)} p2={vec(x - 5, y - 42)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />
      <Line p1={vec(x + 5, y - 3)} p2={vec(x + 5, y - 42)} color="#3A7A2A" strokeWidth={1} opacity={0.5} />

      {/* Spines — pairs along ridges */}
      {[-36, -28, -20, -12].map((yOff, i) => (
        <React.Fragment key={i}>
          <Line p1={vec(x - 11, y + yOff)} p2={vec(x - 16, y + yOff - 3)} color="#D4C8A8" strokeWidth={1.2} />
          <Line p1={vec(x + 11, y + yOff)} p2={vec(x + 16, y + yOff - 3)} color="#D4C8A8" strokeWidth={1.2} />
          <Line p1={vec(x - 5, y + yOff - 4)} p2={vec(x - 9, y + yOff - 8)} color="#D4C8A8" strokeWidth={1} opacity={0.7} />
          <Line p1={vec(x + 5, y + yOff - 4)} p2={vec(x + 9, y + yOff - 8)} color="#D4C8A8" strokeWidth={1} opacity={0.7} />
        </React.Fragment>
      ))}
      {/* Top spine cluster */}
      <Line p1={vec(x, y - 44)} p2={vec(x, y - 50)} color="#D4C8A8" strokeWidth={1.5} />
      <Line p1={vec(x, y - 44)} p2={vec(x - 4, y - 49)} color="#D4C8A8" strokeWidth={1.2} />
      <Line p1={vec(x, y - 44)} p2={vec(x + 4, y - 49)} color="#D4C8A8" strokeWidth={1.2} />
    </>
  )
}

export default Stage2