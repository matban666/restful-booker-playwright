import { test, expect } from '@playwright/test';  
import { loadHomepage } from '../utils/playwright/home';
import { loadJsonTestConfig } from '../utils/domain/json-loader';
import { newAdminSession } from '../utils/playwright/admin-session';
import { type Page } from '../test-data/types/static'

//Backend state is not changed, so we can run these tests in parallel
test.describe.parallel('Static Content', () => {

    const pages: Page = loadJsonTestConfig('pages.json'); 
    pages.forEach((currentPage: Page) => {
        test.describe.parallel(`Page ${currentPage.name}`, () => {
    
            test.beforeEach(async ({page, baseURL}) => {
                if (currentPage.requiresAuth) {
                    // Parallel so cannot use resumeAdminSession
                    await newAdminSession(page, baseURL);
                } else {
                    await loadHomepage(page);
                }
            });

            test('Footer', async ({ page }) => {
                await expect(page.locator(`//footer//p[contains(text(), "restful-booker-platform")]`)).toBeVisible();
            });

            test(`Copywright`, async ({ page }) => { 
                const currentYear = new Date().getFullYear();
                const shortYear = currentYear.toString().slice(-2); 
                const expectedCopyrightNotice = `© 2019-${shortYear}`;

                const element = page.locator('.text-muted');
                const textContent = await element.textContent();

                expect(textContent).not.toBeNull();

                if (textContent) {
                    const match = textContent.match(/© 2019-\d\d/);
                    const displayedCopyrightNotice = match ? match[0] : null;

                    expect(displayedCopyrightNotice).toBe(expectedCopyrightNotice);
                }
            });

            test('Cookie-Policy', async ({ page, baseURL }) => {
                // Is the link visible
                await expect(page.locator(`//footer//a[contains(text(), "Cookie-Policy")]`)).toBeVisible();
                
                // Can we click it
                await page.locator(`//footer//a[contains(text(), "Cookie-Policy")]`).click();
                
                // Does it go to the right place
                expect(page.url()).toBe(baseURL + '#/cookie');
                await expect(page.getByRole('heading', { name: 'Cookie Policy' })).toBeVisible();
            });

            test('Privacy-Policy', async ({ page, baseURL }) => {
                // Is the link visible
                await expect(page.locator(`//footer//a[contains(text(), "Privacy-Policy")]`)).toBeVisible();
                
                // Can we click it
                await page.locator(`//footer//a[contains(text(), "Privacy-Policy")]`).click();
                
                // Does it go to the right place
                expect(page.url()).toBe(baseURL + '#/privacy');
                await expect(page.getByRole('heading', { name: 'Privacy Policy Notice' })).toBeVisible();
            });
        });
    });
});