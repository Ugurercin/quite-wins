import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  Platform,
  LayoutChangeEvent,
} from 'react-native'
import { useTheme } from '@/theme'
import { useWins } from '@/hooks/useWins'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import { useSeasons, isSeasonComplete } from '@/hooks/useSeasons'
import { Plant } from '@/hooks/usePlants'
import { PlantType } from '@/scenes/grove/plants/plantTypes'
import { DEFAULT_SCENE } from '@/scenes'
import LogWinSheet from '@/components/LogWinSheet'
import PlantPopup from '@/components/PlantPopup'
import SeasonRecapOverlay from '@/components/SeasonRecapOverlay'

interface Props {
  onNavigateHistory: () => void
  onNavigateArchive: () => void
  onDevReset?: () => void
}

const MAX_DAILY_WINS = 2000

const GardenScreen = ({
  onNavigateHistory,
  onNavigateArchive,
  onDevReset,
}: Props) => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const { wins, addWin, deleteWin } = useWins()
  const { plants, growPlant, shrinkPlant, transitionSeason } = usePlants()
  const { streak, updateStreak, recalculateStreak, graceAvailable } = useStreak()
  const { seasons, getCurrentSeason, completeSeason } = useSeasons()

  const [sheetVisible, setSheetVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [streakResetMsg, setStreakResetMsg] = useState(false)

  const [recapVisible, setRecapVisible] = useState(false)
  const [recapSeasonNumber, setRecapSeasonNumber] = useState(0)
  const [recapTotalWins, setRecapTotalWins] = useState(0)

  const [gardenHeight, setGardenHeight] = useState(320)

  const pendingUpdatedPlants = useRef<Plant[]>([])
  const pendingTotalWins = useRef(0)
  const pendingElderTypes = useRef<PlantType[]>([])

  const today = new Date().toISOString().split('T')[0]
  const todayWins = wins.filter(w => w.createdAt.startsWith(today))
  const todayCount = todayWins.length
  const totalWins = wins.length
  const currentSeason = getCurrentSeason()
  const completedCount = seasons.filter(s => s.completedAt !== null).length
  const reachedDailyLimit = todayCount >= MAX_DAILY_WINS

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 54
  const bottomInset = Platform.OS === 'android' ? 18 : 28

  const scene = DEFAULT_SCENE
  const sceneColors = scene.getColors(theme)
  const SceneCanvas = scene.Canvas

  const handleGardenLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height
    if (nextHeight > 0) setGardenHeight(nextHeight)
  }

  const handleAddWin = async (text: string, emoji: string) => {
    if (!currentSeason) return

    const win = await addWin(text, emoji, currentSeason.id)
    const updatedPlants = await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setSheetVisible(false)

    if (isSeasonComplete(updatedPlants)) {
      const nextSeasonNumber = (getCurrentSeason()?.number ?? 0) + 1
      const totalWinsSnapshot = wins.length + 1

      const elderTypes = updatedPlants
        .filter(p => !p.isElder && p.stage === 4)
        .map(p => p.plantType)

      pendingUpdatedPlants.current = updatedPlants
      pendingTotalWins.current = totalWinsSnapshot
      pendingElderTypes.current = elderTypes

      setRecapSeasonNumber(nextSeasonNumber - 1)
      setRecapTotalWins(totalWinsSnapshot)
      setRecapVisible(true)
    }
  }

  const handleRecapReady = async () => {
    setRecapVisible(false)
    const nextSeason = await completeSeason(
      pendingTotalWins.current,
      pendingUpdatedPlants.current,
    )
    await transitionSeason(nextSeason.id, pendingElderTypes.current)
  }

  const handlePlantTap = (plant: Plant) => {
    setSelectedPlant(plant)
  }

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

  const getCtaLabel = (): string => {
    if (reachedDailyLimit) return "You've planted 3 today"
    if (todayCount === 0) return 'Plant your first win today'
    if (todayCount === 1) return 'Plant another win'
    return 'One more win left today'
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

      {/* ───────────────── Top area: header + optional banner ───────────────── */}
      <View
        style={[
          styles.topSection,
          {
            paddingTop: topInset + 8,
            backgroundColor: theme.background.primary,
            borderBottomColor: theme.ui.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: theme.stats.streakText }]}>
                {streak.current}
              </Text>
              <Text style={[styles.statUnit, { color: theme.text.tertiary }]}>
                day{streak.current !== 1 ? 's' : ''}
              </Text>

              {graceAvailable && streak.current > 0 && (
                <View
                  style={[
                    styles.graceDot,
                    { backgroundColor: theme.brand.light },
                  ]}
                />
              )}
            </View>

            <View
              style={[
                styles.statDivider,
                { backgroundColor: theme.ui.border },
              ]}
            />

            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: theme.stats.winsText }]}>
                {totalWins}
              </Text>
              <Text style={[styles.statUnit, { color: theme.text.tertiary }]}>
                win{totalWins !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {completedCount > 0 && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNavigateArchive}
                accessibilityLabel="View past seasons"
              >
                <Text style={[styles.iconText, { color: theme.text.secondary }]}>🌿</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNavigateHistory}
              accessibilityLabel="View history"
            >
              <Text style={[styles.iconText, { color: theme.text.secondary }]}>☰</Text>
            </TouchableOpacity>

            {__DEV__ && onDevReset && (
              <TouchableOpacity style={styles.iconButton} onPress={onDevReset}>
                <Text style={[styles.iconText, { color: theme.ui.danger }]}>↺</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {streakResetMsg && (
          <View
            style={[
              styles.resetBanner,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <Text style={[styles.resetText, { color: theme.text.secondary }]}>
              You missed a day. It happens. Your streak resets but your garden stays.
            </Text>
          </View>
        )}
      </View>

      {/* ───────────────── Middle area: garden only ───────────────── */}
      <View style={styles.gardenSection} onLayout={handleGardenLayout}>
        <SceneCanvas
          width={width}
          height={gardenHeight}
          colors={sceneColors}
          theme={theme}
          plants={plants}
          wins={wins}
          onPlantTap={handlePlantTap}
        />
      </View>

      {/* ───────────────── Bottom area: CTA only ───────────────── */}
      <View
        style={[
          styles.bottomSection,
          {
            paddingBottom: bottomInset,
            backgroundColor: 'transparent',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.ctaButton,
            {
              backgroundColor: reachedDailyLimit
                ? theme.background.tertiary
                : theme.brand.mid,
            },
          ]}
          onPress={() => !reachedDailyLimit && setSheetVisible(true)}
          activeOpacity={reachedDailyLimit ? 1 : 0.85}
          accessibilityLabel="Log a win"
        >
          <View style={styles.ctaLeft}>
            <View style={styles.ctaDots}>
              {Array.from({ length: MAX_DAILY_WINS }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.ctaDot,
                    {
                      backgroundColor:
                        i < todayCount
                          ? reachedDailyLimit
                            ? theme.text.tertiary
                            : theme.text.inverse
                          : reachedDailyLimit
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(255,255,255,0.30)',
                    },
                  ]}
                />
              ))}
            </View>

            <Text
              style={[
                styles.ctaText,
                {
                  color: reachedDailyLimit
                    ? theme.text.tertiary
                    : theme.text.inverse,
                },
              ]}
            >
              {getCtaLabel()}
            </Text>
          </View>

          {!reachedDailyLimit && (
            <Text style={[styles.ctaPlus, { color: theme.text.inverse }]}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ───────────────── Sheets / overlays ───────────────── */}
      <LogWinSheet
        visible={sheetVisible}
        todayWinCount={todayCount}
        onSubmit={handleAddWin}
        onClose={() => setSheetVisible(false)}
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
  // ───────────────── Screen layout ─────────────────
  screen: {
    flex: 1,
  },

  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  gardenSection: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // ───────────────── Header ─────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },

  statChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  statUnit: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  statDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 14,
  },

  graceDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginLeft: 4,
    marginBottom: 2,
  },

  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },

  iconText: {
    fontSize: 20,
  },

  // ───────────────── Banner ─────────────────
  resetBanner: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  resetText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },

  // ───────────────── CTA ─────────────────
  ctaButton: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },

  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },

  ctaDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  ctaDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },

  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  ctaPlus: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 12,
    opacity: 0.8,
  },
})

export default GardenScreen