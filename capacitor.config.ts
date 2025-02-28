import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bloodletters.miko',
  appName: 'Miko',
  webDir: 'build',
  server: {
    hostname: '127.0.0.1',
    cleartext: true
  }
};

export default config;