import { Page, expect } from '@playwright/test';
import { loadJsonTestConfig } from '../domain/json-loader';
import { loadHomepage } from './home';
import path from 'path';
import * as process from 'process';

const authFile = '../.auth/user.json';

export async function newAdminSession(page: Page, baseURL: string|undefined) {
    if (!baseURL) {
        throw new Error('baseURL is not set in playwright.config.ts');
    }

    await loadHomepage(page);
    await page.getByRole('link', { name: 'Admin panel' }).click();
    await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error('Admin credentials are not set in environment variables');
    }
    
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // To ensure cookies are set
    await page.waitForURL(baseURL + '#/admin');

    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    const cookies = await page.context().cookies();

    // const authFilePath = path.join(__dirname, authFile);
    const currentDirectory = process.cwd();
    const authFilePath = path.resolve(currentDirectory, 'test-data', authFile);

    await page.context().storageState({ path: authFilePath });
}

export async function resumeAdminSession(page: Page) {
    // TODO: Cuuld do with getting rid any
    const auth: any = loadJsonTestConfig(authFile)
    
    const cookies: any = auth['cookies']

    await page.context().addCookies(cookies);

    await page.goto('#/admin');

    await expect(page.getByRole('button', { name: 'Let me hack!' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
}