import { chromium } from 'playwright';

export default async function scrape() {
  const browser = await chromium.launch({
    headless: false // setting this to true will not run the UI
});

const page = await browser.newPage();
await page.goto('https://www.recreation.gov/permits/4675321/registration/detailed-availability?date=2023-08-11');
await page.waitForTimeout(5000); // wait for 5 seconds
await browser.close();
};