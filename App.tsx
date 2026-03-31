import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@/theme'
import { STORAGE_KEYS } from '@/storage/keys'
import OnboardingScreen from '@/screens/OnboardingScreen'
import GardenScreen from '@/screens/GardenScreen'
import HistoryScreen from '@/screens/HistoryScreen'
import SeasonArchiveScreen from '@/screens/SeasonArchiveScreen'
import SettingsScreen from '@/screens/SettingsScreen'

type Screen = 'loading' | 'onboarding' | 'garden' | 'history' | 'archive' | 'settings'

const AppNavigator = () => {
  const [screen, setScreen] = useState<Screen>('loading')
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

  if (screen === 'settings') {
    return <SettingsScreen onBack={handleBackToGarden} />
  }

  return (
    <GardenScreen
      key={gardenKey}
      onNavigateHistory={() => setScreen('history')}
      onNavigateArchive={() => setScreen('archive')}
      onNavigateSettings={() => setScreen('settings')}
      onDevReset={__DEV__ ? handleDevReset : undefined}
    />
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}