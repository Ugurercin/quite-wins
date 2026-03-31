import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { useHistory } from '@/hooks/useHistory'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import SwipeableWinRow from '@/components/SwipeableWinRow'
import { COPY } from '@/constants/copy'

interface Props {
  onBack: () => void
}

const HistoryScreen = ({ onBack }: Props) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const { groups, loading, deleteWin, totalWins } = useHistory()
  const { shrinkPlant } = usePlants()
  const { recalculateStreak, streak } = useStreak()
  const [streakResetMsg, setStreakResetMsg] = useState(false)
  const s = makeStyles(theme)

  const currentStreak =
  typeof streak === 'number'
    ? streak
    : typeof streak?.current === 'number'
      ? streak.current
      : 0

  const handleDeleteWin = async (winId: string) => {
    await deleteWin(winId)
    await shrinkPlant(winId)

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

        <SafeAreaView
          style={s.safeArea}
          edges={['top', 'left', 'right']}
        >
          {/* Header / Hero */}
          <View style={[s.topShell, { borderBottomColor: theme.ui.border }]}>
            <View style={s.headerRow}>
              <TouchableOpacity
                style={[
                  s.backBtn,
                  {
                    backgroundColor: theme.background.secondary,
                    borderColor: theme.ui.border,
                  },
                ]}
                onPress={onBack}
                activeOpacity={0.85}
                accessibilityLabel="Back to garden"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[s.backArrow, { color: theme.text.primary }]}>←</Text>
              </TouchableOpacity>

              <View style={s.headerCenter}>
                <Text style={[s.title, { color: theme.text.primary }]}>History</Text>
                <Text style={[s.subtitle, { color: theme.text.tertiary }]}>
                  {COPY.history.subtitle}
                </Text>
              </View>

              <View style={s.headerRightSpacer} />
            </View>

            <View
              style={[
                s.heroCard,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <View style={s.heroStat}>
                <Text style={[s.heroValue, { color: theme.text.primary }]}>
                  {totalWins}
                </Text>
                <Text style={[s.heroLabel, { color: theme.text.tertiary }]}>
                  Total wins
                </Text>
              </View>

              <View
                style={[
                  s.heroDivider,
                  { backgroundColor: theme.ui.border },
                ]}
              />

              <View style={s.heroStat}>
                <Text style={[s.heroValue, { color: theme.text.primary }]}>
                  {currentStreak}
                </Text>
                <Text style={[s.heroLabel, { color: theme.text.tertiary }]}>
                  Current streak
                </Text>
              </View>
            </View>
          </View>

          {/* Streak reset banner */}
          {streakResetMsg && (
            <View
              style={[
                s.resetBanner,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={[s.resetMsg, { color: theme.text.secondary }]}>
                {COPY.history.streakReset}
              </Text>
            </View>
          )}

          {/* Content */}
          {groups.length === 0 ? (
            <View style={s.empty}>
              <View
                style={[
                  s.emptyCard,
                  {
                    backgroundColor: theme.background.secondary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={[s.emptyTitle, { color: theme.text.primary }]}>
                  {COPY.history.emptyTitle}
                </Text>
                <Text style={[s.emptyText, { color: theme.text.tertiary }]}>
                  {COPY.history.emptyBody}
                </Text>
              </View>
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={s.scroll}
              contentContainerStyle={[s.scrollContent, { paddingBottom: Math.max(insets.bottom, 28) }]}
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {groups.map(group => (
                <View key={group.dateStr} style={s.groupBlock}>
                  <View style={s.dayHeader}>
                    <Text style={[s.dayLabel, { color: theme.text.secondary }]}>
                      {group.label}
                    </Text>
                    <Text style={[s.dayCount, { color: theme.text.tertiary }]}>
                      {group.wins.length} {group.wins.length === 1 ? 'win' : 'wins'}
                    </Text>
                  </View>

                  <View
                    style={[
                      s.groupCard,
                      {
                        backgroundColor: theme.background.secondary,
                        borderColor: theme.ui.border,
                      },
                    ]}
                  >
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
                </View>
              ))}

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
    container: {
      flex: 1,
    },

    safeArea: {
      flex: 1,
    },

    topShell: {
      paddingTop: 12,
      paddingHorizontal: 16,
      paddingBottom: 18,
      borderBottomWidth: 1,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
    },

    backBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    backArrow: {
      fontSize: 22,
      lineHeight: 24,
      fontWeight: '600',
      marginTop: -1,
    },

    headerCenter: {
      flex: 1,
      justifyContent: 'center',
    },

    headerRightSpacer: {
      width: 48,
      height: 48,
      marginLeft: 12,
    },

    title: {
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: 0.2,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
    },

    heroCard: {
      marginTop: 16,
      minHeight: 88,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },

    heroStat: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroValue: {
      fontSize: 24,
      fontWeight: '700',
    },

    heroLabel: {
      marginTop: 4,
      fontSize: 12,
    },

    heroDivider: {
      width: 1,
      alignSelf: 'stretch',
      marginHorizontal: 8,
      opacity: 0.8,
    },

    resetBanner: {
      marginHorizontal: 16,
      marginTop: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
    },

    resetMsg: {
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingTop: 10,
      paddingBottom: 28,
    },

    groupBlock: {
      marginBottom: 8,
    },

    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 10,
    },

    dayLabel: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },

    dayCount: {
      fontSize: 12,
    },

    groupCard: {
      marginHorizontal: 16,
      borderRadius: 18,
      borderWidth: 1,
      overflow: 'hidden',
    },

    empty: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
      paddingBottom: 80,
    },

    emptyCard: {
      width: '100%',
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 24,
      paddingVertical: 30,
      alignItems: 'center',
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
    },

    emptyText: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 24,
    },

    footer: {
      paddingTop: 18,
      paddingBottom: 8,
      alignItems: 'center',
    },

    footerText: {
      fontSize: 12,
    },
  })

export default HistoryScreen