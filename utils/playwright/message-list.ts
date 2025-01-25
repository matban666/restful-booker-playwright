import { expect, type Page } from '@playwright/test';  

export async function* findMessages(page: Page, name: string, subject: string) {
    
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

export async function getMessageCount(page: Page, name: string, subject: string) {
    let count = 0;
    for await (const _ of findMessages(page, name, subject)) { 
        count++;
    }
    return count;
}

export async function getExactlyOneMessage(page: Page, name: string, subject: string, retries = 10) {

    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundMessage: any = null;

        try {
            for await (const matchingBooking of findMessages(page, name, subject)) { 
                
                foundMessage = matchingBooking;
                count++;
            }
        } catch (error) {
            console.log(`Exception in findMessages(page, ${name}, ${subject}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (count === 1) {
            expect(foundMessage).not.toBeNull();
        return foundMessage;
        }

        if (count > 1) {
            throw new Error(`Found more than one message for ${name} ${subject}`);
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneMessage for ${name} ${subject}`);
        await page.waitForTimeout(50); 
    }

    throw new Error(`Failed to find any messages for ${name} ${subject}`);
}


