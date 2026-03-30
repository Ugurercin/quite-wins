import React, { useState } from 'react'
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
import { useSeasons } from '@/hooks/useSeasons'
import GardenCanvas from '@/components/garden/GardenCanvas'
import LogWinSheet from '@/components/LogWinSheet'

interface Props {
  onNavigateHistory: () => void
  onDevReset?: () => void
}

const GardenScreen = ({ onNavigateHistory, onDevReset }: Props) => {
  const { theme } = useTheme()
  const { width, height } = useWindowDimensions()
  const { wins, addWin } = useWins()
  const { plants, growPlant } = usePlants()
  const { streak, updateStreak } = useStreak()
  const { getCurrentSeason } = useSeasons()
  const [sheetVisible, setSheetVisible] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const todayWins = wins.filter(w => w.createdAt.startsWith(today))
  const totalWins = wins.length
  const currentSeason = getCurrentSeason()

  const handleAddWin = async (text: string, emoji: string) => {
    if (!currentSeason) return
    const win = await addWin(text, emoji, currentSeason.id)
    await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setSheetVisible(false)
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
          <TouchableOpacity
            style={s.historyButton}
            onPress={onNavigateHistory}
            accessibilityLabel="View history"
          >
            <Text style={[s.historyIcon, { color: theme.text.secondary }]}>☰</Text>
          </TouchableOpacity>
          {__DEV__ && onDevReset && (
            <TouchableOpacity style={s.devResetButton} onPress={onDevReset}>
              <Text style={s.devResetText}>↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Garden canvas */}
        <View style={{ flex: 1 }}>
          <GardenCanvas
            width={width}
            height={height * 0.72}
            theme={theme}
            plants={plants}
            wins={wins}
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
    statDivider: {
      width: 1,
      height: 36,
      marginHorizontal: 12,
    },
    historyButton: {
      padding: 8,
      marginLeft: 8,
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
