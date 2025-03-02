import { expect, Page } from '@playwright/test';
import { loadHomepage } from '../../utils/playwright/home';

export async function applyBranding(page: Page, branding: any) {
    // Click on the branding link
    await page.getByRole('link', { name: 'Branding' }).click();

    // Fill in branding form
    await page.locator('//input[@id="name"]').fill(branding.name);
    await page.locator('//input[@id="logoUrl"]').fill(branding.logoUrl);
    await page.locator('//textarea[@id="description"]').fill(branding.description);
    await page.locator('//input[@id="latitude"]').fill(branding.map.latitude);
    await page.locator('//input[@id="longitude"]').fill(branding.map.longitude);
    await page.locator('//input[@id="contactName"]').fill(branding.contact.name);
    await page.locator('//input[@id="contactAddress"]').fill(branding.contact.address);
    await page.locator('//input[@id="contactPhone"]').fill(branding.contact.phone);
    await page.locator('//input[@id="contactEmail"]').fill(branding.contact.email);

    // Submit the branding form
    await page.getByRole('button', { name: 'Submit' }).click();

    //Arbitraty sleeps should be avoided.  There seems to be some asychronous between the delete 
    //button being pressed and the rest call being sent.  See if we can determine a way
    //to detect this without the need for a sleep
    await page.waitForTimeout(100);
}


export async function checkBranding(page: Page, branding: any) {
    for ( let retry = 0; retry < 10; retry++) {
        try {
            await loadHomepage(page);

            await page.waitForLoadState('load');

            await expect(page.getByRole('heading', { name: 'Rooms' })).toBeVisible();

            // Reading from the page asynchronously seems to be safe
            const promises: Promise<void>[] = [];

            const image = page.getByRole('img', { name: 'Hotel logoUrl' })
            // Check that the image url is correct
            promises.push(expect(image).toHaveAttribute('src', branding.logoUrl));

            // Check that the image is visible
            promises.push(expect(image).toBeVisible());

            // TODO: Why does this sometimes fail for default branding?
            // Check that the image is loaded
            // const isImageLoaded = await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
            // expect(isImageLoaded).toBe(true);

            // Look for the description anywhere on the page
            promises.push(expect(page.getByText(branding.description, { exact: true })).toBeVisible());

            // Look for the contact name
            promises.push(expect(page.getByText(branding.contact.name, { exact: false })).toBeVisible());

            // Look for the contact address
            promises.push(expect(page.getByText(branding.contact.address, { exact: true })).toBeVisible());

            // Look for the contact phone
            promises.push(expect(page.getByText(branding.contact.phone, { exact: true })).toBeVisible());

            // Look for the contact email
            promises.push(expect(page.getByText(branding.contact.email, { exact: false })).toBeVisible());

            await Promise.all(promises);

            return;
        } catch (error) {
            console.log(`Exception in checkBranding(page, ${branding}).  Ignoring and potentially retrying.`);
            // console.log(error);
            await page.waitForTimeout(50); 
        }
    }

    throw new Error(`Failed to find branding for ${branding} after 10 retries`);
}