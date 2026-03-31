import React, { useEffect, useMemo } from 'react'
import {
  Circle,
  LinearGradient,
  Path,
  Rect,
  Skia,
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

// ──────────────────────────────────────────────
// Deterministic hash — same seed = same value
// ──────────────────────────────────────────────
const H = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453123
  return x - Math.floor(x)
}

// ──────────────────────────────────────────────
// Bake grass blades into composite filled paths
// ──────────────────────────────────────────────
const bakeGrassLayer = (
  count: number,
  seed: number,
  hMin: number,
  hMax: number,
  baseY: number,
  w: number,
): { paths: ReturnType<typeof Skia.Path.Make>[]; colorIndices: number[] } => {
  const groups: Map<number, ReturnType<typeof Skia.Path.Make>> = new Map()
  const colorIndices: number[] = []

  for (let i = 0; i < count; i++) {
    const h = H(i + seed)
    const xf = (i + 0.3 + h * 0.4) / (count + 1)
    const ht = hMin + h * (hMax - hMin)
    const sw = 1.4 + H(i + seed + 50) * 1.5
    const cv = (H(i + seed + 100) - 0.5) * 0.38
    const ci = Math.floor(H(i + seed + 150) * 3)

    if (!groups.has(ci)) {
      groups.set(ci, Skia.Path.Make())
      colorIndices.push(ci)
    }

    const bx = xf * w
    const p = groups.get(ci)!
    const tipX = bx + cv * ht * 0.7
    const tipY = baseY - ht
    const midX = bx + cv * ht
    const midY = baseY - ht * 0.5
    const halfW = sw * 0.5

    p.moveTo(bx - halfW, baseY)
    p.quadTo(midX - halfW * 0.3, midY, tipX, tipY)
    p.quadTo(midX + halfW * 0.3, midY, bx + halfW, baseY)
    p.close()
  }

  return {
    paths: colorIndices.map(ci => groups.get(ci)!),
    colorIndices,
  }
}

// ──────────────────────────────────────────────
// Firefly — drifts slowly with glowing pulse
// ──────────────────────────────────────────────
function Firefly({ t, w, h, seed, groundY }: { t: any; w: number; h: number; seed: number; groundY: number }) {
  const FIREFLY = '#C8FF80'
  const baseX = w * (0.12 + seed * 0.22)
  const baseY = groundY - 30 - seed * 18
  const period = 8 + seed * 3.1

  const fx = useDerivedValue(() => {
    const p = (t.value / period) % 1
    return baseX + Math.sin(p * Math.PI * 2 + seed * 1.7) * (14 + seed * 8)
  })
  const fy = useDerivedValue(() => {
    const p = (t.value / period) % 1
    return baseY + Math.sin(p * Math.PI * 3.3 + seed * 2.1) * (10 + seed * 6)
  })
  const glowOp = useDerivedValue(() => {
    const p = (t.value / period) % 1
    return 0.55 + Math.sin(p * Math.PI * 4 + seed * 1.3) * 0.45
  })
  const glowR = useDerivedValue(() => 5 + Math.sin(t.value * 1.8 + seed * 2.4) * 2)

  return (
    <>
      <Circle cx={fx} cy={fy} r={glowR} color={FIREFLY} opacity={useDerivedValue(() => glowOp.value * 0.18)} />
      <Circle cx={fx} cy={fy} r={2.2} color={FIREFLY} opacity={glowOp} />
      <Circle cx={fx} cy={fy} r={1.2} color="#EEFFCC" opacity={useDerivedValue(() => glowOp.value * 0.9)} />
    </>
  )
}

// ──────────────────────────────────────────────
// Twinkling star
// ──────────────────────────────────────────────
function TwinkleStar({ cx, cy, r, delay }: { cx: number; cy: number; r: number; delay: number }) {
  const op = useSharedValue(0.4)
  useEffect(() => {
    op.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1.0, { duration: 900 + Math.floor(r * 300), easing: Easing.inOut(Easing.sin) }),
      withTiming(0.3, { duration: 700 + Math.floor(r * 200), easing: Easing.inOut(Easing.sin) }),
    ), -1, false))
  }, [])
  return <Circle cx={cx} cy={cy} r={r} color="#E8EEF8" opacity={op} />
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
// Night background uses its own fixed night palette — not from SceneColors.
// SceneColors is for plants only.
const GardenBackground = ({ width: w, height: h }: Props) => {
  const horizonY = h * 0.50
  const midY     = h * 0.65
  const groundY  = h * 0.82

  // Night sky palette
  const SKY_TOP      = '#010309'
  const SKY_MID      = '#040C1E'
  const SKY_HORIZON  = '#091628'
  const SKY_GLOW     = '#0D1F35'

  // Ground palette
  const GROUND_MID   = '#0D1A0D'
  const GROUND_DEEP  = '#08120A'
  const HILL_FAR     = '#081208'
  const HILL_MID_C   = '#0B180B'
  const HILL_NEAR    = '#0F1F10'

  // Grass palette
  const GRASS_1 = '#182818'
  const GRASS_2 = '#122012'
  const GRASS_3 = '#0F1B0F'
  const grassColors = [GRASS_1, GRASS_2, GRASS_3]

  // Moon
  const MOON_COLOR = '#F0EDE0'
  const MOON_HALO  = '#C8D8F0'

  const t = useSharedValue(0)
  useEffect(() => {
    t.value = withRepeat(
      withTiming(36000, { duration: 36000000, easing: Easing.linear }),
      -1,
      false,
    )
  }, [t])

  // Static stars (deterministic positions)
  const stars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      cx: H(i * 3 + 1) * w,
      cy: H(i * 3 + 2) * horizonY * 0.9,
      r:  0.8 + H(i * 3 + 3) * 1.6,
      twinkle: i < 10, // first 10 twinkle
      delay: Math.floor(H(i + 77) * 1400),
    }))
  }, [w, horizonY])

  const geo = useMemo(() => {
    const makeHill = (baseY: number, bumps: [number, number][]) => {
      const p = Skia.Path.Make()
      p.moveTo(0, baseY)
      let prevX = 0
      let prevY = baseY
      bumps.forEach(([bx, by], idx) => {
        p.cubicTo(prevX + (bx - prevX) * 0.4, prevY, prevX + (bx - prevX) * 0.7, by, bx, by)
        prevX = bx
        prevY = by
        if (idx === bumps.length - 1 && bx < w) {
          p.cubicTo(bx + (w - bx) * 0.3, by, bx + (w - bx) * 0.7, baseY, w, baseY)
        }
      })
      p.lineTo(w, h)
      p.lineTo(0, h)
      p.close()
      return p
    }

    const ground = Skia.Path.Make()
    ground.moveTo(0, groundY + 4)
    ground.cubicTo(w * 0.12, groundY - 5, w * 0.3, groundY + 5, w * 0.5, groundY - 3)
    ground.cubicTo(w * 0.7, groundY + 5, w * 0.88, groundY - 4, w, groundY + 3)
    ground.lineTo(w, h)
    ground.lineTo(0, h)
    ground.close()

    const fgGrass  = bakeGrassLayer(55, 0,   12, 28, groundY, w)
    const midGrass = bakeGrassLayer(28, 90,  8,  18, groundY - 8, w)
    const bgGrass  = bakeGrassLayer(16, 200, 5,  12, groundY + 8, w)

    return {
      farHill: makeHill(horizonY + 40, [
        [w * 0.2, horizonY + 10], [w * 0.45, horizonY + 28],
        [w * 0.7, horizonY + 8],  [w * 0.9, horizonY + 22],
      ]),
      skyHill: makeHill(horizonY + 28, [
        [w * 0.15, horizonY + 2],  [w * 0.35, horizonY + 18],
        [w * 0.55, horizonY - 6],  [w * 0.8,  horizonY + 14],
      ]),
      midHill: makeHill(midY - 4, [
        [w * 0.18, midY - 32], [w * 0.42, midY - 6],
        [w * 0.65, midY - 38], [w * 0.86, midY - 12],
      ]),
      frontRise: makeHill(groundY + 6, [
        [w * 0.16, groundY - 12], [w * 0.4,  groundY + 4],
        [w * 0.68, groundY - 8],  [w * 0.92, groundY + 4],
      ]),
      ground,
      fgGrass,
      midGrass,
      bgGrass,
    }
  }, [w, h, groundY, horizonY, midY])

  const moonX = w * 0.76
  const moonY = h * 0.17

  return (
    <>
      {/* Night sky gradient */}
      <Rect x={0} y={0} width={w} height={h}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, horizonY + 30)}
          colors={[SKY_TOP, SKY_MID, SKY_HORIZON, SKY_GLOW]}
          positions={[0, 0.45, 0.82, 1]}
        />
      </Rect>
      {/* Fill below horizon */}
      <Rect x={0} y={horizonY + 30} width={w} height={h - horizonY - 30} color={GROUND_DEEP} />

      {/* Moon halo rings */}
      <Circle cx={moonX} cy={moonY} r={52} color={MOON_HALO} opacity={0.04} />
      <Circle cx={moonX} cy={moonY} r={38} color={MOON_HALO} opacity={0.07} />
      <Circle cx={moonX} cy={moonY} r={26} color={MOON_HALO} opacity={0.12} />
      {/* Moon body */}
      <Circle cx={moonX} cy={moonY} r={18} color={MOON_COLOR} opacity={0.95} />
      {/* Moon surface shading */}
      <Circle cx={moonX - 4} cy={moonY - 3} r={5} color="#D8D4C8" opacity={0.35} />
      <Circle cx={moonX + 5} cy={moonY + 4} r={3} color="#D0CCC0" opacity={0.25} />
      <Circle cx={moonX + 3} cy={moonY - 6} r={2} color="#D8D4C8" opacity={0.20} />
      {/* Moon glow cast on horizon */}
      <Circle cx={moonX} cy={horizonY} r={w * 0.28} color={MOON_HALO} opacity={0.04} />

      {/* Static dim stars */}
      {stars.filter(s => !s.twinkle).map((s, i) => (
        <Circle key={`st${i}`} cx={s.cx} cy={s.cy} r={s.r} color="#E8EEF8" opacity={0.55} />
      ))}

      {/* Twinkling stars */}
      {stars.filter(s => s.twinkle).map((s, i) => (
        <TwinkleStar key={`tw${i}`} cx={s.cx} cy={s.cy} r={s.r} delay={s.delay} />
      ))}

      {/* Hill silhouettes — darkest to farthest */}
      <Path path={geo.farHill}  color={HILL_FAR}  style="fill" />
      <Path path={geo.skyHill}  color={HILL_MID_C} style="fill" />
      <Path path={geo.midHill}  color={HILL_NEAR}  style="fill" />
      <Path path={geo.frontRise} color={GROUND_MID} opacity={0.6} style="fill" />

      {/* Ground */}
      <Path path={geo.ground} style="fill" color={GROUND_MID} />
      <Rect x={0} y={groundY} width={w} height={h - groundY}>
        <LinearGradient start={vec(0, groundY)} end={vec(0, h)} colors={[GROUND_MID, GROUND_DEEP]} />
      </Rect>

      {/* Moonlight rim on ground */}
      <Rect x={0} y={groundY - 2} width={w} height={18}>
        <LinearGradient
          start={vec(0, groundY - 2)}
          end={vec(0, groundY + 16)}
          colors={[`${MOON_HALO}14`, `${MOON_HALO}00`]}
        />
      </Rect>

      {/* Background grass */}
      {geo.bgGrass.paths.map((p, i) => (
        <Path key={`bgl${i}`} path={p} color={grassColors[(geo.bgGrass.colorIndices[i] + 2) % grassColors.length]} style="fill" opacity={0.55} />
      ))}

      {/* Mid grass */}
      {geo.midGrass.paths.map((p, i) => (
        <Path key={`mgl${i}`} path={p} color={grassColors[(geo.midGrass.colorIndices[i] + 1) % grassColors.length]} style="fill" opacity={0.75} />
      ))}

      {/* Foreground grass */}
      {geo.fgGrass.paths.map((p, i) => (
        <Path key={`fgl${i}`} path={p} color={grassColors[geo.fgGrass.colorIndices[i]]} style="fill" />
      ))}

      {/* Fireflies — 4 staggered drifters */}
      <Firefly t={t} w={w} h={h} groundY={groundY} seed={0} />
      <Firefly t={t} w={w} h={h} groundY={groundY} seed={1} />
      <Firefly t={t} w={w} h={h} groundY={groundY} seed={2} />
      <Firefly t={t} w={w} h={h} groundY={groundY} seed={3} />

      {/* Bottom vignette */}
      <Rect x={0} y={h - h * 0.10} width={w} height={h * 0.10}>
        <LinearGradient
          start={vec(0, h - h * 0.10)}
          end={vec(0, h)}
          colors={[`${GROUND_DEEP}00`, `${GROUND_DEEP}60`]}
        />
      </Rect>
    </>
  )
}

export default GardenBackground
