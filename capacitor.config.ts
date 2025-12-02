import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.geeklog.app',
  appName: 'GeekLogg',
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
    Haptics: {},
    Network: {},
  },

  android: {
    allowMixedContent: true,
    backgroundColor: '#1e293b',
    webContentsDebuggingEnabled: true,

    // 🔥 Linha que resolve seu problema:
    assets: {
      clear: false
    }
  },

  ios: {
    scheme: 'GeekLogg',
    backgroundColor: '#1e293b',
  },
};

export default config;
