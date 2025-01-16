import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  testMatch: ['**/*.e2e.test.ts'],
};

export default config; 