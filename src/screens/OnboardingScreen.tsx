import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { STORAGE_KEYS } from '@/storage/keys'
import { useWins } from '@/hooks/useWins'
import { usePlants } from '@/hooks/usePlants'
import { useStreak } from '@/hooks/useStreak'
import { useSeasons } from '@/hooks/useSeasons'
import { useAudio } from '@/audio/useAudio'
import GardenCanvas from '@/scenes/grove/GardenCanvas'
import { DEFAULT_SCENE } from '@/scenes'
import { COPY } from '@/constants/copy'
import * as Notifications from 'expo-notifications'
import { scheduleDailyNotification } from '@/notifications/notifications'

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
  const totalSteps = 6

  useEffect(() => {
    playMusic('onboarding')
    return () => {
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

      // Request permission — if denied, continue anyway; user can enable later in Settings
      await Notifications.requestPermissionsAsync().catch(() => {})

      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, time)
      await scheduleDailyNotification(time, 0) // 0 wins at onboarding time
    }

    setStep(5)
  }

  const handlePlantFirstWin = async () => {
    if (!winText.trim() || !currentSeason) return

    const win = await addWin(winText.trim(), winEmoji, currentSeason.id)
    await growPlant(win.id, currentSeason.id)
    await updateStreak()
    setStep(6)
  }

  const handleComplete = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true')
    onComplete()
  }

  const renderTopBar = ({
    currentStep,
    title,
    showBack = true,
    onBack,
  }: {
    currentStep: number
    title: string
    showBack?: boolean
    onBack?: () => void
  }) => {
    return (
      <View style={s.topBarWrap}>
        <View style={s.topBarRow}>
          <TouchableOpacity
            style={[
              s.backBtn,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
                opacity: showBack ? 1 : 0,
              },
            ]}
            onPress={onBack}
            disabled={!showBack}
            activeOpacity={0.85}
          >
            <Text style={[s.backBtnText, { color: theme.text.primary }]}>←</Text>
          </TouchableOpacity>

          <Text style={[s.topBarTitle, { color: theme.text.secondary }]}>
            Step {currentStep} of {totalSteps}
          </Text>

          <View style={s.backBtnGhost} />
        </View>

        <View style={s.progressTrack}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const filled = index < currentStep
            return (
              <View
                key={index}
                style={[
                  s.progressSegment,
                  {
                    backgroundColor: filled
                      ? theme.brand.mid
                      : theme.background.tertiary,
                    opacity: filled ? 1 : 0.7,
                  },
                ]}
              />
            )
          })}
        </View>

        <Text style={[s.topQuestion, { color: theme.text.primary }]}>{title}</Text>
      </View>
    )
  }

  if (step === 1) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

        <View style={s.heroWrap}>
          <View
            style={[
              s.heroGlow,
              {
                backgroundColor: theme.brand.mid,
                opacity: 0.12,
              },
            ]}
          />

          <View
            style={[
              s.heroCard,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <View
              style={[
                s.kickerBadge,
                {
                  backgroundColor: theme.background.tertiary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={[s.kickerBadgeText, { color: theme.text.secondary }]}>
                {COPY.onboarding.hero.kicker}
              </Text>
            </View>

            <Text style={[s.appNameHero, { color: theme.text.primary }]}>{COPY.onboarding.hero.appName}</Text>

            <Text style={[s.heroTitle, { color: theme.text.primary }]}>
              {COPY.onboarding.hero.title}
            </Text>

            <Text style={[s.heroSubtitle, { color: theme.text.secondary }]}>
              {COPY.onboarding.hero.subtitle}
            </Text>

            <View style={s.featurePills}>
              <View
                style={[
                  s.featurePill,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={s.featureEmoji}>🌱</Text>
                <Text style={[s.featureText, { color: theme.text.primary }]}>{COPY.onboarding.features.wins}</Text>
              </View>

              <View
                style={[
                  s.featurePill,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={s.featureEmoji}>🔥</Text>
                <Text style={[s.featureText, { color: theme.text.primary }]}>{COPY.onboarding.features.streaks}</Text>
              </View>

              <View
                style={[
                  s.featurePill,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={s.featureEmoji}>🪴</Text>
                <Text style={[s.featureText, { color: theme.text.primary }]}>{COPY.onboarding.features.grow}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.heroPrimaryBtn, { backgroundColor: theme.brand.mid }]}
              onPress={() => setStep(2)}
              activeOpacity={0.9}
            >
              <Text style={[s.heroPrimaryBtnText, { color: theme.text.inverse }]}>
                {COPY.onboarding.cta.start}
              </Text>
            </TouchableOpacity>

            <Text style={[s.heroFootnote, { color: theme.text.tertiary }]}>
              {COPY.onboarding.hero.footnote}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (step === 2) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

        <View style={s.stepShell}>
          {renderTopBar({
            currentStep: 2,
            title: COPY.onboarding.stepTitles.step2,
            showBack: true,
            onBack: () => setStep(1),
          })}

          <View
            style={[
              s.stepCard,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <View
              style={[
                s.inspoBadge,
                {
                  backgroundColor: theme.background.tertiary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={s.inspoBadgeEmoji}>🌤️</Text>
              <Text style={[s.inspoBadgeText, { color: theme.text.secondary }]}>
                {COPY.onboarding.step2.badge}
              </Text>
            </View>

            <Text style={[s.inspoTitle, { color: theme.text.primary }]}>
              {COPY.onboarding.step2.title}
            </Text>

            <Text style={[s.inspoBody, { color: theme.text.secondary }]}>
              {COPY.onboarding.step2.body1}
            </Text>

            <Text style={[s.inspoBody, { color: theme.text.secondary }]}>
              {COPY.onboarding.step2.body2}
            </Text>

            <View
              style={[
                s.inspoQuoteCard,
                {
                  backgroundColor: theme.background.tertiary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={[s.inspoQuote, { color: theme.text.primary }]}>
                {COPY.onboarding.step2.quote}
              </Text>
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: theme.brand.mid }]}
              onPress={() => setStep(3)}
              activeOpacity={0.9}
            >
              <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
                {COPY.onboarding.step2.cta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (step === 3) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

        <View style={s.stepShell}>
          {renderTopBar({
            currentStep: 3,
            title: COPY.onboarding.stepTitles.step3,
            showBack: true,
            onBack: () => setStep(2),
          })}

          <View
            style={[
              s.stepCard,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <View
              style={[
                s.limitBadge,
                {
                  backgroundColor: theme.background.tertiary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={s.limitBadgeEmoji}>🌱</Text>
              <Text style={[s.limitBadgeText, { color: theme.text.secondary }]}>
                {COPY.onboarding.step3.badge}
              </Text>
            </View>

            <Text style={[s.limitTitle, { color: theme.text.primary }]}>
              {COPY.onboarding.step3.title}
            </Text>

            <Text style={[s.limitBody, { color: theme.text.secondary }]}>
              {COPY.onboarding.step3.body}
            </Text>

            <View style={s.limitPoints}>
              <View
                style={[
                  s.limitPointCard,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={s.limitPointEmoji}>✨</Text>
                <View style={s.limitPointTextWrap}>
                  <Text style={[s.limitPointTitle, { color: theme.text.primary }]}>
                    {COPY.onboarding.step3.point1Title}
                  </Text>
                  <Text style={[s.limitPointSub, { color: theme.text.secondary }]}>
                    {COPY.onboarding.step3.point1Sub}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  s.limitPointCard,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={s.limitPointEmoji}>🌙</Text>
                <View style={s.limitPointTextWrap}>
                  <Text style={[s.limitPointTitle, { color: theme.text.primary }]}>
                    {COPY.onboarding.step3.point2Title}
                  </Text>
                  <Text style={[s.limitPointSub, { color: theme.text.secondary }]}>
                    {COPY.onboarding.step3.point2Sub}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                s.limitQuoteCard,
                {
                  backgroundColor: theme.background.tertiary,
                  borderColor: theme.ui.border,
                },
              ]}
            >
              <Text style={[s.limitQuote, { color: theme.text.primary }]}>
                {COPY.onboarding.step3.quote}
              </Text>
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: theme.brand.mid }]}
              onPress={() => setStep(4)}
              activeOpacity={0.9}
            >
              <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
                {COPY.onboarding.step3.cta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (step === 4) {
    const options: { key: NotifOption; label: string; sub: string; emoji: string }[] = [
      { key: 'morning', label: COPY.onboarding.step4.options.morning.label, sub: COPY.onboarding.step4.options.morning.sub, emoji: '🌤️' },
      { key: 'evening', label: COPY.onboarding.step4.options.evening.label, sub: COPY.onboarding.step4.options.evening.sub, emoji: '🌙' },
      { key: 'custom', label: COPY.onboarding.step4.options.custom.label, sub: COPY.onboarding.step4.options.custom.sub, emoji: '⏰' },
      { key: 'skip', label: COPY.onboarding.step4.options.skip.label, sub: COPY.onboarding.step4.options.skip.sub, emoji: '🤫' },
    ]

    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

        <View style={s.stepShell}>
          {renderTopBar({
            currentStep: 4,
            title: COPY.onboarding.stepTitles.step4,
            showBack: true,
            onBack: () => setStep(3),
          })}

          <View
            style={[
              s.stepCard,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <Text style={[s.stepLead, { color: theme.text.secondary }]}>
              {COPY.onboarding.step4.lead}
            </Text>

            <View style={s.optionListLarge}>
              {options.map(opt => {
                const selected = notifOption === opt.key

                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      s.optionCard,
                      {
                        borderColor: selected ? theme.brand.mid : theme.ui.border,
                        backgroundColor: selected
                          ? theme.background.tertiary
                          : theme.background.primary,
                      },
                    ]}
                    onPress={() => setNotifOption(opt.key)}
                    activeOpacity={0.9}
                  >
                    <View style={s.optionLeft}>
                      <View
                        style={[
                          s.optionEmojiWrap,
                          {
                            backgroundColor: theme.background.secondary,
                            borderColor: theme.ui.border,
                          },
                        ]}
                      >
                        <Text style={s.optionEmoji}>{opt.emoji}</Text>
                      </View>

                      <View style={s.optionTextWrap}>
                        <Text style={[s.optionCardTitle, { color: theme.text.primary }]}>
                          {opt.label}
                        </Text>
                        <Text style={[s.optionCardSub, { color: theme.text.secondary }]}>
                          {opt.sub}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        s.radioOuter,
                        {
                          borderColor: selected ? theme.brand.mid : theme.ui.border,
                        },
                      ]}
                    >
                      {selected && (
                        <View
                          style={[
                            s.radioInner,
                            {
                              backgroundColor: theme.brand.mid,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            {notifOption === 'custom' && (
              <View
                style={[
                  s.inlineInputCard,
                  {
                    backgroundColor: theme.background.tertiary,
                    borderColor: theme.ui.border,
                  },
                ]}
              >
                <Text style={[s.inlineInputLabel, { color: theme.text.secondary }]}>
                  Reminder time
                </Text>
                <TextInput
                  style={[
                    s.timeInput,
                    {
                      backgroundColor: theme.background.primary,
                      color: theme.text.primary,
                      borderColor: theme.ui.border,
                    },
                  ]}
                  placeholder="HH:MM   e.g. 21:00"
                  placeholderTextColor={theme.text.tertiary}
                  value={customTime}
                  onChangeText={setCustomTime}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            )}

            <TouchableOpacity
              style={[
                s.primaryBtn,
                { backgroundColor: theme.brand.mid },
                !notifOption && { opacity: 0.45 },
              ]}
              onPress={handleNotifNext}
              disabled={!notifOption}
              activeOpacity={0.9}
            >
              <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>{COPY.onboarding.step4.cta}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (step === 5) {
    return (
      <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={s.stepShell}>
                  {renderTopBar({
                    currentStep: 5,
                    title: COPY.onboarding.stepTitles.step5,
                    showBack: true,
                    onBack: () => setStep(4),
                  })}

                  <View
                    style={[
                      s.stepCard,
                      {
                        backgroundColor: theme.background.secondary,
                        borderColor: theme.ui.border,
                      },
                    ]}
                  >
                    <Text style={[s.stepLead, { color: theme.text.secondary }]}>
                      {COPY.onboarding.step5.lead}
                    </Text>

                    <View
                      style={[
                        s.pickedEmojiCard,
                        {
                          backgroundColor: theme.background.tertiary,
                          borderColor: theme.ui.border,
                        },
                      ]}
                    >
                      <Text style={s.pickedEmojiLarge}>{winEmoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.pickedEmojiTitle, { color: theme.text.primary }]}>
                          {COPY.onboarding.step5.emojiPickerTitle}
                        </Text>
                        <Text style={[s.pickedEmojiSub, { color: theme.text.secondary }]}>
                          {COPY.onboarding.step5.emojiPickerSub}
                        </Text>
                      </View>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={s.emojiScroll}
                      contentContainerStyle={s.emojiRow}
                      keyboardShouldPersistTaps="handled"
                    >
                      {QUICK_EMOJIS.map(e => {
                        const selected = winEmoji === e
                        return (
                          <TouchableOpacity
                            key={e}
                            style={[
                              s.emojiBtn,
                              {
                                borderColor: selected ? theme.brand.mid : theme.ui.border,
                                backgroundColor: selected
                                  ? theme.background.tertiary
                                  : theme.background.primary,
                              },
                            ]}
                            onPress={() => {
                              Keyboard.dismiss()
                              setWinEmoji(e)
                            }}
                            activeOpacity={0.9}
                          >
                            <Text style={s.emojiText}>{e}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>

                    <View
                      style={[
                        s.inputCard,
                        {
                          backgroundColor: theme.background.tertiary,
                          borderColor: theme.ui.border,
                        },
                      ]}
                    >
                      <Text style={[s.inlineInputLabel, { color: theme.text.secondary }]}>
                        {COPY.onboarding.step5.inputLabel}
                      </Text>

                      <TextInput
                        style={[
                          s.input,
                          {
                            backgroundColor: theme.background.primary,
                            color: theme.text.primary,
                            borderColor: theme.ui.border,
                          },
                        ]}
                        placeholder={COPY.onboarding.step5.placeholder}
                        placeholderTextColor={theme.text.tertiary}
                        value={winText}
                        onChangeText={setWinText}
                        multiline
                        maxLength={200}
                        returnKeyType="done"
                        blurOnSubmit
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        s.primaryBtn,
                        { backgroundColor: theme.brand.mid },
                        !winText.trim() && { opacity: 0.45 },
                      ]}
                      onPress={() => {
                        Keyboard.dismiss()
                        handlePlantFirstWin()
                      }}
                      disabled={!winText.trim()}
                      activeOpacity={0.9}
                    >
                      <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
                        {COPY.onboarding.step5.cta}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: theme.background.primary }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

      <View style={s.stepShell}>
        {renderTopBar({
          currentStep: 6,
          title: COPY.onboarding.stepTitles.step6,
          showBack: false,
        })}

        <View style={s.revealWrap}>
          <View
            style={[
              s.statsRow,
              {
                backgroundColor: theme.stats.statsBg,
                borderColor: theme.ui.border,
              },
            ]}
          >
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

          <View
            style={[
              s.gardenFrame,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <GardenCanvas
              width={width}
              height={height * 0.5}
              colors={DEFAULT_SCENE.getColors(theme)}
              theme={theme}
              plants={plants}
              wins={wins}
            />
          </View>

          <View
            style={[
              s.revealCard,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.ui.border,
              },
            ]}
          >
            <Text style={[s.revealTitle, { color: theme.text.primary }]}>
              {COPY.onboarding.step6.title}
            </Text>
            <Text style={[s.revealSub, { color: theme.text.secondary }]}>
              {COPY.onboarding.step6.sub}
            </Text>

            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: theme.brand.mid }]}
              onPress={handleComplete}
              activeOpacity={0.9}
            >
              <Text style={[s.primaryBtnText, { color: theme.text.inverse }]}>
                {COPY.onboarding.step6.cta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    heroWrap: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 22,
      paddingVertical: 24,
    },
    heroGlow: {
      position: 'absolute',
      top: '18%',
      left: '15%',
      width: 220,
      height: 220,
      borderRadius: 999,
    },
    heroCard: {
      borderRadius: 28,
      borderWidth: 1,
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 20,
      gap: 16,
      overflow: 'hidden',
    },
    kickerBadge: {
      alignSelf: 'flex-start',
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    kickerBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    appNameHero: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    heroTitle: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '700',
      letterSpacing: -1.1,
    },
    heroSubtitle: {
      fontSize: 16,
      lineHeight: 24,
    },
    featurePills: {
      gap: 10,
      marginTop: 4,
      marginBottom: 6,
    },
    featurePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    featureEmoji: {
      fontSize: 18,
    },
    featureText: {
      fontSize: 15,
      fontWeight: '600',
    },
    heroPrimaryBtn: {
      borderRadius: 18,
      paddingVertical: 17,
      alignItems: 'center',
      marginTop: 8,
    },
    heroPrimaryBtnText: {
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    heroFootnote: {
      fontSize: 13,
      textAlign: 'center',
      marginTop: 2,
    },

    stepShell: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 28,
    },
    topBarWrap: {
      gap: 14,
      marginBottom: 16,
    },
    topBarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backBtnGhost: {
      width: 42,
      height: 42,
    },
    backBtnText: {
      fontSize: 20,
      fontWeight: '700',
      marginTop: -1,
    },
    topBarTitle: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    progressTrack: {
      flexDirection: 'row',
      gap: 8,
    },
    progressSegment: {
      flex: 1,
      height: 8,
      borderRadius: 999,
    },
    topQuestion: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '700',
      letterSpacing: -0.7,
    },

    stepCard: {
      borderRadius: 26,
      borderWidth: 1,
      padding: 18,
      gap: 16,
    },
    stepLead: {
      fontSize: 15,
      lineHeight: 22,
    },

    inspoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 10,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    inspoBadgeEmoji: {
      fontSize: 16,
    },
    inspoBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    inspoTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      letterSpacing: -0.6,
    },
    inspoBody: {
      fontSize: 16,
      lineHeight: 24,
    },
    inspoQuoteCard: {
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 18,
      marginTop: 4,
    },
    inspoQuote: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.2,
    },

    limitBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 10,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    limitBadgeEmoji: {
      fontSize: 16,
    },
    limitBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    limitTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      letterSpacing: -0.6,
    },
    limitBody: {
      fontSize: 16,
      lineHeight: 24,
    },
    limitPoints: {
      gap: 12,
    },
    limitPointCard: {
      borderRadius: 18,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    limitPointEmoji: {
      fontSize: 20,
      marginTop: 1,
    },
    limitPointTextWrap: {
      flex: 1,
      gap: 3,
    },
    limitPointTitle: {
      fontSize: 15,
      fontWeight: '700',
    },
    limitPointSub: {
      fontSize: 13,
      lineHeight: 18,
    },
    limitQuoteCard: {
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 18,
      marginTop: 2,
    },
    limitQuote: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.2,
    },

    optionListLarge: {
      gap: 12,
    },
    optionCard: {
      borderRadius: 18,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
    },
    optionLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    optionEmojiWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionEmoji: {
      fontSize: 22,
    },
    optionTextWrap: {
      flex: 1,
      gap: 2,
    },
    optionCardTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    optionCardSub: {
      fontSize: 13,
      lineHeight: 18,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 999,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },

    inlineInputCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      gap: 10,
    },
    inlineInputLabel: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    timeInput: {
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 16,
    },

    pickedEmojiCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    pickedEmojiLarge: {
      fontSize: 28,
    },
    pickedEmojiTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 2,
    },
    pickedEmojiSub: {
      fontSize: 13,
      lineHeight: 18,
    },

    emojiScroll: {
      flexGrow: 0,
    },
    emojiRow: {
      flexDirection: 'row',
      gap: 10,
      paddingRight: 4,
    },
    emojiBtn: {
      width: 52,
      height: 52,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiText: {
      fontSize: 24,
    },

    inputCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      gap: 10,
    },
    input: {
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
      fontSize: 16,
      minHeight: 120,
      textAlignVertical: 'top',
      lineHeight: 22,
    },

    primaryBtn: {
      borderRadius: 18,
      paddingVertical: 17,
      alignItems: 'center',
      marginTop: 2,
    },
    primaryBtnText: {
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.2,
    },

    revealWrap: {
      flex: 1,
      gap: 14,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 20,
      borderWidth: 1,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      fontSize: 30,
      fontWeight: '700',
    },
    statLabel: {
      fontSize: 11,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.9,
    },
    statDivider: {
      width: 1,
      height: 38,
      marginHorizontal: 12,
    },
    gardenFrame: {
      flex: 1,
      minHeight: 260,
      borderRadius: 26,
      borderWidth: 1,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    revealCard: {
      borderRadius: 24,
      borderWidth: 1,
      padding: 18,
      gap: 10,
    },
    revealTitle: {
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: -0.4,
    },
    revealSub: {
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 4,
    },
  })

export default OnboardingScreen