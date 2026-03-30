import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@/theme'
import { STORAGE_KEYS } from '@/storage/keys'
import OnboardingScreen from '@/screens/OnboardingScreen'
import GardenScreen from '@/screens/GardenScreen'
import HistoryScreen from '@/screens/HistoryScreen'
import SeasonArchiveScreen from '@/screens/SeasonArchiveScreen'

type Screen = 'loading' | 'onboarding' | 'garden' | 'history' | 'archive'

const AppNavigator = () => {
  const [screen, setScreen] = useState<Screen>('loading')
  // Increment to force GardenScreen remount after returning from History or Archive,
  // ensuring it reads fresh data from AsyncStorage instead of showing stale state.
  const [gardenKey, setGardenKey] = useState(0)

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

  const handleBackToGarden = () => {
    setGardenKey(k => k + 1)
    setScreen('garden')
  }

  if (screen === 'history') {
    return <HistoryScreen onBack={handleBackToGarden} />
  }

  if (screen === 'archive') {
    return <SeasonArchiveScreen onBack={handleBackToGarden} />
  }

  return (
    <GardenScreen
      key={gardenKey}
      onNavigateHistory={() => setScreen('history')}
      onNavigateArchive={() => setScreen('archive')}
      onDevReset={__DEV__ ? handleDevReset : undefined}
    />
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
