const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function takeScreenshots(outputDir, label) {
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const popupPath = `file://${path.resolve(__dirname, '../chrome_extension/popup.html')}`;

  // Desktop dark mode
  const desktopCtx = await browser.newContext({
    viewport: { width: 400, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(popupPath, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({
    path: path.join(outputDir, `${label}-desktop-dark-400w.png`),
    fullPage: true,
  });

  // Mobile dark mode
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 700 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(popupPath, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({
    path: path.join(outputDir, `${label}-mobile-dark-375w.png`),
    fullPage: true,
  });

  // Desktop with manual tracking ON (to show conditional field hidden)
  const statesCtx = await browser.newContext({
    viewport: { width: 400, height: 900 },
    deviceScaleFactor: 2,
  });
  const statesPage = await statesCtx.newPage();
  await statesPage.goto(popupPath, { waitUntil: 'networkidle' });
  await statesPage.waitForTimeout(300);
  // Toggle manual tracking on
  await statesPage.click('#trackingManually + .toggle-track');
  await statesPage.waitForTimeout(400);
  await statesPage.screenshot({
    path: path.join(outputDir, `${label}-manual-tracking-on.png`),
    fullPage: true,
  });

  await browser.close();
  console.log(`Screenshots saved to ${outputDir}`);
}

const outputDir = process.argv[2] || path.join(__dirname, 'v2-after');
const label = process.argv[3] || 'popup';

takeScreenshots(outputDir, label).catch(console.error);
