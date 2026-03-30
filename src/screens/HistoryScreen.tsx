import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { useHistory } from '@/hooks/useHistory'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import SwipeableWinRow from '@/components/SwipeableWinRow'

interface Props {
  onBack: () => void
}

const HistoryScreen = ({ onBack }: Props) => {
  const { theme } = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  const { groups, loading, deleteWin, totalWins } = useHistory()
  const { shrinkPlant } = usePlants()
  const { recalculateStreak, streak } = useStreak()
  const [streakResetMsg, setStreakResetMsg] = useState(false)
  const s = makeStyles(theme)

  const handleDeleteWin = async (winId: string) => {
    await deleteWin(winId)
    await shrinkPlant(winId)

    // Recompute streak from remaining wins (excluding the deleted one)
    // We read all remaining wins via the groups that will update after deleteWin
    // For immediate recalculation, use the current groups minus the deleted win
    const remainingDates = groups
      .flatMap(g => g.wins)
      .filter(w => w.id !== winId)
      .map(w => w.createdAt)

    const { wasReset } = await recalculateStreak(remainingDates)
    if (wasReset) {
      setStreakResetMsg(true)
      setTimeout(() => setStreakResetMsg(false), 4000)
    }
  }

  if (loading) {
    return (
      <View style={[s.container, { backgroundColor: theme.background.primary }]} />
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[s.container, { backgroundColor: theme.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
        <SafeAreaView style={{ flex: 1 }}>

          {/* Header */}
          <View style={[s.header, { borderBottomColor: theme.ui.border }]}>
            <TouchableOpacity style={s.backBtn} onPress={onBack} accessibilityLabel="Back to garden">
              <Text style={[s.backArrow, { color: theme.text.secondary }]}>←</Text>
            </TouchableOpacity>
            <Text style={[s.title, { color: theme.text.primary }]}>History</Text>
            <View style={s.backBtn} />
          </View>

          {/* Streak reset gentle message */}
          {streakResetMsg && (
            <View style={[s.resetBanner, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
              <Text style={[s.resetMsg, { color: theme.text.secondary }]}>
                You missed a day. It happens. Your streak resets but your garden stays.
              </Text>
            </View>
          )}

          {/* Content */}
          {groups.length === 0 ? (
            <View style={s.empty}>
              <Text style={[s.emptyText, { color: theme.text.tertiary }]}>
                No wins logged yet.{'\n'}Go plant your first one.
              </Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {groups.map(group => (
                <View key={group.dateStr}>
                  <View style={[s.dayHeader, { borderBottomColor: theme.ui.border }]}>
                    <Text style={[s.dayLabel, { color: theme.text.secondary }]}>
                      {group.label}
                    </Text>
                    <Text style={[s.dayCount, { color: theme.text.tertiary }]}>
                      {group.wins.length} {group.wins.length === 1 ? 'win' : 'wins'}
                    </Text>
                  </View>
                  {group.wins.map(win => (
                    <SwipeableWinRow
                      key={win.id}
                      win={win}
                      theme={theme}
                      scrollRef={scrollRef}
                      onDeleteWin={handleDeleteWin}
                    />
                  ))}
                </View>
              ))}

              {/* Footer */}
              <View style={s.footer}>
                <Text style={[s.footerText, { color: theme.text.tertiary }]}>
                  {totalWins} total {totalWins === 1 ? 'win' : 'wins'} logged
                </Text>
              </View>
            </ScrollView>
          )}

        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    backBtn: { width: 48, alignItems: 'center' },
    backArrow: { fontSize: 24, lineHeight: 28 },
    title: { fontSize: 17, fontWeight: '600' },
    resetBanner: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 14,
      borderRadius: 10,
      borderWidth: 1,
    },
    resetMsg: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
      borderBottomWidth: 1,
    },
    dayLabel: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
    dayCount: { fontSize: 12 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
    footer: { paddingVertical: 32, alignItems: 'center' },
    footerText: { fontSize: 12 },
  })

export default HistoryScreen
