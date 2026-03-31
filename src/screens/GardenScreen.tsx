import React, { useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from 'react-native'
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
import { useActiveScene } from '@/hooks/useActiveScene'

interface Props {
  onNavigateHistory: () => void
  onNavigateArchive: () => void
  onNavigateSettings: () => void
  onDevReset?: () => void
}

const MAX_DAILY_WINS = 3

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

  const [sheetVisible, setSheetVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [streakResetMsg, setStreakResetMsg] = useState(false)
  const [recapVisible, setRecapVisible] = useState(false)
  const [recapSeasonNumber, setRecapSeasonNumber] = useState(0)
  const [recapTotalWins, setRecapTotalWins] = useState(0)
  const [rewardOptions, setRewardOptions] = useState<PlantType[]>([])
  const [selectedRewardType, setSelectedRewardType] = useState<PlantType | null>(null)

  const pendingUpdatedPlants = useRef<Plant[]>([])
  const pendingTotalWins = useRef(0)

  const today = new Date().toISOString().split('T')[0]
  const todayWins = wins.filter(w => w.createdAt.startsWith(today))
  const todayCount = todayWins.length
  const totalWins = wins.length
  const currentSeason = getCurrentSeason()
  const completedCount = seasons.filter(s => s.completedAt !== null).length
  const reachedDailyLimit = todayCount >= MAX_DAILY_WINS

  const sceneColors = scene.getColors(theme)
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
    const updatedPlants = await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setSheetVisible(false)

    if (isSeasonComplete(updatedPlants)) {
      const nextSeasonNumber = (getCurrentSeason()?.number ?? 0) + 1
      const totalWinsSnapshot = wins.length + 1
      const uniqueRewardOptions = Array.from(
        new Set(
          updatedPlants
            .filter(p => !p.isElder && p.stage === 4 && p.seasonId === currentSeason.id)
            .map(p => p.plantType),
        ),
      )
      pendingUpdatedPlants.current = updatedPlants
      pendingTotalWins.current = totalWinsSnapshot
      setRecapSeasonNumber(nextSeasonNumber - 1)
      setRecapTotalWins(totalWinsSnapshot)
      setRewardOptions(uniqueRewardOptions)
      setSelectedRewardType(uniqueRewardOptions[0] ?? null)
      setRecapVisible(true)
    }
  }

  const handleRecapReady = async () => {
    setRecapVisible(false)
    const nextSeason = await completeSeason(
      pendingTotalWins.current,
      pendingUpdatedPlants.current,
    )
    await transitionSeason(nextSeason.id, selectedRewardType)
    setRewardOptions([])
    setSelectedRewardType(null)
  }

  const handlePlantTap = (plant: Plant) => setSelectedPlant(plant)

  const handleDeleteWin = async (winId: string) => {
    await deleteWin(winId)
    const updatedPlants = await shrinkPlant(winId)
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
    ? "That's 3 for today 🌿"
    : todayCount === 0
      ? 'Plant a win'
      : todayCount === 1
        ? 'Plant another win'
        : 'One more slot left'

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
        onPlantTap={handlePlantTap}
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
            the small stuff adds up
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
            You missed a day. Your streak resets, but your garden stays.
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
        onSelect={setActiveScene}
        onClose={() => setPickerVisible(false)}
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
          rewardOptions={rewardOptions}
          selectedRewardType={selectedRewardType}
          onSelectReward={setSelectedRewardType}
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