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

export async function getExactlyOneMessage(page: Page, name: string, subject: string, retries = 10, messageCount = 1, strict = true) {

    for (let retry = 0; retry < retries; retry++) {
        let count = 0;
        let foundMessages: any[] = [];

        try {
            for await (const matchingBooking of findMessages(page, name, subject)) { 
                
                foundMessages.push(matchingBooking);
                count++;
            }
        } catch (error) {
            console.log(`Exception in findMessages(page, ${name}, ${subject}) is below.  Ignoring and potentially retrying.`);
            console.log(error);
        }

        if (strict && count > messageCount) {
            throw new Error(`Found more than ${messageCount} message(s) for ${name} ${subject}`);
        }

        if (count >= messageCount) {
            expect(foundMessages[-1]).not.toBeNull();
            return foundMessages;
        }

        console.log(`Retry ${retry + 1} of ${retries} for getExactlyOneMessage for ${name} ${subject}`);
        await page.waitForTimeout(50); 
    }

    throw new Error(`Failed to find any messages for ${name} ${subject}`);
}


