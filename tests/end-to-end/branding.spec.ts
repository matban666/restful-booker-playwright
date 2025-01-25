import { test } from '@playwright/test';  
import { loadHomepage } from '../../utils/playwright/home';
import { loadJsonTestConfig } from '../../utils/domain/json-loader';
import { newAdminSession, resumeAdminSession } from '../../utils/playwright/admin-session';
import { type Branding } from '../../test-data/types/branding';
import { applyBranding, checkBranding } from '../../utils/playwright/branding';


//These are serial because we want the default branding to be applied last
test.describe.serial('Branding Tests', () => {

    const brandings:Branding[] = loadJsonTestConfig('branding-alternate.json'); 
    brandings.forEach((branding: Branding) => {
        // Serial so the branding is applied before the check
        test.describe.serial('Rebrand', () => {
            test(`Apply Branding ${branding.name}`, async ({ page, baseURL }) => {
                await newAdminSession(page, baseURL);
                await applyBranding(page, branding);
            });
            test(`Check rebrand ${branding.name}`, async ({ page }) => {
                await loadHomepage(page);
                await checkBranding(page, branding);
            });
        });
    });

    // Serial so the branding is applied before the check
    test.describe.serial('Default Branding', () => {
        const defaultBranding:Branding = loadJsonTestConfig('branding-default.json');

        test('Apply Branding', async ({ page }) => {
            await resumeAdminSession(page);
            await applyBranding(page, defaultBranding);
        });

        test('Check Branding', async ({ page }) => {
            await loadHomepage(page);
            await checkBranding(page, defaultBranding);
        });
    });
});