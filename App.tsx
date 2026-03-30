import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@/theme'
import { STORAGE_KEYS } from '@/storage/keys'
import OnboardingScreen from '@/screens/OnboardingScreen'
import GardenScreen from '@/screens/GardenScreen'

type Screen = 'loading' | 'onboarding' | 'garden' | 'history'

const AppNavigator = () => {
  const [screen, setScreen] = useState<Screen>('loading')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED).then(value => {
      setScreen(value === 'true' ? 'garden' : 'onboarding')
    })
  }, [])

  if (screen === 'loading') {
    return <View style={{ flex: 1, backgroundColor: '#0D1A0B' }} />
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onComplete={() => setScreen('garden')} />
  }

  const handleDevReset = async () => {
    await AsyncStorage.clear()
    setScreen('onboarding')
  }

  if (screen === 'garden') {
    return (
      <GardenScreen
        onNavigateHistory={() => setScreen('history')}
        onDevReset={__DEV__ ? handleDevReset : undefined}
      />
    )
  }

  // history — placeholder for Phase 3
  return (
    <View style={{ flex: 1, backgroundColor: '#0D1A0B', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#9AB890', fontSize: 16 }}>History — coming in Phase 3</Text>
      <Text
        style={{ color: '#4A8A1A', marginTop: 16, fontSize: 14 }}
        onPress={() => setScreen('garden')}
      >
        ← Back to garden
      </Text>
    </View>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
