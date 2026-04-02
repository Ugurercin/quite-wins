import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AppState,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from 'react-native'
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { useWins } from '@/hooks/useWins'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import { useSeasons, isSeasonComplete } from '@/hooks/useSeasons'
import { Plant } from '@/hooks/usePlants'
import { PlantType } from '@/scenes/grove/plants/plantTypes'
import LogWinSheet from '@/components/LogWinSheet'
import PlantPopup from '@/components/PlantPopup'
import SeasonRecapOverlay from '@/components/SeasonRecapOverlay'
import ScenePickerSheet from '@/components/ScenePickerSheet'
import BundlePaywallSheet from '@/components/BundlePaywallSheet'
import PalettePaywallSheet from '@/components/PalettePaywallSheet'
import ScenePaywallSheet from '@/components/ScenePaywallSheet'
import { useActiveScene } from '@/hooks/useActiveScene'
import { useActivePalette } from '@/hooks/useActivePalette'
import { getPaletteById } from '@/scenes/grove/palettes'
import { Scene } from '@/scenes/types'
import { COPY } from '@/constants/copy'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'
import { onWinLogged } from '@/notifications/notifications'
import { useAudio } from '@/audio/useAudio'
import { MusicContext } from '@/audio/tracks'

interface Props {
  onNavigateHistory: () => void
  onNavigateArchive: () => void
  onNavigateSettings: () => void
  onDevReset?: () => void
}

const MAX_DAILY_WINS = 4

const GardenScreen = ({
  onNavigateHistory,
  onNavigateArchive,
  onNavigateSettings,
  onDevReset,
}: Props) => {
  const { theme } = useTheme()
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const { wins, addWin, deleteWin } = useWins()
  const { plants, growPlant, shrinkPlant, transitionSeason } = usePlants()
  const { streak, updateStreak, recalculateStreak, graceAvailable } = useStreak()
  const { seasons, getCurrentSeason, completeSeason } = useSeasons()
  const { activeScene: scene, setActiveScene } = useActiveScene()
  const { activePaletteId, setActivePalette } = useActivePalette()
  const { playMusic, crossfadeTo, playSFX, stopMusic } = useAudio()

  // Palette applies only to Grove; other scenes ignore it entirely
  const activePalette = scene.id === 'grove' ? getPaletteById(activePaletteId) : null

  const [sheetVisible, setSheetVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [scenePaywallVisible, setScenePaywallVisible] = useState(false)
  const [bundlePaywallVisible, setBundlePaywallVisible] = useState(false)
  const [paywallTriggerScene, setPaywallTriggerScene] = useState<Scene | null>(null)
  const [palettePaywallVisible, setPalettePaywallVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [streakResetMsg, setStreakResetMsg] = useState(false)
  const [recapVisible, setRecapVisible] = useState(false)
  const [recapSeasonNumber, setRecapSeasonNumber] = useState(0)
  const [recapTotalWins, setRecapTotalWins] = useState(0)
  const [pendingElderType, setPendingElderType] = useState<PlantType | null>(null)

  const [planted, setPlanted] = useState(false)
  const plantedOpacity = useSharedValue(0)
  const plantedOverlayStyle = useAnimatedStyle(() => ({ opacity: plantedOpacity.value }))

  useEffect(() => {
    if (planted) {
      plantedOpacity.value = withSequence(
        withTiming(0.15, { duration: 200 }),
        withTiming(0, { duration: 400 }),
      )
    }
  }, [planted])

  // Crossfade to scene music when active scene changes
  useEffect(() => {
    const context = scene.id as MusicContext
    if (['grove', 'night', 'space'].includes(context)) {
      crossfadeTo(context)
    }
  }, [scene.id])

  // Pause music when app backgrounds, resume when foregrounded
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'background' || state === 'inactive') {
        stopMusic()
      } else if (state === 'active') {
        const context = scene.id as MusicContext
        if (['grove', 'night', 'space'].includes(context)) {
          crossfadeTo(context)
        }
      }
    })
    return () => sub.remove()
  }, [scene.id])

  const pendingUpdatedPlants = useRef<Plant[]>([])
  const pendingTotalWins = useRef(0)

  const today = new Date().toISOString().split('T')[0]
  const todayWins = wins.filter(w => w.createdAt.startsWith(today))
  const todayCount = todayWins.length
  const totalWins = wins.length
  const currentSeason = getCurrentSeason()
  const completedCount = seasons.filter(s => s.completedAt !== null).length
  const reachedDailyLimit = todayCount >= MAX_DAILY_WINS

  const sceneColors = activePalette ? activePalette.getColors(theme) : scene.getColors(theme)
  const SceneCanvas = scene.Canvas

  const seasonProgress = useMemo(() => {
    if (!currentSeason) return 0
    const seasonPlants = plants.filter(p => p.seasonId === currentSeason.id && !p.isElder)
    const grownPoints = seasonPlants.reduce((sum, plant) => sum + plant.stage, 0)
    return Math.max(0, Math.min(1, grownPoints / 40))
  }, [plants, currentSeason])

  const handleAddWin = async (text: string, emoji: string) => {
    if (!currentSeason) return
    const win = await addWin(text, emoji, currentSeason.id)
    setSheetVisible(false)
    setTimeout(async () => {
      const updatedPlants = await growPlant(win.id, currentSeason.id)
      await updateStreak()
      setPlanted(true)
      setTimeout(() => setPlanted(false), 600)
      const notifTime = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME) ?? '20:00'
      const streakRaw = await AsyncStorage.getItem(STORAGE_KEYS.STREAK)
      const streakState = streakRaw ? JSON.parse(streakRaw) : null
      const isGrace = streakState?.graceUsedThisWeek ?? false
      await onWinLogged(todayCount + 1, notifTime, isGrace)

      if (isSeasonComplete(updatedPlants)) {
        await playSFX('season_complete')
        const nextSeasonNumber = (getCurrentSeason()?.number ?? 0) + 1
        const totalWinsSnapshot = wins.length + 1

        // Auto-assign elder: most common non-elder plant type this season
        const seasonPlants = updatedPlants.filter(p => !p.isElder && p.seasonId === currentSeason.id)
        const typeCounts: Record<string, number> = {}
        for (const p of seasonPlants) {
          typeCounts[p.plantType] = (typeCounts[p.plantType] ?? 0) + 1
        }
        const autoElderType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as PlantType ?? null

        pendingUpdatedPlants.current = updatedPlants
        pendingTotalWins.current = totalWinsSnapshot
        setRecapSeasonNumber(nextSeasonNumber - 1)
        setRecapTotalWins(totalWinsSnapshot)
        setPendingElderType(autoElderType)
        setRecapVisible(true)
      }
    }, 500)
  }

  const handleRecapReady = async () => {
    setRecapVisible(false)
    const nextSeason = await completeSeason(pendingTotalWins.current, pendingUpdatedPlants.current)
    await transitionSeason(nextSeason.id, pendingElderType, scene.id)
    await playSFX('elder_appears')
    setPendingElderType(null)
  }

  const handleLockedSceneTap = (scene: Scene) => {
    setPickerVisible(false)
    setPaywallTriggerScene(scene)
    setScenePaywallVisible(true)
  }

  const handlePlantTap = (plant: Plant) => setSelectedPlant(plant)

  const handleDeleteWin = async (winId: string) => {
    await deleteWin(winId)
    const updatedPlants = await shrinkPlant(winId)
    playSFX('win_deleted')
    const remainingWins = wins.filter(w => w.id !== winId)
    const { wasReset } = await recalculateStreak(remainingWins.map(w => w.createdAt))
    if (wasReset) {
      setStreakResetMsg(true)
      setTimeout(() => setStreakResetMsg(false), 4000)
    }
    if (selectedPlant) {
      const stillExists = updatedPlants.find(p => p.id === selectedPlant.id)
      setSelectedPlant(stillExists ?? null)
    }
  }

  const ctaLabel = reachedDailyLimit
  ? COPY.garden.cta.limitReached
  : todayCount === 0
    ? COPY.garden.cta.plant
    : todayCount === 1
      ? COPY.garden.cta.plantAnother
      : todayCount === 2
        ? COPY.garden.cta.almostThere
        : COPY.garden.cta.oneLeft

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Garden fills the entire screen ── */}
      <SceneCanvas
        width={width}
        height={height}
        colors={sceneColors}
        theme={theme}
        plants={plants}
        wins={wins}
        activeSceneId={scene.id}
        paletteBackgroundColors={activePalette?.getBackgroundColors()}
        onPlantTap={handlePlantTap}
      />

      {/* ── Plant flash overlay ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#fff', zIndex: 5 },
          plantedOverlayStyle,
        ]}
      />

      {/* ── Hero strip — frosted, floats over garden ── */}
      <View
        style={[
          styles.hero,
          {
            paddingTop: insets.top + 6,
            backgroundColor: 'rgba(10,18,8,0.72)',
            borderBottomColor: 'rgba(255,255,255,0.06)',
          },
        ]}
      >
        {/* Row 1: slogan left, icons right */}
        <View style={styles.heroRow}>
          <Text style={[styles.slogan, { color: 'rgba(255,255,255,0.38)' }]}>
            {COPY.garden.slogan}
          </Text>
          <View style={styles.iconRow}>
            {completedCount > 0 && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={onNavigateArchive}
                accessibilityLabel="View past seasons"
              >
                <Text style={styles.iconGlyph}>🌿</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onNavigateHistory}
              accessibilityLabel="View history"
            >
              <Text style={styles.iconGlyph}>☰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onNavigateSettings}
              accessibilityLabel="Settings"
            >
              <Text style={styles.iconGlyph}>⚙️</Text>
            </TouchableOpacity>
            {__DEV__ && onDevReset && (
              <TouchableOpacity style={styles.iconBtn} onPress={onDevReset}>
                <Text style={[styles.iconGlyph, { color: theme.ui.danger }]}>↺</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Row 2: stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: theme.stats.streakText }]}>
              {streak.current}
            </Text>
            <Text style={[styles.statLbl, { color: 'rgba(255,255,255,0.4)' }]}>
              {streak.current === 1 ? 'day streak' : 'day streak'}
            </Text>
            {graceAvailable && streak.current > 0 && (
              <View style={[styles.graceDot, { backgroundColor: theme.brand.light }]} />
            )}
          </View>

          <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: theme.stats.winsText }]}>
              {totalWins}
            </Text>
            <Text style={[styles.statLbl, { color: 'rgba(255,255,255,0.4)' }]}>
              total wins
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: 'rgba(255,255,255,0.7)' }]}>
              S{currentSeason?.number ?? 1}
            </Text>
            <Text style={[styles.statLbl, { color: 'rgba(255,255,255,0.4)' }]}>
              season
            </Text>
          </View>
        </View>
      </View>

      {/* ── Streak reset banner — floats below hero strip ── */}
      {streakResetMsg && (
        <View style={[styles.resetBanner, { top: insets.top + 80 }]}>
          <Text style={styles.resetText}>
            {COPY.garden.streakReset}
          </Text>
        </View>
      )}

      {/* ── Floating bottom bar ── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
        pointerEvents="box-none"
      >
        {/* Scene pill — left */}
        <View style={styles.bottomRow} pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.scenePill, { backgroundColor: 'rgba(0,0,0,0.36)' }]}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.8}
            accessibilityLabel="Switch scene"
          >
            <Text style={styles.scenePillIcon}>🌿</Text>
            <Text style={[styles.scenePillText, { color: 'rgba(255,255,255,0.7)' }]}>
              {scene.name}
            </Text>
          </TouchableOpacity>

          {/* Win dots — center-right */}
          <View style={styles.dotsWrap} pointerEvents="none">
            {Array.from({ length: MAX_DAILY_WINS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i < todayCount
                      ? theme.brand.light
                      : 'rgba(255,255,255,0.2)',
                  },
                ]}
              />
            ))}
          </View>

          {/* CTA button — right */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              {
                backgroundColor: reachedDailyLimit
                  ? 'rgba(0,0,0,0.36)'
                  : theme.brand.mid,
              },
            ]}
            onPress={() => !reachedDailyLimit && setSheetVisible(true)}
            activeOpacity={reachedDailyLimit ? 1 : 0.85}
            accessibilityLabel="Log a win"
          >
            <Text
              style={[
                styles.ctaBtnText,
                {
                  color: reachedDailyLimit
                    ? 'rgba(255,255,255,0.35)'
                    : theme.text.inverse,
                },
              ]}
            >
              {ctaLabel}
            </Text>
            {!reachedDailyLimit && (
              <Text style={[styles.ctaPlus, { color: theme.text.inverse }]}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Sheets & overlays ── */}
      <LogWinSheet
        visible={sheetVisible}
        todayWinCount={todayCount}
        onSubmit={handleAddWin}
        onClose={() => setSheetVisible(false)}
      />

      <ScenePickerSheet
        visible={pickerVisible}
        activeSceneId={scene.id}
        activePaletteId={activePaletteId}
        onSelect={setActiveScene}
        onPaletteSelect={(id) => {
          setActivePalette(id)
          setPickerVisible(false)
        }}
        onClose={() => setPickerVisible(false)}
        onLockedSceneTap={handleLockedSceneTap}
        onLockedPaletteTap={() => {
          setPickerVisible(false)
          setPalettePaywallVisible(true)
        }}
      />

      <ScenePaywallSheet
        visible={scenePaywallVisible}
        scene={paywallTriggerScene}
        onClose={() => setScenePaywallVisible(false)}
        onPurchase={() => setScenePaywallVisible(false)}
        onPurchaseBundle={() => {
          setScenePaywallVisible(false)
          setBundlePaywallVisible(true)
        }}
        onRestore={() => setScenePaywallVisible(false)}
      />

      <BundlePaywallSheet
        visible={bundlePaywallVisible}
        triggerScene={paywallTriggerScene}
        onClose={() => setBundlePaywallVisible(false)}
        onPurchase={() => setBundlePaywallVisible(false)}
        onRestore={() => setBundlePaywallVisible(false)}
      />

      <PalettePaywallSheet
        visible={palettePaywallVisible}
        onClose={() => setPalettePaywallVisible(false)}
        onPurchase={() => setPalettePaywallVisible(false)}
        onRestore={() => setPalettePaywallVisible(false)}
      />

      <PlantPopup
        plant={selectedPlant}
        wins={wins}
        theme={theme}
        onClose={() => setSelectedPlant(null)}
        onDeleteWin={handleDeleteWin}
      />

      {recapVisible && (
        <SeasonRecapOverlay
          seasonNumber={recapSeasonNumber}
          totalWins={recapTotalWins}
          theme={theme}
          onReady={handleRecapReady}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },

  // ── Hero strip ──
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  statBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  statDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 12,
  },
  statNum: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statLbl: {
    fontSize: 11,
    fontWeight: '500',
  },
  graceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginLeft: 2,
    marginBottom: 1,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  iconGlyph: {
    fontSize: 14,
  },

  // ── Reset banner ──
  resetBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    zIndex: 10,
  },
  resetText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 17,
  },

  // ── Bottom bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    zIndex: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scenePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 20,
  },
  scenePillIcon: {
    fontSize: 13,
  },
  scenePillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dotsWrap: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  ctaPlus: {
    fontSize: 16,
    fontWeight: '300',
    marginTop: -1,
  },
})

export default GardenScreen