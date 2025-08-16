import { useColorScheme as useDeviceColorScheme } from 'react-native'

export function useColorScheme() {
  const systemColorScheme = useDeviceColorScheme()
  return systemColorScheme
}
