// Reads the room list and returns the booking details with a retry mechanism to deal with late/partial list loading
// booking-list.ts, message-list.ts, room-list.ts commonality should be refactored using templates/generics
// booking-list.ts, message-list.ts, room-list.ts also use the any type, these should be strogly types as part of the above work

import { expect, type Page, type Locator } from '@playwright/test';


async function* findRooms(page: Page, roomName: string) {
    

  await expect(page.getByRole('link', { name: 'Admin panel' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin panel' }).click();
  

  const listItems = await page.locator(`//div[contains(@class, 'row') and contains(@class, 'detail')]`).all();
  
  for (const row of listItems) {
      const name = await row.locator('//div[1]/p').textContent();
      const beds = await row.locator('//div[2]/p').textContent();
      const accessible = await row.locator('//div[3]/p').textContent();
      const price = await row.locator('//div[4]/p').textContent();
      const details = await row.locator('//div[5]/p').textContent();
      const deleteIcon = row.locator('//div[6]/span')
  
      if (name === roomName) {
          yield { row, name, beds, accessible, price, details, deleteIcon }; // Yield the matching item
      }
  }
}

export async function getRooms(page: Page, roomName: string, retries = 10, expectedCount = 1, strict = true) {

    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundItems: any[] = [];  //use of any is bad, get this typed proerly

        try {
            for await (const matchingBooking of findRooms(page, roomName)) { 
                foundItems.push(matchingBooking);
                count++;
            }
        } catch (error) {
            console.log(`Exception in findRooms(page, ${roomName}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (strict && count > expectedCount) {
            throw new Error(`Found more than one booking for ${roomName}`);
        }

        if (count >= expectedCount) {
            expect(foundItems[-1]).not.toBeNull();
            return foundItems;
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneRoom for ${roomName}`);
        await page.waitForTimeout(100); 
    }

    return null;
}




