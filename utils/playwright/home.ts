import { Page } from '@playwright/test';

// Function to load the homepage
export async function loadHomepage(page: Page, dismissBanner: boolean = true) {
    await page.goto('');

    // It isn't the intention to test the banner, so dismiss it if required
    if (dismissBanner) {
        if (await page.getByRole('button', { name: 'Let me hack!' }).isVisible()) {
            await page.getByRole('button', { name: 'Let me hack!' }).click();
        }
    }
  }