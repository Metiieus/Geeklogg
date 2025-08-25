import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.geeklog.app',
  appName: 'GeekLog',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#1e293b",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#06b6d4",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e293b',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarBackgroundColor: '#1e293b',
      statusBarStyle: 'dark',
      navigationBarBackgroundColor: '#1e293b',
      navigationBarStyle: 'dark',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1e293b',
    webContentsDebuggingEnabled: true,
  },
  ios: {
    scheme: 'GeekLog',
    backgroundColor: '#1e293b',
  },
};

export default config;
