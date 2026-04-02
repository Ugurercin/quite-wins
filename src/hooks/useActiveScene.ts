import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '@/storage/keys'
import { Scene } from '@/scenes/types'
import { getSceneById } from '@/scenes'

const DEFAULT_SCENE_ID = 'grove'

export const useActiveScene = () => {
  const [activeScene, setActiveSceneState] = useState<Scene>(
    getSceneById(DEFAULT_SCENE_ID),
  )

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SCENE).then(id => {
      if (id) {
        const scene = getSceneById(id)
        if (!scene.locked) setActiveSceneState(scene)
      }
    })
  }, [])

  const setActiveScene = (id: string) => {
    setActiveSceneState(getSceneById(id))
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SCENE, id)
  }

  return { activeScene, setActiveScene }
}
