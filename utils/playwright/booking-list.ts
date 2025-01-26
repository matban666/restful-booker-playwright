import { expect, type Page } from '@playwright/test';

async function* findBookings(page: Page, bookingFirstname, bookingLastname, bookingCheckInString, bookingCheckOutString) { 

    const listItems = await page.locator(`//div[contains(@class, 'detail') and contains(@class, 'booking')]/div[contains(@class, 'row')]`).all();
    
    for (const row of listItems) {
        // TODO: Check others are visible
        await expect(row.locator(`//span[contains(@class, 'bookingEdit')]`)).toBeVisible();
        await expect(row.locator(`//span[contains(@class, 'bookingDelete')]`)).toBeVisible();

        const firstName = await row.locator('//div[1]/p').textContent();
        const lastName = await row.locator('//div[2]/p').textContent();
        const price = await row.locator('//div[3]/p').textContent();
        const depositPaid = await row.locator('//div[4]/p').textContent();
        const checkIn = await row.locator('//div[5]/p').textContent();
        const checkOut = await row.locator('//div[6]/p').textContent();

        
        const editIcon = row.locator(`//span[contains(@class, 'bookingEdit')]`);
        const deleteIcon = row.locator(`//span[contains(@class, 'bookingDelete')]`);
    
        if (firstName === bookingFirstname && lastName === bookingLastname && checkIn === bookingCheckInString && checkOut === bookingCheckOutString) {
            yield { row, firstName, lastName, price, depositPaid, checkIn, checkOut, editIcon, deleteIcon }; 
        }
    }
}

export async function getBookings(page, firstname, lastname, checkInString, checkOutString, retries = 10, expectedCount = 1, strict = true) {

    // TODO: Report how long this actually takes
    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundItems: any[] = [];  //use of any is bad, get this typed proerly

        try {
            for await (const matchingBooking of findBookings(page, firstname, lastname, checkInString, checkOutString)) {  
                foundItems.push(matchingBooking);
                count++;
            }
        } catch (error) {
            console.log(`Exception in findBookings(page, ${firstname}, ${lastname}, ${checkInString}, ${checkOutString}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (strict && count > expectedCount) {
            throw new Error(`Found more than one booking for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
        }

        if (count >= expectedCount) {
            expect(foundItems[-1]).not.toBeNull();
            return foundItems;
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneBooking for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
        await page.waitForTimeout(100); 
    }

    return null;
}


