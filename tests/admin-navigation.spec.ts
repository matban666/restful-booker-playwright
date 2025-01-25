import { test, expect } from '@playwright/test';  
import { loadHomepage } from '../utils/playwright/home';
import { newAdminSession, resumeAdminSession } from '../utils/playwright/admin-session';


// Serial because I want to start not logeed in then log in and do the rest
// Could probably refactor this so that it could mostly be parallel
test.describe.serial('Admin Page Navigation', () => {

    test('Link from Home Page', async ({ page }) => {
        await loadHomepage(page);
        await page.getByRole('link', { name: 'Admin panel' }).click();
        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await page.goBack();
    });

    test('Log In', async ({ page, baseURL }) => {
        await newAdminSession(page, baseURL);
        await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    });

    test('Rooms', async ({ page }) => {
        await resumeAdminSession(page);

        await expect(page.getByText('Room #')).toBeVisible();

        await expect(page.getByRole('link', { name: 'Rooms' })).toBeVisible();
        await page.getByRole('link', { name: 'Rooms' }).click();

        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await expect(page.getByText('Room #')).toBeVisible();
    }); 

    test('Report', async ({ page }) => {
        await resumeAdminSession(page);

        await expect(page.getByRole('link', { name: 'Report' })).toBeVisible();
        await page.getByRole('link', { name: 'Report' }).click();

        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Today' })).toBeVisible();
    }); 
    
    test('Branding', async ({ page }) => {
        await resumeAdminSession(page);

        await expect(page.getByRole('link', { name: 'Branding' })).toBeVisible();
        await page.getByRole('link', { name: 'Branding' }).click();

        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'B&B details' })).toBeVisible();
    }); 

    test('Messages', async ({ page }) => {
        await resumeAdminSession(page);

        await expect(page.locator(`//a[@href="#/admin/messages"]`)).toBeVisible();
        await page.locator(`//a[@href="#/admin/messages"]`).click();

        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await expect(page.getByText('Name')).toBeVisible();
        await expect(page.getByText('Subject')).toBeVisible();
    }); 

    test('Visit Home Page', async ({ page, baseURL }) => {
        await resumeAdminSession(page);

        await expect(page.getByRole('link', { name: 'Front Page' })).toBeVisible();
        await page.getByRole('link', { name: 'Front Page' }).click();

        await expect(page.url()).toBe(baseURL);

        await page.getByRole('link', { name: 'Admin panel' }).click();
        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();        
    });

    test('Footer', async ({ page }) => {
        await resumeAdminSession(page);
        await expect(page.locator(`//footer//p[contains(text(), "restful-booker-platform")]`)).toBeVisible();
    });

    test('Cookie-Policy', async ({ page }) => {
        await resumeAdminSession(page);
        await expect(page.locator(`//footer//a[contains(text(), "Cookie-Policy")]`)).toBeVisible();
    });

    test('Privacy-Policy', async ({ page }) => {
        await resumeAdminSession(page);
        await expect(page.locator(`//footer//a[contains(text(), "Privacy-Policy")]`)).toBeVisible();
    });

    test('Log Out', async ({ page, baseURL }) => {
        await resumeAdminSession(page);

        await page.getByRole('link', { name: 'Logout' }).click();
        await page.waitForURL(baseURL + '#/admin');
    });
});

// can be parallel as there is no login or order dependence
test.describe.parallel('Not Logged in redirects to log in', () => {
    test('/report redirects to login', async ({ page }) => {
        await page.goto('#/admin/report');
        await expect(page.getByTestId('login-header')).toBeVisible();
    });

    test('/branding redirects to login', async ({ page }) => {
        await page.goto('#/admin/branding');
        await expect(page.getByTestId('login-header')).toBeVisible();
    });

    test('/messages redirects to login', async ({ page }) => {
        await page.goto('#/admin/messages');
        await expect(page.getByTestId('login-header')).toBeVisible();
    });
});