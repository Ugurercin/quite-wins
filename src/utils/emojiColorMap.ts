import { Theme } from '@/theme/theme'

const AMBER_EMOJIS = ['⭐', '🌟', '✨', '🏆', '💡', '🔥', '🌻']
const PINK_EMOJIS = ['💪', '❤️', '🎉', '🌸', '💝', '🎀']
const PURPLE_EMOJIS = ['📚', '🎯', '🧠', '💜', '🔮', '🎓']
const CORAL_EMOJIS = ['🏃', '⚡', '🚀', '🎸', '🌊', '🍎']

export const emojiToFlowerColor = (emoji: string, theme: Theme): string => {
  if (AMBER_EMOJIS.includes(emoji)) return theme.accent.amber
  if (PINK_EMOJIS.includes(emoji)) return theme.accent.pink
  if (PURPLE_EMOJIS.includes(emoji)) return theme.accent.purple
  if (CORAL_EMOJIS.includes(emoji)) return theme.accent.coral
  return theme.accent.amber
}
