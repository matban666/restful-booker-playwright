import { test, expect } from '@playwright/test';
import { loadHomepage } from '../utils/playwright/home';
import { checkCalenderHeaderDate, checkCalendarCell, changeMonth } from '../utils/playwright/calendar';
import { Calendar } from '../utils/domain/calendar';


//Backend state is not changed, so we can run these tests in parallel
test.describe.parallel('Calendar', () => {
    test.beforeEach(async ({page}) => {
        await loadHomepage(page);
        await page.getByRole('button', { name: 'Book this room' }).first().click();
    });

    test(`Initial Date`, async ({ page }) => {
        const expectedMonthYear = Calendar.getMonthYear();

        await checkCalenderHeaderDate(page, expectedMonthYear);

        const day = Calendar.getTwoDigitDay();

        await checkCalendarCell(page, day);

    });

    test(`Today Button`, async ({ page }) => {
        await page.getByRole('button', { name: 'Today' }).click();

        const expectedMonthYear = Calendar.getMonthYear();

        await checkCalenderHeaderDate(page, expectedMonthYear);

        const day = Calendar.getTwoDigitDay();

        await checkCalendarCell(page, day);
    });

    test(`Next Month`, async ({ page }) => {
        const monthOffset = 1;

        await changeMonth(page.locator(`//div[@class="rbc-calendar"]`), monthOffset);

        const expectedMonthYear = Calendar.getMonthYear(monthOffset);

        await checkCalenderHeaderDate(page, expectedMonthYear);

        await expect(page.locator('.rbc-today')).toHaveCount(0); 
    });

    test(`Last Month`, async ({ page }) => {
        const monthOffset = -1;

        await changeMonth(page.locator(`//div[@class="rbc-calendar"]`), monthOffset);

        const expectedMonthYear = Calendar.getMonthYear(monthOffset);

        await checkCalenderHeaderDate(page, expectedMonthYear);

        await expect(page.locator('.rbc-today')).toHaveCount(0); 
    });
});