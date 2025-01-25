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

export async function getBookingCount(page, firstname, lastname, checkInString, checkOutString) {
    let count = 0;
    for await (const _ of findBookings(page, firstname, lastname, checkInString, checkOutString)) { 
        count++;
    }
    return count;
}

export async function getExactlyOneBooking(page, firstname, lastname, checkInString, checkOutString, retries = 10) {

    // TODO: Report how long this actually takes
    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundBooking: any = null;

        try {
            for await (const matchingBooking of findBookings(page, firstname, lastname, checkInString, checkOutString)) { 
                
                foundBooking = matchingBooking;
                count++;
            }
        } catch (error) {
            console.log(`Exception in findBookings(page, ${firstname}, ${lastname}, ${checkInString}, ${checkOutString}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (count === 1) {
            expect(foundBooking).not.toBeNull();
        return foundBooking;
        }

        if (count > 1) {
            throw new Error(`Found more than one booking for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneBooking for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
        await page.waitForTimeout(50); 
    }

    throw new Error(`Failed to find any bookings for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
}


export async function isBookingNotThere(page, firstname, lastname, checkInString, checkOutString, retries = 10) {

    for (let retry = 0; retry < retries; retry++) {

        const count = await getBookingCount(page, firstname, lastname, checkInString, checkOutString);

        if (count === 0) {
            return true;
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneBooking for ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
        await page.waitForTimeout(50); 
    }

    throw new Error(`Booking is still there: ${firstname} ${lastname} ${checkInString} ${checkOutString}`);
}

