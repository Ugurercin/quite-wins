import React, { useEffect, useMemo } from 'react'
import {
  Circle,
  Path,
  Rect,
  Skia,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia'
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props {
  width: number
  height: number
  colors: SceneColors
}

// Deterministic hash
const H = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453123
  return x - Math.floor(x)
}

// ──────────────────────────────────────────────
// Twinkling star
// ──────────────────────────────────────────────
function TwinkleStar({ cx, cy, r, delay, minOp, maxOp, dur }: {
  cx: number; cy: number; r: number; delay: number
  minOp: number; maxOp: number; dur: number
}) {
  const op = useSharedValue(minOp)
  useEffect(() => {
    op.value = withDelay(delay, withRepeat(withSequence(
      withTiming(maxOp, { duration: dur, easing: Easing.inOut(Easing.sin) }),
      withTiming(minOp, { duration: dur * 0.8, easing: Easing.inOut(Easing.sin) }),
    ), -1, false))
  }, [])
  return <Circle cx={cx} cy={cy} r={r} color="#FFF8E8" opacity={op} />
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
// Space background uses its own fixed deep-space palette — not from SceneColors.
const GardenBackground = ({ width: w, height: h, colors }: Props) => {
  const groundY   = h * 0.84
  const asteroidY = groundY

  const SPACE_TOP  = '#05060F'
  const SPACE_MID  = '#080920'
  const NEBULA_P   = '#8040C0'
  const NEBULA_T   = '#20A0A0'
  const ASTEROID   = '#1A1424'
  const ROCK_MID   = '#241A30'
  const ROCK_LIGHT = '#2E2238'

  // Deterministic stars — 50 total, 8 will twinkle
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    cx: H(i * 4 + 1) * w,
    cy: H(i * 4 + 2) * (groundY * 0.95),
    r:  0.5 + H(i * 4 + 3) * 1.5,
    twinkle: i < 8,
    delay: Math.floor(H(i + 11) * 2200),
    minOp: 0.2 + H(i + 50) * 0.3,
    maxOp: 0.7 + H(i + 60) * 0.3,
    dur:   1800 + Math.floor(H(i + 70) * 2000),
  })), [w, groundY])

  // Asteroid geo — baked shapes
  const geo = useMemo(() => {
    // Rocky asteroid strip ground
    const groundPath = Skia.Path.Make()
    groundPath.moveTo(0, asteroidY)
    groundPath.cubicTo(w * 0.1, asteroidY - 12, w * 0.25, asteroidY - 6, w * 0.4, asteroidY - 14)
    groundPath.cubicTo(w * 0.55, asteroidY - 22, w * 0.68, asteroidY - 8, w * 0.82, asteroidY - 18)
    groundPath.cubicTo(w * 0.92, asteroidY - 24, w, asteroidY - 10, w, asteroidY)
    groundPath.lineTo(w, h)
    groundPath.lineTo(0, h)
    groundPath.close()

    // Floating asteroid rocks (foreground)
    const makeRock = (cx: number, cy: number, rx: number, ry: number) => {
      const p = Skia.Path.Make()
      p.moveTo(cx - rx, cy)
      p.cubicTo(cx - rx, cy - ry * 0.8, cx - rx * 0.3, cy - ry, cx, cy - ry)
      p.cubicTo(cx + rx * 0.4, cy - ry, cx + rx, cy - ry * 0.6, cx + rx, cy)
      p.cubicTo(cx + rx, cy + ry * 0.5, cx + rx * 0.2, cy + ry * 0.8, cx, cy + ry * 0.7)
      p.cubicTo(cx - rx * 0.5, cy + ry * 0.8, cx - rx, cy + ry * 0.4, cx - rx, cy)
      p.close()
      return p
    }

    // Galaxy spiral hint top-right — a few faint arcs
    const spiral1 = Skia.Path.Make()
    spiral1.moveTo(w * 0.72, h * 0.06)
    spiral1.cubicTo(w * 0.82, h * 0.04, w * 0.94, h * 0.1, w * 0.96, h * 0.18)
    spiral1.cubicTo(w * 0.98, h * 0.26, w * 0.9, h * 0.3, w * 0.82, h * 0.28)

    const spiral2 = Skia.Path.Make()
    spiral2.moveTo(w * 0.78, h * 0.10)
    spiral2.cubicTo(w * 0.86, h * 0.08, w * 0.96, h * 0.14, w * 0.97, h * 0.20)

    return {
      groundPath,
      rock1: makeRock(w * 0.08, asteroidY - 8,  14, 9),
      rock2: makeRock(w * 0.32, asteroidY - 12, 18, 11),
      rock3: makeRock(w * 0.58, asteroidY - 6,  12, 8),
      rock4: makeRock(w * 0.76, asteroidY - 14, 20, 13),
      rock5: makeRock(w * 0.92, asteroidY - 8,  10, 7),
      spiral1,
      spiral2,
    }
  }, [w, h, asteroidY])

  void colors

  return (
    <>
      {/* Deep space background */}
      <Rect x={0} y={0} width={w} height={h}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, groundY)}
          colors={[SPACE_TOP, SPACE_MID, '#0D0E2A']}
          positions={[0, 0.6, 1]}
        />
      </Rect>

      {/* Nebula patches */}
      <Circle cx={w * 0.22} cy={h * 0.30} r={90} color={NEBULA_P} opacity={0.06} />
      <Circle cx={w * 0.22} cy={h * 0.30} r={55} color={NEBULA_P} opacity={0.04} />
      <Circle cx={w * 0.72} cy={h * 0.55} r={80} color={NEBULA_T} opacity={0.05} />
      <Circle cx={w * 0.72} cy={h * 0.55} r={48} color={NEBULA_T} opacity={0.04} />
      <Circle cx={w * 0.50} cy={h * 0.18} r={70} color={NEBULA_P} opacity={0.04} />

      {/* Galaxy spiral suggestion top-right */}
      <Path path={geo.spiral1} color="#C0A0FF" style="stroke" strokeWidth={1.5} opacity={0.06} />
      <Path path={geo.spiral2} color="#C0A0FF" style="stroke" strokeWidth={1}   opacity={0.04} />

      {/* Static stars */}
      {stars.filter(s => !s.twinkle).map((s, i) => (
        <Circle key={`st${i}`} cx={s.cx} cy={s.cy} r={s.r} color="#FFF8E8" opacity={s.minOp + 0.2} />
      ))}

      {/* Twinkling stars — staggered, never all in sync */}
      {stars.filter(s => s.twinkle).map((s, i) => (
        <TwinkleStar
          key={`tw${i}`}
          cx={s.cx} cy={s.cy} r={s.r}
          delay={s.delay} minOp={s.minOp} maxOp={s.maxOp} dur={s.dur}
        />
      ))}

      {/* Asteroid strip ground */}
      <Path path={geo.groundPath} color={ASTEROID} style="fill" />
      <Rect x={0} y={asteroidY} width={w} height={h - asteroidY}>
        <LinearGradient start={vec(0, asteroidY)} end={vec(0, h)} colors={[ASTEROID, '#0F0C1A']} />
      </Rect>

      {/* Rocky surface detail */}
      <Path path={geo.rock1} color={ROCK_MID}   style="fill" opacity={0.8} />
      <Path path={geo.rock2} color={ROCK_LIGHT} style="fill" opacity={0.75} />
      <Path path={geo.rock3} color={ROCK_MID}   style="fill" opacity={0.7} />
      <Path path={geo.rock4} color={ROCK_LIGHT} style="fill" opacity={0.8} />
      <Path path={geo.rock5} color={ROCK_MID}   style="fill" opacity={0.65} />

      {/* Surface crater dots */}
      <Circle cx={w * 0.15} cy={asteroidY + 6} r={4}   color="#100D18" opacity={0.7} />
      <Circle cx={w * 0.45} cy={asteroidY + 8} r={5.5} color="#100D18" opacity={0.65} />
      <Circle cx={w * 0.65} cy={asteroidY + 5} r={3}   color="#100D18" opacity={0.6} />
      <Circle cx={w * 0.85} cy={asteroidY + 7} r={4.5} color="#100D18" opacity={0.7} />

      {/* Bottom vignette */}
      <Rect x={0} y={h - h * 0.08} width={w} height={h * 0.08}>
        <LinearGradient
          start={vec(0, h - h * 0.08)}
          end={vec(0, h)}
          colors={['#0F0C1A00', '#0F0C1A80']}
        />
      </Rect>
    </>
  )
}

export default GardenBackground
