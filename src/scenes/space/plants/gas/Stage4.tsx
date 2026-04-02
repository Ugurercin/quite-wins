import React, { useEffect } from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

// Gas — Stage 4: Massive banded sphere, prominent rings, animated storm rotation.
const Stage4 = ({ x, y, colors }: StageProps) => {
  const BODY   = '#B07840'
  const BAND1  = '#D09850'
  const BAND2  = '#906030'
  const RING   = '#D4B870'
  const STORM  = '#E8D090'

  const cy = y - 56

  const stormAngle = useSharedValue(0)
  useEffect(() => {
    stormAngle.value = withDelay(300, withRepeat(
      withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
      -1, false
    ))
  }, [])

  const stormX  = useDerivedValue(() => x + Math.cos(stormAngle.value) * 14)
  const stormY  = useDerivedValue(() => cy + Math.sin(stormAngle.value) * 6)
  const ringOp  = useDerivedValue(() => 0)
  const ringOpB = useSharedValue(0)
  const ringOpF = useSharedValue(0)
  useEffect(() => {
    ringOpB.value = withDelay(100, withTiming(0.38, { duration: 1200 }))
    ringOpF.value = withDelay(100, withTiming(0.78, { duration: 1200 }))
  }, [])

  const ringBackPath = Skia.Path.Make()
  ringBackPath.addOval(Skia.XYWHRect(x - 50, cy - 12, 100, 24))

  const ringFrontPath = Skia.Path.Make()
  ringFrontPath.moveTo(x - 50, cy)
  ringFrontPath.cubicTo(x - 50, cy + 12, x + 50, cy + 12, x + 50, cy)

  const band1Path = Skia.Path.Make()
  band1Path.moveTo(x - 33, cy - 8)
  band1Path.cubicTo(x - 14, cy - 2, x + 14, cy - 18, x + 33, cy - 8)
  band1Path.lineTo(x + 33, cy + 2)
  band1Path.cubicTo(x + 14, cy + 8, x - 14, cy - 8, x - 33, cy + 2)
  band1Path.close()

  const band2Path = Skia.Path.Make()
  band2Path.moveTo(x - 32, cy + 10)
  band2Path.cubicTo(x - 12, cy + 18, x + 12, cy + 6, x + 32, cy + 10)
  band2Path.lineTo(x + 32, cy + 20)
  band2Path.cubicTo(x + 12, cy + 14, x - 12, cy + 26, x - 32, cy + 20)
  band2Path.close()

  void ringOp

  return (
    <>
      <Path path={ringBackPath} color={RING} style="stroke" strokeWidth={6} opacity={ringOpB} />
      <Circle cx={x} cy={cy} r={34} color={BODY} />
      <Path path={band1Path} color={BAND1} style="fill" opacity={0.6} />
      <Path path={band2Path} color={BAND2} style="fill" opacity={0.5} />
      <Circle cx={stormX} cy={stormY} r={7}   color={STORM} opacity={0.85} />
      <Circle cx={stormX} cy={stormY} r={4.5} color="#FFF8E0" opacity={0.55} />
      <Circle cx={x} cy={cy} r={36} color={BAND1} opacity={0.1} />
      <Path path={ringFrontPath} color={RING} style="stroke" strokeWidth={6} strokeCap="round" opacity={ringOpF} />
      <Circle cx={x} cy={cy} r={useDerivedValue(() => 14 + ringOpF.value * 6)} color={colors.bloom} opacity={useDerivedValue(() => ringOpF.value * 0.18)} />
    </>
  )
}

export default Stage4
