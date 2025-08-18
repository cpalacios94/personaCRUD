jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('@/services/storage/AsyncStorageService', () => ({
  AsyncStorageService: {
    getAll: jest.fn(() => Promise.resolve([])),
    create: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios)
  },
  StyleSheet: {
    create: jest.fn((style) => style),
    flatten: jest.fn((style) => style)
  },
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Button: 'Button',
  Image: 'Image',
  Modal: 'Modal',
  FlatList: 'FlatList',
  Alert: {
    alert: jest.fn()
  },
  NativeModules: {
    DevMenu: {
      getEnforcing: jest.fn()
    }
  },
  ProgressBarAndroid: 'ProgressBarAndroid',
  Clipboard: 'Clipboard',
  Animated: {
    timing: jest.fn(() => ({ start: jest.fn() })),
    Value: jest.fn(() => ({ interpolate: jest.fn() }))
  },
  findNodeHandle: jest.fn()
}))

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View')
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5
    },
    Directions: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    GestureHandlerRootView: View,
    gestureHandlerRootHOC: (Component) => Component,
    NativeViewGestureHandler: View,
    RNView: View,
    ScrollView: View,
    FlatList: View,
    Switch: View,
    TextInput: View,
    DrawerLayoutAndroid: View,
    VerticalSwipeable: View,
    HorizontalSwipeable: View,
    CustomGestureHandler: View,
    GestureDetector: View,
    Gesture: {
      Pan: jest.fn(() => ({ onEnd: jest.fn() }))
    }
  }
})

jest.mock('react-native-reanimated', () => ({
  // Mock any functions or components that are used from reanimated
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((value) => value),
  withSpring: jest.fn((value) => value),
  useDerivedValue: jest.fn((fn) => fn()),
  get: jest.fn(),
  Easing: {
    inOut: jest.fn((easing) => easing),
    quad: jest.fn(() => ({}))
  },
  __esModule: true,
  default: {}
}))

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({})),
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/')
}))

jest.mock('expo-modules-core', () => ({
  __esModule: true,
  NativeModulesProxy: {
    ExpoModulesCore: {}
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios)
  },
  requireNativeModule: jest.fn(() => ({}))
}))

jest.mock('expo-image-picker', () => ({
  __esModule: true,
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true })),
  MediaTypeOptions: {
    Images: 'Images'
  }
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  })),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children
}))

jest.mock(
  'react-native-safe-area-context/src/specs/NativeSafeAreaContext',
  () => ({
    __esModule: true,
    default: {},
    get: jest.fn()
  })
)

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn((name) => {
    if (name === 'DevMenu') {
      return {
        getEnforcing: jest.fn()
      }
    }
    return {} // Return an empty object for other modules
  })
}))

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light') // Mock the useColorScheme hook to return 'light' or any default value
}))

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    return () => {} // Return a cleanup function as required by the hook
  }),
  useNavigation: jest.fn(() => ({})),
  // Provide a basic mock for NavigationContainer if it's rendered directly in the component tree
  NavigationContainer: ({ children }) => children
  // Add any other specific exports that are being used and need mocking
}))

jest.mock('@/components/ThemedText', () => ({
  ThemedText: 'Text'
}))

jest.mock('@/components/ThemedView', () => ({
  ThemedView: 'View'
}))
