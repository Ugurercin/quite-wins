import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  TextInput,
  Linking,
  Platform,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { useAudio } from '@/audio/useAudio'
import { STORAGE_KEYS } from '@/storage/keys'
import { Theme } from '@/theme/theme'
import { COPY } from '@/constants/copy'
import { scheduleDailyNotification } from '@/notifications/notifications'

// expo-constants is a standard Expo transitive dep — install with: npx expo install expo-constants
let appVersion = '1.0.0'
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Constants = require('expo-constants').default
  appVersion = Constants.expoConfig?.version ?? appVersion
} catch (_) {}

type ThemeMode = 'system' | 'light' | 'dark'

interface Props {
  onBack: () => void
}

const SettingsScreen = ({ onBack }: Props) => {
  const { theme, mode, setMode } = useTheme()
  const { stopMusic } = useAudio()
  const insets = useSafeAreaInsets()
  const s = makeStyles(theme)

  const [musicEnabled, setMusicEnabled] = useState(true)
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [notifTime, setNotifTime] = useState('20:00')
  const [editingTime, setEditingTime] = useState(false)
  const [timeInput, setTimeInput] = useState('')

  useEffect(() => {
    AsyncStorage.multiGet([
      STORAGE_KEYS.MUSIC_ENABLED,
      STORAGE_KEYS.SFX_ENABLED,
      STORAGE_KEYS.NOTIFICATION_TIME,
    ]).then(pairs => {
      const music = pairs[0][1]
      const sfx = pairs[1][1]
      const time = pairs[2][1]
      if (music !== null) setMusicEnabled(music === 'true')
      if (sfx !== null) setSfxEnabled(sfx === 'true')
      if (time) setNotifTime(time)
    })
  }, [])

  const handleMusicToggle = async (val: boolean) => {
    setMusicEnabled(val)
    await AsyncStorage.setItem(STORAGE_KEYS.MUSIC_ENABLED, String(val))
    if (!val) stopMusic()
  }

  const handleSfxToggle = async (val: boolean) => {
    setSfxEnabled(val)
    await AsyncStorage.setItem(STORAGE_KEYS.SFX_ENABLED, String(val))
  }

  const handleSaveTime = async () => {
    const trimmed = timeInput.trim()
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      setNotifTime(trimmed)
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, trimmed)

      const winsRaw = await AsyncStorage.getItem(STORAGE_KEYS.WINS)
      const wins = winsRaw ? JSON.parse(winsRaw) : []
      const today = new Date().toISOString().split('T')[0]
      const todayWinCount = wins.filter((w: any) => w.createdAt.startsWith(today)).length
      await scheduleDailyNotification(trimmed, todayWinCount)
    }
    setEditingTime(false)
  }

  return (
    <SafeAreaView
      style={[s.screen, { backgroundColor: theme.background.primary }]}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />

      <View style={s.header}>
        <TouchableOpacity
          style={[s.backBtn, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.85}
        >
          <Text style={[s.backArrow, { color: theme.text.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[s.title, { color: theme.text.primary }]}>Settings</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Sound ── */}
        <SectionLabel text={COPY.settings.sections.sound} theme={theme} s={s} />
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          <ToggleRow label={COPY.settings.rows.music} value={musicEnabled} onChange={handleMusicToggle} theme={theme} s={s} />
          <View style={[s.divider, { backgroundColor: theme.ui.border }]} />
          <ToggleRow label={COPY.settings.rows.sfx} value={sfxEnabled} onChange={handleSfxToggle} theme={theme} s={s} />
        </View>

        {/* ── Preferences ── */}
        <SectionLabel text={COPY.settings.sections.preferences} theme={theme} s={s} />
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          {/* Notification time */}
          <TouchableOpacity
            style={s.row}
            onPress={() => { setTimeInput(notifTime); setEditingTime(true) }}
            activeOpacity={0.8}
          >
            <Text style={[s.rowLabel, { color: theme.text.primary }]}>{COPY.settings.rows.notifTime}</Text>
            {editingTime ? (
              <View style={s.timeEditRow}>
                <TextInput
                  style={[s.timeInput, {
                    color: theme.text.primary,
                    borderColor: theme.ui.borderStrong,
                    backgroundColor: theme.background.tertiary,
                  }]}
                  value={timeInput}
                  onChangeText={setTimeInput}
                  keyboardType="numbers-and-punctuation"
                  autoFocus
                  onBlur={handleSaveTime}
                  onSubmitEditing={handleSaveTime}
                  returnKeyType="done"
                />
                <TouchableOpacity onPress={handleSaveTime}>
                  <Text style={[s.saveLabel, { color: theme.brand.mid }]}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[s.rowValue, { color: theme.text.secondary }]}>{notifTime} →</Text>
            )}
          </TouchableOpacity>

          <View style={[s.divider, { backgroundColor: theme.ui.border }]} />

          {/* Theme */}
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: theme.text.primary }]}>{COPY.settings.rows.theme}</Text>
            <View style={[s.segmented, { backgroundColor: theme.background.tertiary, borderColor: theme.ui.border }]}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[s.segment, mode === m && { backgroundColor: theme.brand.mid }]}
                  onPress={() => setMode(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.segmentText, { color: mode === m ? theme.text.inverse : theme.text.secondary }]}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Connect ── */}
        <SectionLabel text={COPY.settings.sections.connect} theme={theme} s={s} />
        <View style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}>
          <LinkRow label={COPY.settings.rows.feedback} url="mailto:YOUR@EMAIL.com" theme={theme} s={s} />
          <View style={[s.divider, { backgroundColor: theme.ui.border }]} />
          <LinkRow label={COPY.settings.rows.newsletter} url="YOUR_NEWSLETTER_URL" theme={theme} s={s} />
          <View style={[s.divider, { backgroundColor: theme.ui.border }]} />
          <LinkRow label={COPY.settings.rows.social} url="YOUR_X_URL" theme={theme} s={s} />
          <View style={[s.divider, { backgroundColor: theme.ui.border }]} />
          <LinkRow
            label={COPY.settings.rows.review}
            url={Platform.OS === 'ios' ? 'YOUR_APP_STORE_URL' : 'YOUR_PLAY_STORE_URL'}
            theme={theme}
            s={s}
          />
        </View>

        <Text style={[s.version, { color: theme.text.tertiary }]}>v{appVersion}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

type S = ReturnType<typeof makeStyles>

const SectionLabel = ({ text, theme, s }: { text: string; theme: Theme; s: S }) => (
  <Text style={[s.sectionLabel, { color: theme.text.secondary }]}>{text}</Text>
)

const ToggleRow = ({
  label, value, onChange, theme, s,
}: { label: string; value: boolean; onChange: (v: boolean) => void; theme: Theme; s: S }) => (
  <View style={s.row}>
    <Text style={[s.rowLabel, { color: theme.text.primary }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: theme.ui.border, true: theme.brand.mid }}
      thumbColor={theme.text.primary}
    />
  </View>
)

const LinkRow = ({
  label, url, theme, s,
}: { label: string; url: string; theme: Theme; s: S }) => (
  <TouchableOpacity style={s.row} onPress={() => Linking.openURL(url)} activeOpacity={0.8}>
    <Text style={[s.rowLabel, { color: theme.text.primary }]}>{label}</Text>
    <Text style={{ color: theme.text.tertiary, fontSize: 16 }}>↗</Text>
  </TouchableOpacity>
)

// ─── Styles ──────────────────────────────────────────────────────────────────

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backArrow: { fontSize: 22, fontWeight: '600' },
    title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
    headerSpacer: { width: 44 },
    content: { paddingHorizontal: 16, paddingTop: 4 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginTop: 20,
      marginBottom: 8,
      marginLeft: 4,
    },
    card: {
      borderRadius: 18,
      borderWidth: 1,
      overflow: 'hidden',
    },
    divider: { height: 1, marginLeft: 16 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      minHeight: 52,
    },
    rowLabel: { fontSize: 15, fontWeight: '500' },
    rowValue: { fontSize: 14 },
    timeEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: 14,
      width: 70,
      textAlign: 'center',
    },
    saveLabel: { fontSize: 14, fontWeight: '600' },
    segmented: {
      flexDirection: 'row',
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
    },
    segment: { paddingHorizontal: 10, paddingVertical: 6 },
    segmentText: { fontSize: 13, fontWeight: '600' },
    version: { textAlign: 'center', fontSize: 12, marginTop: 28 },
  })

export default SettingsScreen
