import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { useWins } from '@/hooks/useWins'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import { useSeasons, isSeasonComplete } from '@/hooks/useSeasons'
import { Plant } from '@/hooks/usePlants'
import { DEFAULT_SCENE } from '@/scenes'
import LogWinSheet from '@/components/LogWinSheet'
import PlantPopup from '@/components/PlantPopup'
import SeasonRecapOverlay from '@/components/SeasonRecapOverlay'

interface Props {
  onNavigateHistory: () => void
  onNavigateArchive: () => void
  onDevReset?: () => void
}

const GardenScreen = ({ onNavigateHistory, onNavigateArchive, onDevReset }: Props) => {
  const { theme } = useTheme()
  const { width, height } = useWindowDimensions()
  const { wins, addWin, deleteWin } = useWins()
  const { plants, growPlant, shrinkPlant, addElderTrees, clearAllPlants } = usePlants()
  const { streak, updateStreak, recalculateStreak, graceAvailable } = useStreak()
  const { seasons, getCurrentSeason, completeSeason } = useSeasons()

  const [sheetVisible, setSheetVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [streakResetMsg, setStreakResetMsg] = useState(false)

  const [recapVisible, setRecapVisible] = useState(false)
  const [recapSeasonNumber, setRecapSeasonNumber] = useState(0)
  const [recapTotalWins, setRecapTotalWins] = useState(0)

  const pendingUpdatedPlants = useRef<Plant[]>([])
  const pendingTotalWins = useRef(0)
  const pendingCompletedSeasonCount = useRef(0)

  const today = new Date().toISOString().split('T')[0]
  const todayWins = wins.filter(w => w.createdAt.startsWith(today))
  const totalWins = wins.length
  const currentSeason = getCurrentSeason()
  const completedCount = seasons.filter(s => s.completedAt !== null).length

  // ─── Scene ──────────────────────────────────────────────────────────────────
  // Swap DEFAULT_SCENE for a user-selected scene when scene switching is built.
  const scene = DEFAULT_SCENE
  const sceneColors = scene.getColors(theme)
  const SceneCanvas = scene.Canvas

  const handleAddWin = async (text: string, emoji: string) => {
    if (!currentSeason) return
    const win = await addWin(text, emoji, currentSeason.id)
    const updatedPlants = await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setSheetVisible(false)

    if (isSeasonComplete(updatedPlants)) {
      const nextSeasonNumber = (getCurrentSeason()?.number ?? 0) + 1
      const totalWinsSnapshot = wins.length + 1

      pendingUpdatedPlants.current = updatedPlants
      pendingTotalWins.current = totalWinsSnapshot
      pendingCompletedSeasonCount.current = currentSeason.number

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
    await clearAllPlants()
    await addElderTrees(pendingCompletedSeasonCount.current, nextSeason.id)
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

  const s = makeStyles(theme)

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Stats row */}
        <View style={[s.statsRow, { backgroundColor: theme.stats.statsBg, borderBottomColor: theme.ui.border }]}>
          <View style={s.statItem}>
            <Text style={[s.statNumber, { color: theme.stats.streakText }]}>
              {streak.current}
            </Text>
            <Text style={[s.statLabel, { color: theme.text.secondary }]}>
              day streak
            </Text>
            {graceAvailable && streak.current > 0 && (
              <Text style={[s.graceIndicator, { color: theme.text.tertiary }]}>grace ✓</Text>
            )}
          </View>
          <View style={[s.statDivider, { backgroundColor: theme.ui.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statNumber, { color: theme.stats.winsText }]}>
              {totalWins}
            </Text>
            <Text style={[s.statLabel, { color: theme.text.secondary }]}>
              total wins
            </Text>
          </View>
          <View style={s.navButtons}>
            {completedCount > 0 && (
              <TouchableOpacity
                style={s.iconButton}
                onPress={onNavigateArchive}
                accessibilityLabel="View past seasons"
              >
                <Text style={[s.iconText, { color: theme.text.secondary }]}>🌿</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={s.iconButton}
              onPress={onNavigateHistory}
              accessibilityLabel="View history"
            >
              <Text style={[s.historyIcon, { color: theme.text.secondary }]}>☰</Text>
            </TouchableOpacity>
          </View>
          {__DEV__ && onDevReset && (
            <TouchableOpacity style={s.devResetButton} onPress={onDevReset}>
              <Text style={s.devResetText}>↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Streak reset message */}
        {streakResetMsg && (
          <View style={[s.resetBanner, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
            <Text style={[s.resetMsg, { color: theme.text.secondary }]}>
              You missed a day. It happens. Your streak resets but your garden stays.
            </Text>
          </View>
        )}

        {/* Scene canvas */}
        <View style={{ flex: 1 }}>
          <SceneCanvas
            width={width}
            height={height * 0.72}
            colors={sceneColors}
            theme={theme}
            plants={plants}
            wins={wins}
            onPlantTap={handlePlantTap}
          />
        </View>

        {/* FAB */}
        <View style={s.fabContainer}>
          <TouchableOpacity
            style={[s.fab, { backgroundColor: theme.brand.mid }]}
            onPress={() => setSheetVisible(true)}
            accessibilityLabel="Log a win"
          >
            <Text style={[s.fabText, { color: theme.text.inverse }]}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <LogWinSheet
        visible={sheetVisible}
        todayWinCount={todayWins.length}
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      fontSize: 28,
      fontWeight: '700',
    },
    statLabel: {
      fontSize: 11,
      marginTop: 1,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    graceIndicator: {
      fontSize: 10,
      marginTop: 2,
      letterSpacing: 0.4,
    },
    statDivider: {
      width: 1,
      height: 36,
      marginHorizontal: 12,
    },
    navButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
    },
    iconButton: {
      padding: 8,
    },
    iconText: {
      fontSize: 18,
    },
    historyIcon: {
      fontSize: 22,
    },
    fabContainer: {
      position: 'absolute',
      bottom: 36,
      alignSelf: 'center',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    fab: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    fabText: {
      fontSize: 32,
      lineHeight: 36,
      fontWeight: '300',
    },
    resetBanner: {
      marginHorizontal: 16,
      marginTop: 10,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
    },
    resetMsg: {
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
    devResetButton: {
      marginLeft: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: 'rgba(200,0,0,0.25)',
    },
    devResetText: {
      color: '#ff6b6b',
      fontSize: 16,
      fontWeight: '600',
    },
  })

export default GardenScreen