import { expect, type Page } from '@playwright/test';  

async function* findMessages(page: Page, name: string, subject: string) {
    
    // Should this be here?
    await expect(page.locator(`//a[@href="#/admin/messages"]`)).toBeVisible();
    await page.locator(`//a[@href="#/admin/messages"]`).click();
    
    await page.waitForSelector('//div[@class="messages"]');
    
    const listItems = await page.locator(`//div[@class="messages"]//div[contains(@class, 'row') and contains(@class, 'detail')]`).all();
    
    for (const row of listItems) {
        const rowName = await row.locator('//div[1]/p').textContent();
        const rowSubject = await row.locator('//div[2]/p').textContent();
        const deleteIcon = row.locator('//div[3]/span')
    
        if (rowName === name && rowSubject === subject) {
            yield { row, name, subject, deleteIcon }; // Yield the matching item
        }
    }
}

export async function getMessages(page: Page, name: string, subject: string, retries = 10, expectedCount = 1, strict = true) {

    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundItems: any[] = [];   //use of any is bad, get this typed proerly

        try {
            for await (const matchingBooking of findMessages(page, name, subject)) { 
                foundItems.push(matchingBooking);
                count++;
            }
        } catch (error) {
            console.log(`Exception in findMessages(page, ${name}, ${subject}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (strict && count > expectedCount) {
            throw new Error(`Found more than ${expectedCount} message(s) for ${name} ${subject}`);
        }

        if (count >= expectedCount) {
            expect(foundItems[-1]).not.toBeNull();
            return foundItems;
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneMessage for ${name} ${subject}`);
        await page.waitForTimeout(100); 
    }

    return null;
}


