import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

let Storage:
  | typeof AsyncStorage
  | {
      setItem: (key: string, value: string) => Promise<void>
      getItem: (key: string) => Promise<string | null>
      removeItem: (key: string) => Promise<void>
    }

if (Platform.OS === 'web') {
  Storage = {
    setItem: async (key: string, value: string) => {
      localStorage.setItem(key, value)
    },
    getItem: async (key: string) => {
      return localStorage.getItem(key)
    },
    removeItem: async (key: string) => {
      localStorage.removeItem(key)
    }
  }
} else {
  Storage = AsyncStorage
}

export default Storage
