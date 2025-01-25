import { expect, type Page, type Locator } from '@playwright/test';


export async function* findRooms(page: Page, roomName: string) {
    
  // Not sure if this should be here
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

export async function getRoomCount(page: Page, roomName: string) {
  let count = 0;
  for await (const _ of findRooms(page, roomName)) { 
      count++;
  }
  return count;
}

export async function getExactlyOneRoom(page: Page, roomName: string, retries = 10) {

    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundBooking: any = null;

        try {
            for await (const matchingBooking of findRooms(page, roomName)) { 
                
                foundBooking = matchingBooking;
                count++;
            }
        } catch (error) {
            console.log(`Exception in findRooms(page, ${roomName}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (count === 1) {
            expect(foundBooking).not.toBeNull();
        return foundBooking;
        }

        if (count > 1) {
            throw new Error(`Found more than one booking for ${roomName}`);
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneRoom for ${roomName}`);
        await page.waitForTimeout(50); 
    }

    throw new Error(`Failed to find room ${roomName}`);
}




