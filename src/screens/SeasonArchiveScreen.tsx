import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'
import { useSeasons, Season } from '@/hooks/useSeasons'
import { Win } from '@/hooks/useWins'
import { STORAGE_KEYS } from '@/storage/keys'
import SeasonSnapshotModal from '@/screens/SeasonSnapshotModal'

interface Props {
  onBack: () => void
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const SeasonArchiveScreen = ({ onBack }: Props) => {
  const { theme } = useTheme()
  const { seasons, loading } = useSeasons()
  const [allWins, setAllWins] = useState<Win[]>([])
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const s = makeStyles(theme)

  useEffect(() => {
    // Load wins for snapshot rendering
    AsyncStorage.getItem(STORAGE_KEYS.WINS).then(raw => {
      setAllWins(raw ? (JSON.parse(raw) as Win[]) : [])
    })
  }, [])

  const completedSeasons = seasons
    .filter(s => s.completedAt !== null)
    .sort((a, b) => b.number - a.number)

  // Plants are stored in the season record at completion time — before any clearing
  const snapshotPlants = selectedSeason ? (selectedSeason.plantSnapshot ?? []) : []

  const snapshotWins = selectedSeason
    ? allWins.filter(w => w.seasonId === selectedSeason.id)
    : []

  if (loading) {
    return <View style={[s.container, { backgroundColor: theme.background.primary }]} />
  }

  return (
    <View style={[s.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background.primary} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={[s.header, { borderBottomColor: theme.ui.border }]}>
          <TouchableOpacity style={s.backBtn} onPress={onBack} accessibilityLabel="Back">
            <Text style={[s.backArrow, { color: theme.text.secondary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[s.title, { color: theme.text.primary }]}>Past Seasons</Text>
          <View style={s.backBtn} />
        </View>

        {completedSeasons.length === 0 ? (
          <View style={s.empty}>
            <Text style={[s.emptyText, { color: theme.text.tertiary }]}>
              No completed seasons yet.{'\n'}Keep growing.
            </Text>
          </View>
        ) : (
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Text style={[s.intro, { color: theme.text.tertiary }]}>
              Each season is a chapter. Tap one to see what you grew.
            </Text>
            {completedSeasons.map(season => (
              <TouchableOpacity
                key={season.id}
                style={[s.card, { backgroundColor: theme.background.secondary, borderColor: theme.ui.border }]}
                onPress={() => setSelectedSeason(season)}
                activeOpacity={0.75}
              >
                <View style={[s.cardAccent, { backgroundColor: theme.brand.mid }]} />
                <View style={s.cardContent}>
                  <Text style={[s.cardTitle, { color: theme.text.primary }]}>
                    Season {season.number}
                  </Text>
                  <Text style={[s.cardMeta, { color: theme.text.secondary }]}>
                    {formatDate(season.startedAt)} – {formatDate(season.completedAt!)}
                  </Text>
                  <Text style={[s.cardWins, { color: theme.stats.winsText }]}>
                    {season.totalWins} wins grown
                  </Text>
                </View>
                <Text style={[s.cardChevron, { color: theme.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        )}

      </SafeAreaView>

      <SeasonSnapshotModal
        season={selectedSeason}
        plants={snapshotPlants}
        wins={snapshotWins}
        theme={theme}
        onClose={() => setSelectedSeason(null)}
      />
    </View>
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
    intro: { fontSize: 13, textAlign: 'center', paddingHorizontal: 24, paddingVertical: 20, lineHeight: 20 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      overflow: 'hidden',
    },
    cardAccent: { width: 4, alignSelf: 'stretch' },
    cardContent: { flex: 1, paddingHorizontal: 16, paddingVertical: 14 },
    cardTitle: { fontSize: 17, fontWeight: '700' },
    cardMeta: { fontSize: 12, marginTop: 3 },
    cardWins: { fontSize: 13, fontWeight: '600', marginTop: 6 },
    cardChevron: { fontSize: 22, paddingHorizontal: 16 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
  })

export default SeasonArchiveScreen
