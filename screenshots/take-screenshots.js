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

  // Desktop viewport (400px - typical extension popup)
  const desktopCtx = await browser.newContext({
    viewport: { width: 400, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(popupPath, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({
    path: path.join(outputDir, `${label}-desktop-400w.png`),
    fullPage: true,
  });

  // Mobile viewport (375px - iPhone SE)
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 700 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(popupPath, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({
    path: path.join(outputDir, `${label}-mobile-375w.png`),
    fullPage: true,
  });

  // Narrow mobile viewport (320px - small phones)
  const narrowCtx = await browser.newContext({
    viewport: { width: 320, height: 700 },
    deviceScaleFactor: 2,
  });
  const narrowPage = await narrowCtx.newPage();
  await narrowPage.goto(popupPath, { waitUntil: 'networkidle' });
  await narrowPage.waitForTimeout(500);
  await narrowPage.screenshot({
    path: path.join(outputDir, `${label}-mobile-320w.png`),
    fullPage: true,
  });

  await browser.close();
  console.log(`Screenshots saved to ${outputDir}`);
}

const outputDir = process.argv[2] || path.join(__dirname, 'v1-before');
const label = process.argv[3] || 'popup';

takeScreenshots(outputDir, label).catch(console.error);
