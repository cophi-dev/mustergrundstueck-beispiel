import { chromium } from 'playwright';

const url = process.env.LOGIN_URL || 'http://127.0.0.1:4173/';
const widths = [
  { w: 390, name: 'login-390px' },
  { w: 1280, name: 'login-1280px' },
];

const browser = await chromium.launch();
for (const { w, name } of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(url);
  await page.locator('#password').fill('');
  await page.screenshot({ path: `/opt/cursor/artifacts/${name}.png`, fullPage: true });
  await page.close();
}
await browser.close();
console.log('Screenshots saved to /opt/cursor/artifacts/');