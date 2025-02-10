// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './src/tests',
    use: {
      baseURL: 'http://localhost:3000',
      headless: false,
    },
    timeout: 30000,
  };
  
  module.exports = config;
  