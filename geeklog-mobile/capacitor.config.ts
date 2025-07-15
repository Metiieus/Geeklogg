import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'Geek.Logg', // Substitua por seu domínio reverso único
  appName: 'GeekLog Mobile',
  webDir: 'dist', // Essa pasta será criada após `npm run build`
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
