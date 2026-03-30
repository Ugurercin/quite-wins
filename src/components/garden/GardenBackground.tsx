import React, { useEffect, useMemo } from 'react'
import {
  Circle,
  LinearGradient,
  Path,
  Rect,
  RoundedRect,
  Skia,
  vec,
} from '@shopify/react-native-skia'
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { Theme } from '@/theme/theme'

interface Props {
  width: number
  height: number
  theme: Theme
}

// ──────────────────────────────────────────────
// Deterministic hash
// ──────────────────────────────────────────────
const H = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453123
  return x - Math.floor(x)
}

// ──────────────────────────────────────────────
// PERF: Bake grass blades into composite filled paths
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
    const sw = 1.5 + H(i + seed + 50) * 1.7
    const cv = (H(i + seed + 100) - 0.5) * 0.42
    const ci = Math.floor(H(i + seed + 150) * 4)

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
// Real fluffy cloud — overlapping circles + shadow
// ──────────────────────────────────────────────
function Cloud({
  x,
  y,
  s,
  opacity,
}: {
  x: any
  y: number
  s: number
  opacity: number
}) {
  const c1x = useDerivedValue(() => x.value + 12 * s)
  const c2x = useDerivedValue(() => x.value + 30 * s)
  const c3x = useDerivedValue(() => x.value + 50 * s)
  const c4x = useDerivedValue(() => x.value + 68 * s)
  const c5x = useDerivedValue(() => x.value + 40 * s)
  const baseX = useDerivedValue(() => x.value + 6 * s)

  return (
    <>
      <RoundedRect
        x={baseX}
        y={18 * s + y}
        width={70 * s}
        height={20 * s}
        r={10 * s}
        color="#FFFFFF"
        opacity={opacity}
      />
      <Circle cx={c1x} cy={22 * s + y} r={14 * s} color="#FFFFFF" opacity={opacity} />
      <Circle cx={c2x} cy={14 * s + y} r={18 * s} color="#FFFFFF" opacity={opacity} />
      <Circle cx={c3x} cy={12 * s + y} r={22 * s} color="#FFFFFF" opacity={opacity} />
      <Circle cx={c4x} cy={16 * s + y} r={16 * s} color="#FFFFFF" opacity={opacity} />
      <Circle cx={c5x} cy={10 * s + y} r={14 * s} color="#FFFFFF" opacity={opacity * 0.5} />
      <RoundedRect
        x={baseX}
        y={28 * s + y}
        width={70 * s}
        height={10 * s}
        r={5 * s}
        color="#D0D8E8"
        opacity={opacity * 0.35}
      />
    </>
  )
}

// ──────────────────────────────────────────────
// Butterfly
// ──────────────────────────────────────────────
function Butterfly({
  t,
  w,
  h,
  colorA,
  colorB,
  seed,
  groundY,
}: {
  t: any
  w: number
  h: number
  colorA: string
  colorB: string
  seed: number
  groundY: number
}) {
  const cycle = 18 + seed * 2.5
  const land1x = w * (0.18 + seed * 0.08)
  const land2x = w * (0.72 - seed * 0.06)
  const land1y = groundY - 16 - seed * 3
  const land2y = groundY - 28 - seed * 5

  const bodyX = useDerivedValue(() => {
    const p = (t.value / cycle) % 1
    if (p < 0.18) return land1x
    if (p < 0.62) {
      const q = (p - 0.18) / 0.44
      return land1x + (land2x - land1x) * q + Math.sin(q * Math.PI * 4) * 10
    }
    if (p < 0.78) return land2x
    return land2x + (land1x - land2x) * ((p - 0.78) / 0.22)
  })

  const bodyY = useDerivedValue(() => {
    const p = (t.value / cycle) % 1
    if (p < 0.18) return land1y
    if (p < 0.62) {
      const q = (p - 0.18) / 0.44
      return groundY - 42 + Math.sin(q * Math.PI) * -(26 + seed * 8) + Math.sin(t.value * 6 + seed) * 4
    }
    if (p < 0.78) return land2y
    return land2y + Math.sin(((p - 0.78) / 0.22) * Math.PI) * -20
  })

  const wingScale = useDerivedValue(() => {
    const p = (t.value / cycle) % 1
    const landed = p < 0.18 || (p >= 0.62 && p < 0.78)
    return landed
      ? 0.35 + (Math.sin(t.value * 2.4) * 0.5 + 0.5) * 0.18
      : 0.65 + (Math.sin(t.value * 18) * 0.5 + 0.5) * 0.95
  })

  const lx = useDerivedValue(() => bodyX.value - 5.5)
  const rx = useDerivedValue(() => bodyX.value + 5.5)
  const wy = useDerivedValue(() => bodyY.value - (0.8 + wingScale.value * 1.8))
  const wR = useDerivedValue(() => 5 + wingScale.value * 4.5)
  const lwR = useDerivedValue(() => 3 + wingScale.value * 1.4)

  return (
    <>
      <Circle cx={bodyX} cy={bodyY} r={3} color="#2F241D" />
      <Circle cx={bodyX} cy={useDerivedValue(() => bodyY.value - 4)} r={1.6} color="#2F241D" />
      <Circle cx={lx} cy={wy} r={wR} color={colorA} opacity={0.9} />
      <Circle cx={rx} cy={wy} r={wR} color={colorA} opacity={0.9} />
      <Circle
        cx={useDerivedValue(() => bodyX.value - 4.5)}
        cy={useDerivedValue(() => bodyY.value + 3)}
        r={lwR}
        color={colorB}
        opacity={0.85}
      />
      <Circle
        cx={useDerivedValue(() => bodyX.value + 4.5)}
        cy={useDerivedValue(() => bodyY.value + 3)}
        r={lwR}
        color={colorB}
        opacity={0.85}
      />
      <Circle cx={lx} cy={wy} r={1.2} color="#FFFFFF" opacity={0.4} />
      <Circle cx={rx} cy={wy} r={1.2} color="#FFFFFF" opacity={0.4} />
    </>
  )
}

// ──────────────────────────────────────────────
// Ladybug
// ──────────────────────────────────────────────
function Ladybug({ t, w, groundY }: { t: any; w: number; groundY: number }) {
  const x = useDerivedValue(() => {
    const p = (t.value * 0.06) % 1
    return w * 0.58 + Math.sin(p * Math.PI * 2) * w * 0.12
  })
  const y = useDerivedValue(() => {
    const p = (t.value * 0.06) % 1
    return groundY - 7 + Math.sin(p * Math.PI * 4) * 1.5
  })

  return (
    <>
      <Circle cx={x} cy={y} r={3.8} color="#D9443F" />
      <Circle cx={useDerivedValue(() => x.value + 1.4)} cy={y} r={1} color="#1A1A1A" />
      <Circle cx={useDerivedValue(() => x.value - 1.4)} cy={useDerivedValue(() => y.value - 0.6)} r={0.9} color="#1A1A1A" />
      <Circle cx={useDerivedValue(() => x.value - 1.2)} cy={useDerivedValue(() => y.value + 1)} r={0.8} color="#1A1A1A" />
      <Rect x={useDerivedValue(() => x.value - 0.35)} y={useDerivedValue(() => y.value - 3.5)} width={0.7} height={7} color="#1A1A1A" />
      <Circle cx={useDerivedValue(() => x.value - 3.2)} cy={useDerivedValue(() => y.value - 0.2)} r={1.2} color="#1A1A1A" />
    </>
  )
}

// ──────────────────────────────────────────────
// Bird silhouettes drifting across the sky
// ──────────────────────────────────────────────
function Bird({ t, w, baseY, speed, startX }: { t: any; w: number; baseY: number; speed: number; startX: number }) {
  const bx = useDerivedValue(() => ((t.value * speed + startX) % (w + 60)) - 30)
  const by = useDerivedValue(() => baseY + Math.sin(t.value * 0.8 + startX) * 6)
  const wingSpan = useDerivedValue(() => 4 + Math.sin(t.value * 12 + startX) * 2.5)
  const leftTip = useDerivedValue(() => bx.value - wingSpan.value)
  const rightTip = useDerivedValue(() => bx.value + wingSpan.value)
  const wingTipY = useDerivedValue(() => by.value - wingSpan.value * 0.6)

  return (
    <>
      <Circle cx={bx} cy={by} r={1.2} color="#3A3A4A" opacity={0.45} />
      <Circle cx={leftTip} cy={wingTipY} r={0.8} color="#3A3A4A" opacity={0.35} />
      <Circle cx={rightTip} cy={wingTipY} r={0.8} color="#3A3A4A" opacity={0.35} />
    </>
  )
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
const GardenBackground = ({ width: w, height: h, theme }: Props) => {
  const horizonY = h * 0.47
const midY = h * 0.64
const groundY = h * 0.82

  // darker but only slightly
  const SKY_TOP = '#2F5E90'
  const SKY_MID = '#5489C2'
  const SKY_HORIZON = '#87A9C3'
  const SKY_WARM = '#B7B0A4'

  const GRASS_BRIGHT = '#4A9630'
  const GRASS_MID = '#3D8228'
  const GRASS_DEEP = '#2F6A1E'
  const GRASS_DARK = '#245216'
  const GRASS_YELLOW = '#6E9E3A'
  const GRASS_GROUND = '#356D20'

  const HILL_FAR = '#5F8069'
  const HILL_MID = '#456F47'
  const HILL_NEAR = '#355F33'

  const TREE_TRUNK = '#5A3A1C'
  const TREE_CANOPY_DARK = '#245A18'
  const TREE_CANOPY_MID = '#327826'
  const TREE_CANOPY_LIGHT = '#489434'

  const STONE_COLOR = '#88909A'
  const STONE_DARK = '#6E767E'
  const STONE_LIGHT = '#9AA2AA'

  const FLOWER_YELLOW = '#E8C044'
  const FLOWER_WHITE = '#EEE8E0'
  const FLOWER_PINK = '#D88098'
  const FLOWER_PURPLE = '#B080B8'

  const grassColors = [GRASS_BRIGHT, GRASS_MID, GRASS_DEEP, GRASS_YELLOW]

  const t = useSharedValue(0)
  useEffect(() => {
    t.value = withRepeat(
      withTiming(36000, { duration: 36000000, easing: Easing.linear }),
      -1,
      false,
    )
  }, [t])

  const cloud1x = useDerivedValue(() => ((t.value * 3.5) % (w + 200)) - 200)
  const cloud2x = useDerivedValue(() => (((t.value * 2.5) + 300) % (w + 260)) - 260)
  // const cloud3x = useDerivedValue(() => (((t.value * 1.8) + 150) % (w + 220)) - 220)
  // const cloud4x = useDerivedValue(() => (((t.value * 4.2) + 500) % (w + 180)) - 180)

  const moteX0 = useDerivedValue(() => 0.15 * w + Math.sin(((t.value / 14) + 0.0) % 1 * Math.PI * 3) * 18)
  const moteY0 = useDerivedValue(() => h * (0.95 - (((t.value / 14) + 0.0) % 1) * 0.7))
  const moteX1 = useDerivedValue(() => 0.45 * w + Math.sin(((t.value / 11) + 0.3) % 1 * Math.PI * 3) * 15)
  const moteY1 = useDerivedValue(() => h * (0.90 - (((t.value / 11) + 0.3) % 1) * 0.6))
  const moteX2 = useDerivedValue(() => 0.72 * w + Math.sin(((t.value / 16) + 0.6) % 1 * Math.PI * 3) * 12)
  const moteY2 = useDerivedValue(() => h * (0.88 - (((t.value / 16) + 0.6) % 1) * 0.5))

  const beetleX = useDerivedValue(() => w * 0.28 + Math.sin(t.value * 0.12) * w * 0.18)

  const geo = useMemo(() => {
    const makeHill = (baseY: number, bumps: [number, number][]) => {
      const p = Skia.Path.Make()
      p.moveTo(0, baseY)
      let prevX = 0
      let prevY = baseY
      bumps.forEach(([bx, by], i) => {
        p.cubicTo(prevX + (bx - prevX) * 0.4, prevY, prevX + (bx - prevX) * 0.7, by, bx, by)
        prevX = bx
        prevY = by
        if (i === bumps.length - 1 && bx < w) {
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
    ground.cubicTo(w * 0.12, groundY - 6, w * 0.3, groundY + 6, w * 0.5, groundY - 3)
    ground.cubicTo(w * 0.7, groundY + 5, w * 0.88, groundY - 4, w, groundY + 3)
    ground.lineTo(w, h)
    ground.lineTo(0, h)
    ground.close()

    const makeBush = (cx: number, cy: number, sc: number) => {
      const p = Skia.Path.Make()
      p.moveTo(cx - 34 * sc, cy + 8 * sc)
      p.cubicTo(cx - 40 * sc, cy - 10 * sc, cx - 18 * sc, cy - 24 * sc, cx - 2 * sc, cy - 12 * sc)
      p.cubicTo(cx + 8 * sc, cy - 28 * sc, cx + 28 * sc, cy - 20 * sc, cx + 26 * sc, cy - 4 * sc)
      p.cubicTo(cx + 44 * sc, cy - 4 * sc, cx + 42 * sc, cy + 14 * sc, cx + 24 * sc, cy + 16 * sc)
      p.cubicTo(cx + 10 * sc, cy + 28 * sc, cx - 18 * sc, cy + 24 * sc, cx - 34 * sc, cy + 8 * sc)
      p.close()
      return p
    }

    const makeTreeTop = (cx: number, cy: number, sc: number) => {
      const p = Skia.Path.Make()
      p.moveTo(cx - 30 * sc, cy + 12 * sc)
      p.cubicTo(cx - 44 * sc, cy - 8 * sc, cx - 32 * sc, cy - 38 * sc, cx - 8 * sc, cy - 36 * sc)
      p.cubicTo(cx + 2 * sc, cy - 50 * sc, cx + 26 * sc, cy - 42 * sc, cx + 28 * sc, cy - 28 * sc)
      p.cubicTo(cx + 42 * sc, cy - 22 * sc, cx + 46 * sc, cy, cx + 30 * sc, cy + 12 * sc)
      p.cubicTo(cx + 16 * sc, cy + 22 * sc, cx - 14 * sc, cy + 22 * sc, cx - 30 * sc, cy + 12 * sc)
      p.close()
      return p
    }

    const stone = (cx: number, cy: number, rx: number, ry: number) => {
      const p = Skia.Path.Make()
      p.moveTo(cx - rx, cy + ry * 0.4)
      p.cubicTo(cx - rx * 0.8, cy - ry, cx + rx * 0.6, cy - ry, cx + rx, cy + ry * 0.2)
      p.cubicTo(cx + rx * 0.6, cy + ry, cx - rx * 0.7, cy + ry, cx - rx, cy + ry * 0.4)
      p.close()
      return p
    }

    const fgGrass = bakeGrassLayer(60, 0, 14, 32, groundY, w)
    const midGrass = bakeGrassLayer(30, 90, 10, 22, groundY - 8, w)
    const bgGrass = bakeGrassLayer(18, 200, 6, 14, groundY + 8, w)

    const flowers = [
      { x: w * 0.08, y: groundY - 5, color: FLOWER_YELLOW, r: 2.8 },
      { x: w * 0.14, y: groundY - 10, color: FLOWER_WHITE, r: 2.5 },
      { x: w * 0.22, y: groundY - 4, color: FLOWER_PINK, r: 2.6 },
      { x: w * 0.35, y: groundY - 8, color: FLOWER_YELLOW, r: 2.4 },
      { x: w * 0.62, y: groundY - 6, color: FLOWER_PURPLE, r: 2.7 },
      { x: w * 0.70, y: groundY - 11, color: FLOWER_WHITE, r: 2.5 },
      { x: w * 0.78, y: groundY - 4, color: FLOWER_PINK, r: 2.3 },
      { x: w * 0.88, y: groundY - 7, color: FLOWER_YELLOW, r: 2.6 },
      { x: w * 0.94, y: groundY - 3, color: FLOWER_PURPLE, r: 2.2 },
    ]

    const flowerStems = Skia.Path.Make()
    flowers.forEach(({ x: fx, y: fy }) => {
      flowerStems.addRect(Skia.XYWHRect(fx - 0.6, fy, 1.2, 12))
    })

    return {
      farHill: makeHill(horizonY + 40, [
        [w * 0.2, horizonY + 12], [w * 0.45, horizonY + 28],
        [w * 0.7, horizonY + 8], [w * 0.9, horizonY + 24],
      ]),
      skyHill: makeHill(horizonY + 30, [
        [w * 0.15, horizonY + 2], [w * 0.35, horizonY + 20],
        [w * 0.55, horizonY - 8], [w * 0.8, horizonY + 16],
      ]),
      midHill: makeHill(midY - 6, [
        [w * 0.18, midY - 36], [w * 0.42, midY - 8],
        [w * 0.65, midY - 42], [w * 0.86, midY - 14],
      ]),
      frontRise: makeHill(groundY + 6, [
        [w * 0.16, groundY - 14], [w * 0.4, groundY + 4],
        [w * 0.68, groundY - 10], [w * 0.92, groundY + 4],
      ]),
      ground,
      fgGrass,
      midGrass,
      bgGrass,
      flowers,
      flowerStems,
      bush1: makeBush(w * 0.16, groundY - 8, 0.85),
      bush2: makeBush(w * 0.84, groundY - 6, 1.0),
      bush3: makeBush(w * 0.66, groundY - 16, 0.65),
      treeTop1: makeTreeTop(w * 0.10, midY - 30, 1.1),
      treeTop2: makeTreeTop(w * 0.92, midY - 38, 0.95),
      treeTop3: makeTreeTop(w * 0.50, midY - 24, 0.6),
      stone1: stone(w * 0.74, groundY + 6, 9, 5),
      stone2: stone(w * 0.20, groundY + 9, 7, 4),
      stone3: stone(w * 0.55, groundY + 8, 6, 3.5),
    }
  }, [w, h, groundY, horizonY, midY])

  return (
    <>
      {/* SKY */}
      <Rect x={0} y={0} width={w} height={h}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, horizonY + 30)}
          colors={[SKY_TOP, SKY_MID, SKY_HORIZON, SKY_WARM]}
          positions={[0, 0.4, 0.8, 1]}
        />
      </Rect>

      {/* slight global darkening */}
      <Rect x={0} y={0} width={w} height={h}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, h)}
          colors={['#00000018', '#00000010', '#00000006', '#00000000']}
          positions={[0, 0.35, 0.7, 1]}
        />
      </Rect>

      {/* spotlight behind tree area */}
<Circle cx={w * 0.52} cy={midY - 6} r={w * 0.20} color="#F4E6B8" opacity={0.10} />
<Circle cx={w * 0.52} cy={midY - 6} r={w * 0.11} color="#FFF4D6" opacity={0.08} />

      <Circle cx={w * 0.72} cy={horizonY - 10} r={w * 0.22} color="#F0E8D0" opacity={0.08} />
      <Circle cx={w * 0.72} cy={horizonY - 20} r={w * 0.12} color="#F5F0E0" opacity={0.05} />

      <Cloud x={cloud1x} y={h * 0.04} s={1.1} opacity={0.72} />
      <Cloud x={cloud2x} y={h * 0.12} s={0.85} opacity={0.66} />
      {/* <Cloud x={cloud3x} y={h * 0.02} s={0.6} opacity={0.5} />
      <Cloud x={cloud4x} y={h * 0.18} s={0.5} opacity={0.42} /> */}

      <Bird t={t} w={w} baseY={h * 0.14} speed={5} startX={80} />
      <Bird t={t} w={w} baseY={h * 0.11} speed={4.2} startX={220} />

      <Path path={geo.farHill} color={HILL_FAR} opacity={0.42} style="fill" />

      <Rect x={0} y={horizonY + 10} width={w} height={midY - horizonY}>
       <LinearGradient
  start={vec(0, 0)}
  end={vec(0, horizonY + 42)}
  colors={[SKY_TOP, SKY_MID, SKY_HORIZON, SKY_WARM]}
  positions={[0, 0.4, 0.8, 1]}
/>
      </Rect>

      <Path path={geo.skyHill} color={HILL_MID} opacity={0.58} style="fill" />
      <Path path={geo.midHill} color={HILL_NEAR} opacity={0.78} style="fill" />

    {/* Background scenerey trees */}
      {/* <Rect x={w * 0.088} y={midY - 4} width={10} height={38} color={TREE_TRUNK} opacity={0.9} />
      <Rect x={w * 0.91} y={midY - 8} width={9} height={42} color={TREE_TRUNK} opacity={0.9} />
      <Rect x={w * 0.49} y={midY + 4} width={6} height={26} color={TREE_TRUNK} opacity={0.68} />

      <Path path={geo.treeTop3} color={TREE_CANOPY_DARK} opacity={0.56} style="fill" />
      <Path path={geo.treeTop1} color={TREE_CANOPY_DARK} opacity={0.86} style="fill" />
      <Path path={geo.treeTop2} color={TREE_CANOPY_DARK} opacity={0.82} style="fill" />
      <Path path={geo.treeTop1} color={TREE_CANOPY_LIGHT} opacity={0.22} style="fill" />
      <Path path={geo.treeTop2} color={TREE_CANOPY_MID} opacity={0.24} style="fill" />
      <Path path={geo.treeTop3} color={TREE_CANOPY_LIGHT} opacity={0.14} style="fill" /> */}

      {geo.bgGrass.paths.map((p, i) => (
        <Path
          key={`bgl${i}`}
          path={p}
          color={grassColors[(geo.bgGrass.colorIndices[i] + 2) % grassColors.length]}
          style="fill"
          opacity={0.46}
        />
      ))}

      <Path path={geo.frontRise} color={GRASS_MID} opacity={0.2} style="fill" />

      <Path path={geo.ground} style="fill" color={GRASS_GROUND} />
      <Rect x={0} y={groundY} width={w} height={h - groundY}>
        <LinearGradient
          start={vec(0, groundY)}
          end={vec(0, h)}
          colors={[GRASS_GROUND, GRASS_DEEP]}
        />
      </Rect>

      <Rect x={0} y={groundY - 2} width={w} height={20}>
        <LinearGradient
          start={vec(0, groundY - 2)}
          end={vec(0, groundY + 18)}
          colors={[`${GRASS_YELLOW}18`, `${GRASS_YELLOW}00`]}
        />
      </Rect>

      <Path path={geo.bush1} color={TREE_CANOPY_MID} style="fill" opacity={0.95} />
      <Path path={geo.bush2} color={TREE_CANOPY_DARK} style="fill" opacity={0.97} />
      <Path path={geo.bush3} color={TREE_CANOPY_LIGHT} style="fill" opacity={0.8} />

      {geo.midGrass.paths.map((p, i) => (
        <Path
          key={`mgl${i}`}
          path={p}
          color={grassColors[(geo.midGrass.colorIndices[i] + 1) % grassColors.length]}
          style="fill"
          opacity={0.72}
        />
      ))}

      {geo.fgGrass.paths.map((p, i) => (
        <Path
          key={`fgl${i}`}
          path={p}
          color={grassColors[geo.fgGrass.colorIndices[i]]}
          style="fill"
        />
      ))}

      <Path path={geo.flowerStems} color={GRASS_DEEP} opacity={0.7} style="fill" />
      {geo.flowers.map(({ x, y, color, r }, i) => (
        <React.Fragment key={`wf${i}`}>
          <Circle cx={x} cy={y - 1} r={r} color={color} opacity={0.92} />
          <Circle cx={x - r * 0.75} cy={y + 0.5} r={r * 0.7} color={color} opacity={0.82} />
          <Circle cx={x + r * 0.75} cy={y + 0.5} r={r * 0.7} color={color} opacity={0.82} />
          <Circle cx={x} cy={y} r={r * 0.35} color={FLOWER_YELLOW} opacity={0.88} />
        </React.Fragment>
      ))}

      <Path path={geo.stone1} color={STONE_COLOR} opacity={0.75} style="fill" />
      <Path path={geo.stone2} color={STONE_DARK} opacity={0.7} style="fill" />
      <Path path={geo.stone3} color={STONE_LIGHT} opacity={0.6} style="fill" />

      <Butterfly t={t} w={w} h={h} groundY={groundY} seed={0} colorA="#FF9933" colorB="#FFD180" />
      <Butterfly t={t} w={w} h={h} groundY={groundY} seed={1} colorA="#64B5F6" colorB="#BBDEFB" />
      <Ladybug t={t} w={w} groundY={groundY} />

      <Circle cx={beetleX} cy={groundY + 4} r={2.5} color={GRASS_DARK} />
      <Circle cx={beetleX} cy={groundY + 3} r={1.2} color={TREE_TRUNK} opacity={0.6} />

      <Circle cx={moteX0} cy={moteY0} r={2.0} color="#E8E4DA" opacity={0.32} />
      <Circle cx={moteX1} cy={moteY1} r={2.5} color="#E8E0C8" opacity={0.28} />
      <Circle cx={moteX2} cy={moteY2} r={1.8} color="#E8E4DA" opacity={0.26} />

      <Rect x={0} y={h - h * 0.12} width={w} height={h * 0.12}>
        <LinearGradient
          start={vec(0, h - h * 0.12)}
          end={vec(0, h)}
          colors={[`${GRASS_DARK}00`, `${GRASS_DARK}40`]}
        />
      </Rect>
    </>
  )
}

export default GardenBackground