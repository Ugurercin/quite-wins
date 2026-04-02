import React, { useEffect } from 'react'
import { Circle, Group, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props { x: number; y: number; colors: SceneColors }

// Space Elder Crystal — large crystal sphere, intense inner light, rotating beams, crystal shard rings, strongest glow.
const ElderCrystal = ({ x, y, colors }: Props) => {
  const BODY   = '#C8E0FF'
  const INNER  = '#EEF8FF'
  const SHARD  = '#A0C8F0'

  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.22)
  const ray   = useSharedValue(0)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.06, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.95, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.70, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.22, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
    ray.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 8000, easing: Easing.linear }),
      -1, false
    )
  }, [])

  const transform    = useDerivedValue(() => [{ scale: scale.value }])
  const glowOp       = useDerivedValue(() => glow.value)
  const glowR        = useDerivedValue(() => 52 + glow.value * 18)
  const innerOp      = useDerivedValue(() => 0.4 + glow.value * 0.4)
  const rayTransform = useDerivedValue(() => [{ rotate: ray.value }])
  const rayLen       = useDerivedValue(() => 38 + glow.value * 14)

  const cy = y - 72

  // Crystal shard ring
  const shardAngles = [0, 40, 80, 125, 170, 210, 255, 300, 340]
  const shardPath = Skia.Path.Make()
  shardAngles.forEach(deg => {
    const a = (deg * Math.PI) / 180
    const r1 = 50, r2 = 60
    const ax = x + r1 * Math.cos(a)
    const ay = cy + r1 * Math.sin(a)
    const bx = x + r2 * Math.cos(a - 0.12)
    const by = cy + r2 * Math.sin(a - 0.12)
    const cx2 = x + r2 * Math.cos(a + 0.12)
    const cy2 = cy + r2 * Math.sin(a + 0.12)
    shardPath.moveTo(ax, ay)
    shardPath.lineTo(bx, by)
    shardPath.lineTo(cx2, cy2)
    shardPath.close()
  })

  const RAY = '#D8EEFF'

  return (
    <Group transform={transform} origin={vec(x, y)}>
      {/* Outer glow — strongest of all three elders */}
      <Circle cx={x} cy={cy} r={glowR} color={colors.bloom} opacity={glowOp} />
      <Circle cx={x} cy={cy} r={useDerivedValue(() => 42 + glow.value * 10)} color="#A0D0FF" opacity={useDerivedValue(() => glow.value * 0.2)} />

      {/* Rotating light beams */}
      <Group transform={rayTransform} origin={vec(x, cy)}>
        <Line p1={vec(x, cy)} p2={vec(x, useDerivedValue(() => cy - rayLen.value))} color={RAY} strokeWidth={2} opacity={useDerivedValue(() => glow.value * 0.8)} />
        <Line p1={vec(x, cy)} p2={vec(x, useDerivedValue(() => cy + rayLen.value))} color={RAY} strokeWidth={2} opacity={useDerivedValue(() => glow.value * 0.5)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x + rayLen.value, cy))} color={RAY} strokeWidth={2} opacity={useDerivedValue(() => glow.value * 0.7)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x - rayLen.value, cy))} color={RAY} strokeWidth={2} opacity={useDerivedValue(() => glow.value * 0.45)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x + rayLen.value * 0.7, cy - rayLen.value * 0.7))} color={RAY} strokeWidth={1.5} opacity={useDerivedValue(() => glow.value * 0.35)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x - rayLen.value * 0.7, cy + rayLen.value * 0.7))} color={RAY} strokeWidth={1.5} opacity={useDerivedValue(() => glow.value * 0.3)} />
      </Group>

      {/* Crystal shard ring */}
      <Path path={shardPath} color={SHARD} style="fill" opacity={useDerivedValue(() => 0.5 + glow.value * 0.3)} />

      {/* Planet body */}
      <Circle cx={x} cy={cy} r={44} color={BODY} />
      <Circle cx={x} cy={cy} r={28} color={INNER} opacity={innerOp} />
      <Circle cx={x} cy={cy} r={14} color="#FFFFFF" opacity={useDerivedValue(() => 0.5 + glow.value * 0.35)} />
      {/* Facet highlight */}
      <Circle cx={x - 14} cy={cy - 20} r={8} color="#FFFFFF" opacity={0.25} />
    </Group>
  )
}

export default ElderCrystal
