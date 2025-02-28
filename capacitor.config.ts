import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bloodletters.miko',
  appName: 'Miko',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;