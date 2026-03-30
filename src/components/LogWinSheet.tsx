import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useTheme } from '@/theme'
import { Theme } from '@/theme/theme'

const QUICK_EMOJIS = ['✨', '💪', '📚', '🎯', '🏃', '⭐', '❤️', '🚀', '🌟', '🎉']

interface Props {
  visible: boolean
  todayWinCount: number
  onSubmit: (text: string, emoji: string) => void
  onClose: () => void
}

const LogWinSheet = ({ visible, todayWinCount, onSubmit, onClose }: Props) => {
  const { theme } = useTheme()
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState('✨')

  const atLimit = todayWinCount >= 1000
  const s = makeStyles(theme)

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim(), emoji)
    setText('')
    setEmoji('✨')
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[s.overlay, { backgroundColor: theme.ui.overlay }]} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.sheetWrapper}
      >
        <View style={[s.sheet, { backgroundColor: theme.background.secondary }]}>
          {/* Handle bar */}
          <View style={[s.handle, { backgroundColor: theme.ui.borderStrong }]} />

          {atLimit ? (
            <View style={s.limitMessage}>
              <Text style={[s.limitTitle, { color: theme.text.primary }]}>
                Garden is resting.
              </Text>
              <Text style={[s.limitBody, { color: theme.text.secondary }]}>
                You've planted 3 wins today. Come back tomorrow.
              </Text>
              <TouchableOpacity
                style={[s.closeBtn, { borderColor: theme.ui.borderStrong }]}
                onPress={onClose}
              >
                <Text style={[s.closeBtnText, { color: theme.text.secondary }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[s.heading, { color: theme.text.primary }]}>
                What did you win today?
              </Text>

              {/* Emoji quick-pick */}
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
                      emoji === e && { backgroundColor: theme.background.tertiary, borderColor: theme.brand.mid },
                    ]}
                    onPress={() => setEmoji(e)}
                  >
                    <Text style={s.emojiText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Text input */}
              <TextInput
                style={[
                  s.input,
                  {
                    backgroundColor: theme.background.tertiary,
                    color: theme.text.primary,
                    borderColor: theme.ui.border,
                  },
                ]}
                placeholder="e.g. Finally got out for a walk"
                placeholderTextColor={theme.text.tertiary}
                value={text}
                onChangeText={setText}
                multiline
                maxLength={200}
                returnKeyType="done"
                blurOnSubmit
              />

              {/* Plant it button */}
              <TouchableOpacity
                style={[
                  s.plantBtn,
                  { backgroundColor: theme.brand.mid },
                  !text.trim() && { opacity: 0.4 },
                ]}
                onPress={handleSubmit}
                disabled={!text.trim()}
              >
                <Text style={[s.plantBtnText, { color: theme.text.inverse }]}>
                  Plant it
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    sheetWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    sheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 24,
      paddingBottom: 40,
      paddingTop: 12,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
    },
    emojiScroll: {
      marginBottom: 16,
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
      marginBottom: 20,
    },
    plantBtn: {
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
    },
    plantBtnText: {
      fontSize: 17,
      fontWeight: '600',
    },
    limitMessage: {
      paddingVertical: 24,
      alignItems: 'center',
      gap: 12,
    },
    limitTitle: {
      fontSize: 20,
      fontWeight: '600',
    },
    limitBody: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },
    closeBtn: {
      marginTop: 8,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
    },
    closeBtnText: {
      fontSize: 15,
    },
  })

export default LogWinSheet
