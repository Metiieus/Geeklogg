import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.geeklog.mobile",
  appName: "GeekLog",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0f172a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#06b6d4",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0f172a",
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#06b6d4",
      sound: "beep.wav",
    },
    App: {
      launchUrl: "https://geeklog.app",
    },
  },
  ios: {
    scheme: "GeekLog",
    contentInset: "automatic",
    scrollEnabled: true,
    backgroundColor: "#0f172a",
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: "APK",
      signingType: "apksigner",
    },
    backgroundColor: "#0f172a",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: "GeekLogMobile",
    overrideUserAgent: undefined,
    backgroundColor: "#0f172a",
    toolbar: {
      height: 0,
    },
  },
};

export default config;
