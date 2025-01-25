import { test, expect, type Page, type Locator } from '@playwright/test';


export async function checkCalenderHeaderDate(page: Page, expectedMonthYear: string) {

    const displayedMonthYear = await page.locator('//div[@class="rbc-toolbar"]/span[@class="rbc-toolbar-label"]').innerText();

    expect(displayedMonthYear).toBe(expectedMonthYear);
}

export async function checkCalendarCell(page: Page, day: string) {

    const displayedDay = await page.locator('//div[@class="rbc-date-cell rbc-now rbc-current"]').locator('//button').innerText();

    await expect(page.locator('.rbc-today')).toHaveCount(1);

    expect(displayedDay).toBe(day);
}

export async function selectDates(calendarLocator: Locator, monthOffset: number, checkIn: number, checkOut: number, expectedSuccess: boolean) {
    await changeMonth(calendarLocator, monthOffset);
    
    const checkInDay = checkIn.toString().padStart(2, '0');
    const childDiv = calendarLocator.locator(`//div[@class="rbc-date-cell" and button[text()="${checkInDay}"]]`);
  
    const viewportBox = await childDiv.boundingBox();

    expect(viewportBox).not.toBeNull();

    if (viewportBox === null) {
      throw new Error('Viewport box for checkin day is null');
    }

    const view = await calendarLocator.evaluateHandle(() => window)
  
    await childDiv.dispatchEvent('mousedown', {
      button: 0,
      buttons: 1,
      clientX: viewportBox.x + (viewportBox.width / 2), // Click in the horizontal center of the child div
      clientY: viewportBox.y + 10,                      // Towards the top to avoid an existing selection
      view: view,
      bubbles: true,
      cancelBubble: false,
    });
  
    await childDiv.dispatchEvent('mousemove', {
      button: 0,
      buttons: 1,
      clientX: viewportBox.x + (viewportBox.width / 2) + 6, // The control requires a 5px movement to start the selection
      clientY: viewportBox.y + 10, //Towards the top to avoid an existing selection
      view: view,
      bubbles: true,
      cancelBubble: false,
    });
  
    const lastDay = (checkOut - 1).toString().padStart(2, '0');
    const childDiv2 = calendarLocator.locator(`//div[@class="rbc-date-cell" and button[text()="${lastDay}"]]`);
    const viewportBox2 = await childDiv2.boundingBox();

    expect(viewportBox2).not.toBeNull();

    if (viewportBox2 === null) {
      throw new Error('Viewport box for checkin day is null');
    }
  
    await childDiv2.dispatchEvent('mousemove', {
      button: 0,
      buttons: 1,
      clientX: viewportBox2.x + (viewportBox2.width / 2), // Move to the centre of the last date div
      clientY: viewportBox2.y + 10, //Towards the top to avoid an existing selection
      view: view,
      bubbles: true,
      cancelBubble: false,
    });
  
    await childDiv2.dispatchEvent('mouseup', {
      button: 0,
      buttons: 0,
      clientX: viewportBox2.x + (viewportBox2.width / 2), // Mouse up in the centre of the last date div
      clientY: viewportBox2.y + 10, //Towards the top to avoid an existing selection
      view: view,
      bubbles: true,
      cancelBubble: false,
    });

    //Selection is always allowed
    await expect(calendarLocator.locator(`//div[@class="rbc-event-content"][contains(text(), 'night')]`).first()).toBeVisible();

    // Is the booking shown om the calendar? 
    const unavailableSelector = `//div[@class="rbc-event-content"][text()='Unavailable']`;
    if (expectedSuccess) {
        // TODO: This doesn't work because any other bookings are also shown
        // await expect(calendarLocator.locator(unavailableSelector)).toHaveCount(0);
    } else {
        // TODO: Isn't very reliable if other bookings are also shown
        await expect(calendarLocator.locator(unavailableSelector).first()).toBeVisible();
    }
}

export async function changeMonth(calendarLocator: Locator, monthOffset: number) {
    if (monthOffset < 0) {
        for (let i = 0; i < Math.abs(monthOffset); i++) {
            await calendarLocator.locator(`//button[text()='Back']`).click();
        }
    } else if (monthOffset > 0) {
        for (let i = 0; i < monthOffset; i++) {
            await calendarLocator.locator(`//button[text()='Next']`).click();
        }
    }
}

