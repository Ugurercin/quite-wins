import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'
import { PlantType } from '@/scenes/grove/plants/plantTypes'

interface Props {
  seasonNumber: number
  totalWins: number
  theme: any
  rewardOptions: PlantType[]
  selectedRewardType: PlantType | null
  onSelectReward: (plantType: PlantType) => void
  onReady: () => void
}

const formatPlantType = (value: PlantType): string => {
  return String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, s => s.toUpperCase())
}

const getPlantEmoji = (value: PlantType): string => {
  const key = String(value).toLowerCase()

  if (key.includes('pine')) return '🌲'
  if (key.includes('oak')) return '🌳'
  if (key.includes('maple')) return '🍁'
  if (key.includes('flower')) return '🌸'
  if (key.includes('blossom')) return '🌸'
  if (key.includes('rose')) return '🌹'
  if (key.includes('mushroom')) return '🍄'
  if (key.includes('fern')) return '🌿'
  if (key.includes('cactus')) return '🌵'
  if (key.includes('bamboo')) return '🎋'
  if (key.includes('palm')) return '🌴'
  if (key.includes('sprout')) return '🌱'

  return '🌿'
}

const PlantRewardPreview = ({
  plantType,
  selected,
  theme,
}: {
  plantType: PlantType
  selected: boolean
  theme: any
}) => {
  const label = formatPlantType(plantType)
  const emoji = useMemo(() => getPlantEmoji(plantType), [plantType])

  return (
    <View
      style={[
        styles.previewCard,
        {
          backgroundColor: selected ? 'rgba(255,255,255,0.12)' : theme.background.primary,
          borderColor: selected ? 'rgba(255,255,255,0.2)' : theme.ui.border,
        },
      ]}
    >
      <View
        style={[
          styles.previewArt,
          {
            backgroundColor: selected
              ? 'rgba(255,255,255,0.14)'
              : theme.background.secondary,
            borderColor: selected
              ? 'rgba(255,255,255,0.16)'
              : theme.ui.border,
          },
        ]}
      >
        <Text style={styles.previewEmoji}>{emoji}</Text>
        <View
          style={[
            styles.previewGround,
            {
              backgroundColor: selected
                ? 'rgba(255,255,255,0.18)'
                : theme.brand.light,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.previewLabel,
          { color: selected ? theme.text.inverse : theme.text.primary },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.previewSubtext,
          {
            color: selected
              ? 'rgba(255,255,255,0.82)'
              : theme.text.tertiary,
          },
        ]}
      >
        Elder reward
      </Text>
    </View>
  )
}

const SeasonRecapOverlay = ({
  seasonNumber,
  totalWins,
  theme,
  rewardOptions,
  selectedRewardType,
  onSelectReward,
  onReady,
}: Props) => {
  const [step, setStep] = useState<'recap' | 'reward'>('recap')

  useEffect(() => {
    if (rewardOptions.length === 1 && !selectedRewardType) {
      onSelectReward(rewardOptions[0])
    }
  }, [rewardOptions, selectedRewardType, onSelectReward])

  const canContinueFromReward =
    rewardOptions.length === 0 || selectedRewardType !== null

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.background.primary,
              borderColor: theme.ui.border,
            },
          ]}
        >
          {step === 'recap' ? (
            <>
              <Text style={[styles.eyebrow, { color: theme.brand.light }]}>
                Season Complete
              </Text>

              <Text style={[styles.title, { color: theme.text.primary }]}>
                You finished Season {seasonNumber}
              </Text>

              <Text style={[styles.body, { color: theme.text.secondary }]}>
                {totalWins} total wins and a whole season of quiet progress.
              </Text>

              <Text style={[styles.body, { color: theme.text.secondary }]}>
                Small things really do add up. You kept showing up, and your garden proves it.
              </Text>

              <Text style={[styles.highlight, { color: theme.text.primary }]}>
                Now choose one tree to preserve as your Elder Tree.
              </Text>

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: theme.brand.mid }]}
                onPress={() => setStep('reward')}
              >
                <Text style={[styles.primaryBtnText, { color: theme.text.inverse }]}>
                  Choose elder tree
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.eyebrow, { color: theme.brand.light }]}>
                Season Reward
              </Text>

              <Text style={[styles.title, { color: theme.text.primary }]}>
                Pick your Elder Tree
              </Text>

              <Text style={[styles.body, { color: theme.text.secondary }]}>
                You earn one elder each season. Choose the tree you want to carry forward.
              </Text>

              <ScrollView
                style={styles.optionsWrap}
                contentContainerStyle={styles.optionsContent}
                showsVerticalScrollIndicator={false}
              >
                {rewardOptions.map(option => {
                  const selected = selectedRewardType === option

                  return (
                    <TouchableOpacity
                      key={String(option)}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: selected
                            ? theme.brand.mid
                            : theme.background.secondary,
                          borderColor: selected
                            ? theme.brand.mid
                            : theme.ui.border,
                        },
                      ]}
                      onPress={() => onSelectReward(option)}
                      activeOpacity={0.85}
                    >
                      <PlantRewardPreview
                        plantType={option}
                        selected={selected}
                        theme={theme}
                      />

                      <View
                        style={[
                          styles.radioOuter,
                          {
                            borderColor: selected
                              ? theme.text.inverse
                              : theme.ui.border,
                          },
                        ]}
                      >
                        {selected && (
                          <View
                            style={[
                              styles.radioInner,
                              { backgroundColor: theme.text.inverse },
                            ]}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.background.secondary,
                      borderColor: theme.ui.border,
                    },
                  ]}
                  onPress={() => setStep('recap')}
                >
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      { color: theme.text.primary },
                    ]}
                  >
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryBtnInline,
                    {
                      backgroundColor: canContinueFromReward
                        ? theme.brand.mid
                        : theme.background.tertiary,
                    },
                  ]}
                  disabled={!canContinueFromReward}
                  onPress={onReady}
                >
                  <Text
                    style={[
                      styles.primaryBtnText,
                      {
                        color: canContinueFromReward
                          ? theme.text.inverse
                          : theme.text.tertiary,
                      },
                    ]}
                  >
                    Start next season
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 18,
  },
  optionsWrap: {
    maxHeight: 320,
    marginTop: 14,
    marginBottom: 18,
  },
  optionsContent: {
    gap: 12,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
  },
  previewArt: {
    height: 92,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  previewEmoji: {
    fontSize: 38,
    marginBottom: 10,
  },
  previewGround: {
    position: 'absolute',
    bottom: 12,
    width: 48,
    height: 8,
    borderRadius: 999,
    opacity: 0.9,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewSubtext: {
    fontSize: 13,
    fontWeight: '500',
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
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 8,
  },
  primaryBtnInline: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryBtn: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
})

export default SeasonRecapOverlay