import { expect, type Page } from '@playwright/test';
import { selectDates } from './calendar';
import { Booking } from '../../test-data/types/booking';

export async function bookRoom(page: Page, booking: Booking) {
    await expect(page.getByRole('heading', { name: 'Rooms' })).toBeVisible();

    //Click the book button for the appropriate room
    await page.locator(`//div[img[@alt="Preview image of room${booking.roomName}"]]/following-sibling::div/button`).click();
  
    //Locate calendar and select dates
    const calendarLocator = page.locator(`//div[img[@alt="Preview image of room${booking.roomName}"]]/parent::*/parent::*`)
    await selectDates(calendarLocator, booking.monthOffset, booking.checkIn, booking.checkOut, booking.expectedSuccess);
  
  
    //Fill in the form and submit
    await page.getByPlaceholder('Firstname').click();
    await page.getByPlaceholder('Firstname').fill(booking.firstname);
    await page.getByPlaceholder('Lastname').click();
    await page.getByPlaceholder('Lastname').fill(booking.lastname);
    await page.locator('input[name="email"]').click();
    await page.locator('input[name="email"]').fill(booking.email);
    await page.locator('input[name="phone"]').click();
    await page.locator('input[name="phone"]').fill(booking.phone);
    await page.getByRole('button', { name: 'Book', exact: true }).click();

    //Check the result
    if (booking.expectedSuccess) {
      await expect(page.getByRole('heading', { name: 'Booking Successful!' })).toBeVisible();
      await page.locator(`//div[@class="ReactModalPortal"]//button[text()='Close']`).click();
    } else {
      await expect(page.getByText('The room dates are either')).toBeVisible();
      await expect(page.getByText('Unavailable')).toBeVisible();
    }
  }