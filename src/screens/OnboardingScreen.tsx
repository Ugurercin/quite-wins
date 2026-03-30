import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { STORAGE_KEYS } from '@/storage/keys'
import { useWins } from '@/hooks/useWins'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import { useSeasons } from '@/hooks/useSeasons'
import { useAudio } from '@/audio/useAudio'
import GardenCanvas from '@/components/garden/GardenCanvas'

const QUICK_EMOJIS = ['✨', '💪', '📚', '🎯', '🏃', '⭐', '❤️', '🚀', '🌟', '🎉']

type NotifOption = 'morning' | 'evening' | 'custom' | 'skip'

interface Props {
  onComplete: () => void
}

const OnboardingScreen = ({ onComplete }: Props) => {
  const { theme } = useTheme()
  const { width, height } = useWindowDimensions()
  const { wins, addWin } = useWins()
  const { plants, growPlant } = usePlants()
  const { updateStreak } = useStreak()
  const { getCurrentSeason } = useSeasons()
  const { playMusic, stopMusic } = useAudio()

  const [step, setStep] = useState(1)
  const [notifOption, setNotifOption] = useState<NotifOption | null>(null)
  const [customTime, setCustomTime] = useState('')
  const [winText, setWinText] = useState('')
  const [winEmoji, setWinEmoji] = useState('✨')

  const currentSeason = getCurrentSeason()
  const s = makeStyles(theme)

  // Start onboarding music as soon as the screen mounts
  useEffect(() => {
    playMusic('onboarding')
    return () => {
      // Stop music when onboarding unmounts (garden screen takes over)
      stopMusic()
    }
  }, [])

  const handleNotifNext = async () => {
    if (!notifOption) return
    if (notifOption !== 'skip') {
      const time =
        notifOption === 'morning'
          ? '09:00'
          : notifOption === 'evening'
          ? '20:00'
          : customTime || '20:00'
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, time)
    }
    setStep(3)
  }

  const handlePlantFirstWin = async () => {
    if (!winText.trim() || !currentSeason) return
    const win = await addWin(winText.trim(), winEmoji, currentSeason.id)
    await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setStep(4)
  }

  const handleComplete = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true')
    // stopMusic is called by the useEffect cleanup above when this component unmounts
    onComplete()
  }

  // Step 1 — Hook
  if (step === 1) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
        <View style={s.centerContent}>
          <Text style={[s.appName, { color: theme.text.primary }]}>Quiet Wins</Text>
          <Text style={[s.tagline, { color: theme.text.secondary }]}>
            The small stuff adds up.
          </Text>
          <TouchableOpacity
            style={[s.primaryBtn, { backgroundColor: theme.brand.mid }]}
            onPress={() => setStep(2)}
          >
            <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
              Get started
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Step 2 — Notification time
  if (step === 2) {
    const options: { key: NotifOption; label: string; sub: string }[] = [
      { key: 'morning', label: 'Morning', sub: '9:00 AM' },
      { key: 'evening', label: 'Evening', sub: '8:00 PM' },
      { key: 'custom', label: 'Custom', sub: 'Pick a time' },
      { key: 'skip', label: 'Skip', sub: 'No reminders' },
    ]

    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
        <View style={s.stepContent}>
          <Text style={[s.stepQuestion, { color: theme.text.primary }]}>
            When should we remind you?
          </Text>
          <Text style={[s.stepSub, { color: theme.text.secondary }]}>
            One gentle nudge a day.
          </Text>
          <View style={s.optionList}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  s.optionRow,
                  { borderColor: theme.ui.border, backgroundColor: theme.background.secondary },
                  notifOption === opt.key && {
                    borderColor: theme.brand.mid,
                    backgroundColor: theme.background.tertiary,
                  },
                ]}
                onPress={() => setNotifOption(opt.key)}
              >
                <Text style={[s.optionLabel, { color: theme.text.primary }]}>
                  {opt.label}
                </Text>
                <Text style={[s.optionSub, { color: theme.text.secondary }]}>
                  {opt.sub}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {notifOption === 'custom' && (
            <TextInput
              style={[
                s.timeInput,
                {
                  backgroundColor: theme.background.tertiary,
                  color: theme.text.primary,
                  borderColor: theme.ui.border,
                },
              ]}
              placeholder="HH:MM e.g. 21:00"
              placeholderTextColor={theme.text.tertiary}
              value={customTime}
              onChangeText={setCustomTime}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          )}
          <TouchableOpacity
            style={[
              s.primaryBtn,
              { backgroundColor: theme.brand.mid },
              !notifOption && { opacity: 0.4 },
            ]}
            onPress={handleNotifNext}
            disabled={!notifOption}
          >
            <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Step 3 — First win
  if (step === 3) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
        <View style={s.stepContent}>
          <Text style={[s.stepQuestion, { color: theme.text.primary }]}>
            What's one thing you did today?
          </Text>
          <Text style={[s.stepSub, { color: theme.text.secondary }]}>
            Anything counts. Big or small.
          </Text>

          {/* Emoji row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.emojiScroll}
            contentContainerStyle={s.emojiRow}
          >
            {QUICK_EMOJIS.map(e => (
              <TouchableOpacity
                key={e}
                style={[
                  s.emojiBtn,
                  { borderColor: theme.ui.border },
                  winEmoji === e && {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.brand.mid,
                  },
                ]}
                onPress={() => setWinEmoji(e)}
              >
                <Text style={s.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={[
              s.input,
              {
                backgroundColor: theme.background.tertiary,
                color: theme.text.primary,
                borderColor: theme.ui.border,
              },
            ]}
            placeholder="e.g. Went for a walk, called a friend…"
            placeholderTextColor={theme.text.tertiary}
            value={winText}
            onChangeText={setWinText}
            multiline
            maxLength={200}
          />

          <TouchableOpacity
            style={[
              s.primaryBtn,
              { backgroundColor: theme.brand.mid },
              !winText.trim() && { opacity: 0.4 },
            ]}
            onPress={handlePlantFirstWin}
            disabled={!winText.trim()}
          >
            <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
              Plant it
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Step 4 — Garden reveal
  return (
    <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
      <View style={[s.statsRow, { backgroundColor: theme.stats.statsBg, borderBottomColor: theme.ui.border }]}>
        <View style={s.statItem}>
          <Text style={[s.statNumber, { color: theme.stats.streakText }]}>1</Text>
          <Text style={[s.statLabel, { color: theme.text.secondary }]}>day streak</Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: theme.ui.border }]} />
        <View style={s.statItem}>
          <Text style={[s.statNumber, { color: theme.stats.winsText }]}>1</Text>
          <Text style={[s.statLabel, { color: theme.text.secondary }]}>total wins</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <GardenCanvas
          width={width}
          height={height * 0.6}
          theme={theme}
          plants={plants}
          wins={wins}
        />
      </View>
      <View style={s.step4Footer}>
        <Text style={[s.step4Message, { color: theme.text.secondary }]}>
          It's growing.
        </Text>
        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: theme.brand.mid }]}
          onPress={handleComplete}
        >
          <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
            Go to my garden
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 16,
    },
    stepContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 48,
      gap: 16,
    },
    appName: {
      fontSize: 42,
      fontWeight: '700',
      letterSpacing: -1,
    },
    tagline: {
      fontSize: 18,
      marginBottom: 24,
    },
    stepQuestion: {
      fontSize: 26,
      fontWeight: '600',
      lineHeight: 34,
    },
    stepSub: {
      fontSize: 15,
      marginBottom: 8,
    },
    optionList: {
      gap: 10,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '500',
    },
    optionSub: {
      fontSize: 13,
    },
    timeInput: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
    },
    emojiScroll: {
      flexGrow: 0,
    },
    emojiRow: {
      flexDirection: 'row',
      gap: 8,
    },
    emojiBtn: {
      width: 44,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiText: {
      fontSize: 22,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    primaryBtn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    primaryBtnText: {
      fontSize: 17,
      fontWeight: '600',
    },
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
    step4Footer: {
      padding: 24,
      gap: 12,
      alignItems: 'center',
    },
    step4Message: {
      fontSize: 16,
      fontStyle: 'italic',
    },
  })

export default OnboardingScreen