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
import { DEFAULT_SCENE } from '@/scenes'
import LogWinSheet from '@/components/LogWinSheet'
import PlantPopup from '@/components/PlantPopup'
import SeasonRecapOverlay from '@/components/SeasonRecapOverlay'

interface Props {
  onNavigateHistory: () => void
  onNavigateArchive: () => void
  onNavigateSettings: () => void
  onDevReset?: () => void
}

const MAX_DAILY_WINS = 3

const GardenScreen = ({ onNavigateHistory, onNavigateArchive, onNavigateSettings, onDevReset }: Props) => {
  const { theme } = useTheme()
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

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

  const scene = DEFAULT_SCENE
  const sceneColors = scene.getColors(theme)
  const SceneCanvas = scene.Canvas

  const seasonProgress = useMemo(() => {
    if (!currentSeason) return 0

    const seasonPlants = plants.filter(
      p => p.seasonId === currentSeason.id && !p.isElder,
    )

    const grownPoints = seasonPlants.reduce((sum, plant) => sum + plant.stage, 0)

    // 10 plants * stage 4 = 40 total points
    const maxPoints = 40
    return Math.max(0, Math.min(1, grownPoints / maxPoints))
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

  const getCtaLabel = (): string => {
    if (reachedDailyLimit) return `You've planted ${MAX_DAILY_WINS} today`
    if (todayCount === 0) return 'Plant your first win today'
    if (todayCount === 1) return 'Plant another win'
    return 'One more win left today'
  }

  const getSubcopy = (): string => {
    if (todayCount === 0) return 'Tiny progress still counts.'
    if (reachedDailyLimit) return 'Come back tomorrow and keep the streak alive.'
    return `${MAX_DAILY_WINS - todayCount} daily slot${MAX_DAILY_WINS - todayCount === 1 ? '' : 's'} remaining`
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

      {/* Ambient background glows */}
      <View
        pointerEvents="none"
        style={[
          styles.ambientGlowTop,
          { backgroundColor: 'rgba(91, 176, 86, 0.10)' },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.ambientGlowBottom,
          { backgroundColor: 'rgba(34, 197, 94, 0.08)' },
        ]}
      />

      {/* Top area */}
      <View
        style={[
          styles.topShell,
          {
            paddingTop: insets.top + 2,
            paddingHorizontal: 14,
          },
        ]}
      >
        <View style={styles.topActionsRow}>
          <View style={styles.topActionsSpacer} />

          <View style={styles.headerActions}>
            {completedCount > 0 && (
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  },
                ]}
                onPress={onNavigateArchive}
                accessibilityLabel="View past seasons"
              >
                <Text style={[styles.iconText, { color: theme.text.secondary }]}>🌿</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                },
              ]}
              onPress={onNavigateHistory}
              accessibilityLabel="View history"
            >
              <Text style={[styles.iconText, { color: theme.text.secondary }]}>☰</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                },
              ]}
              onPress={onNavigateSettings}
              accessibilityLabel="Settings"
            >
              <Text style={[styles.iconText, { color: theme.text.secondary }]}>⚙️</Text>
            </TouchableOpacity>

            {__DEV__ && onDevReset && (
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  },
                ]}
                onPress={onDevReset}
              >
                <Text style={[styles.iconText, { color: theme.ui.danger }]}>↺</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.08)',
            },
          ]}
        >
          <View style={styles.heroTopMeta}>
            <View style={styles.heroMetaPill}>
              <Text style={[styles.heroMetaValue, { color: theme.stats.streakText }]}>
                {streak.current}
              </Text>
              <Text style={[styles.heroMetaLabel, { color: theme.text.secondary }]}>
                day streak
              </Text>
              {graceAvailable && streak.current > 0 && (
                <View style={styles.heroGraceRow}>
                  <View
                    style={[
                      styles.graceDot,
                      { backgroundColor: theme.brand.light },
                    ]}
                  />
                  <Text style={[styles.heroGraceText, { color: theme.text.tertiary }]}>
                    grace ready
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.heroMetaPill}>
              <Text style={[styles.heroMetaValue, { color: theme.stats.winsText }]}>
                {totalWins}
              </Text>
              <Text style={[styles.heroMetaLabel, { color: theme.text.secondary }]}>
                total wins
              </Text>
            </View>

            <View style={styles.heroMetaPill}>
              <Text style={[styles.heroMetaValue, { color: theme.text.primary }]}>
                {currentSeason?.number ?? 1}
              </Text>
              <Text style={[styles.heroMetaLabel, { color: theme.text.secondary }]}>
                season
              </Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={[styles.heroEyebrow, { color: theme.text.tertiary }]}>
              TODAY
            </Text>
            <Text style={[styles.heroTitle, { color: theme.text.primary }]}>
              Your grove is growing quietly.
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.text.secondary }]}>
              Log a small win, grow the garden, and build momentum without pressure.
            </Text>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.text.secondary }]}>
                Season progress
              </Text>
              <Text style={[styles.progressValue, { color: theme.text.primary }]}>
                {Math.round(seasonProgress * 100)}%
              </Text>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: 'rgba(255,255,255,0.08)' },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(8, seasonProgress * 100)}%`,
                    backgroundColor: theme.brand.mid,
                  },
                ]}
              />
            </View>
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
              You missed a day. Your streak resets, but your garden stays.
            </Text>
          </View>
        )}
      </View>

      {/* Garden area */}
      <View style={styles.sceneSection}>
        <View
          style={[
            styles.sceneFrame,
            {
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            },
          ]}
        >
          <View style={styles.sceneClip}>
             <SceneCanvas
              width={width - 20}
              height={Math.max(470, height * 0.66)}
              colors={sceneColors}
              theme={theme}
              plants={plants}
              wins={wins}
              onPlantTap={handlePlantTap}
            />
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomShell,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            paddingHorizontal: 16,
          },
        ]}
      >
        <View
          style={[
            styles.ctaCard,
            {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.08)',
            },
          ]}
        >
          <View style={styles.ctaTopRow}>
            <View style={styles.ctaCopy}>
              <Text style={[styles.ctaTitle, { color: theme.text.primary }]}>
                {getCtaLabel()}
              </Text>
              <Text style={[styles.ctaSubtitle, { color: theme.text.secondary }]}>
                {getSubcopy()}
              </Text>
            </View>

            <View style={styles.dotsRow}>
              {Array.from({ length: MAX_DAILY_WINS }).map((_, i) => {
                const filled = i < todayCount
                return (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor: filled
                          ? theme.brand.mid
                          : 'rgba(255,255,255,0.18)',
                        borderColor: filled
                          ? theme.brand.mid
                          : 'rgba(255,255,255,0.12)',
                      },
                    ]}
                  />
                )
              })}
            </View>
          </View>

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
            activeOpacity={reachedDailyLimit ? 1 : 0.88}
            accessibilityLabel="Log a win"
          >
            <Text
              style={[
                styles.ctaButtonText,
                {
                  color: reachedDailyLimit
                    ? theme.text.tertiary
                    : theme.text.inverse,
                },
              ]}
            >
              {reachedDailyLimit ? 'Daily limit reached' : 'Log a quiet win'}
            </Text>

            {!reachedDailyLimit && (
              <View
                style={[
                  styles.ctaPlusWrap,
                  { backgroundColor: 'rgba(255,255,255,0.16)' },
                ]}
              >
                <Text style={[styles.ctaPlus, { color: theme.text.inverse }]}>+</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
  },

  ambientGlowTop: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    height: 220,
    borderRadius: 140,
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    height: 180,
    borderRadius: 120,
  },

  topShell: {
    zIndex: 3,
  },

   topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topActionsSpacer: {
    flex: 1,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '600',
  },

  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
  },

  heroTopMeta: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
    marginBottom: 10,
  },
  heroMetaPill: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  heroMetaValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 1,
  },
  heroMetaLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  heroGraceRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroGraceText: {
    fontSize: 9,
    fontWeight: '500',
  },
  graceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },

  heroCopy: {
    marginBottom: 10,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },

  progressWrap: {
    gap: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  resetBanner: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  resetText: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },

  sceneSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
  },
  sceneFrame: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 8,
  },
  sceneClip: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },

  bottomShell: {
    zIndex: 3,
    paddingTop: 0,
  },
  ctaCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    marginBottom: 2,
  },
  ctaTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  ctaCopy: {
    flex: 1,
    paddingRight: 6,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 3,
  },
  progressDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    borderWidth: 1,
  },

  ctaButton: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  ctaPlusWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPlus: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: -1,
  },
})

export default GardenScreen