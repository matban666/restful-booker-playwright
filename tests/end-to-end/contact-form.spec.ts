import { test, expect } from '@playwright/test';  
import { loadHomepage } from '../../utils/playwright/home';
import { loadJsonTestConfig } from '../../utils/domain/json-loader';
import { getMessages } from '../../utils/playwright/message-list';
import { newAdminSession } from '../../utils/playwright/admin-session';
import { ContactMessage } from '../../test-data/types/contact-message';
import { BadEmail } from '../../test-data/types/bad-email';

  
test.describe.parallel('Contact Form', () => {
    const contactFormMessages: ContactMessage[] = loadJsonTestConfig('contact-form-messages.json'); 
    const badEmails: BadEmail[] = loadJsonTestConfig('bad-emails.json'); 

    contactFormMessages.forEach((message: ContactMessage) => {
        test(`Send message from: ${message.contactName}`, async ({ page }) => {
            await loadHomepage(page);

            // Fill and submit form
            await page.getByTestId('ContactName').fill(message.contactName);
            await page.getByTestId('ContactEmail').fill(message.contactEmail);
            await page.getByTestId('ContactSubject').fill(message.contactSubject);
            await page.getByTestId('ContactPhone').fill(message.contactPhone);
            await page.getByTestId('ContactDescription').fill(message.contactDescription);
            await page.getByRole('button', { name: 'Submit' }).click();

            // Check that the form has been submitted
            // Reading from the page asynchronously seems to be safe
            const promises: Promise<void>[] = [];
            promises.push(expect(page.getByRole('heading', { name: 'Thanks for getting in touch' })).toBeVisible());
            promises.push(expect(page.getByRole('heading', { name: message.contactName })).toBeVisible());
            promises.push(expect(page.getByText('We\'ll get back to you about')).toBeVisible());
            promises.push(expect(page.getByText(message.contactSubject)).toBeVisible());
            promises.push(expect(page.getByText('as soon as possible.')).toBeVisible());
            await Promise.all(promises);
        });
        
        test(`Check message arrived exactly once from: ${message.contactName}`, async ({ page, baseURL }) => {
            //Count messages from this contact
            await newAdminSession(page, baseURL);

            await getMessages(page, message.contactName, message.contactSubject, 10, 1, true);
        });

        test(`Check content of message from: ${message.contactName}`, async ({ page, baseURL }) => {
            await newAdminSession(page, baseURL);

            const messages = await getMessages(page, message.contactName, message.contactSubject, 10, 1, true);

            if (messages.length === 1) {
                // Click on the message
                await messages[0].row.click();

                // Check that a message is displayed
                const messageLocator = page.getByTestId('message');
                await expect(messageLocator).toBeVisible();

                // Check that the message is displayed correctly
                await expect(messageLocator.getByText(`From: ${message.contactName}`)).toBeVisible();
                await expect(messageLocator.getByText(`Phone: ${message.contactPhone}`)).toBeVisible();
                await expect(messageLocator.getByText(`Email: ${message.contactEmail}`)).toBeVisible();
                await expect(messageLocator.getByText(message.contactSubject)).toBeVisible();
                await expect(messageLocator.getByText(message.contactDescription)).toBeVisible();

                // Close the message
                await page.getByRole('button', { name: 'Close' }).click();
            }
        });

        test(`Delete message from: ${message.contactName}`, async ({ page, baseURL }) => {
            await newAdminSession(page, baseURL);

            const messages = await getMessages(page, message.contactName, message.contactSubject, 10, 1, true);

            if (messages.length === 1) {
                await messages[0].deleteIcon.click();
            }
        });
    });

    test('Negative Test - Blank Form', async ({ page }) => {
        await loadHomepage(page);

        // Just click
        await page.getByRole('button', { name: 'Submit' }).click();

        // Check that the error is shown
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Message must be between 20 and 2000 characters.']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Phone may not be blank']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Subject may not be blank']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Name may not be blank']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Message may not be blank']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Phone must be between 11 and 21 characters.']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Subject must be between 5 and 100 characters.']`)).toBeVisible();
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Email may not be blank']`)).toBeVisible();
    });

    test('Negative Test - No Name', async ({ page }) => {
        await loadHomepage(page);

        // Fill and submit form
        await page.getByTestId('ContactName').fill('');
        await page.getByTestId('ContactEmail').fill(contactFormMessages[0].contactEmail);
        await page.getByTestId('ContactSubject').fill(contactFormMessages[0].contactSubject);
        await page.getByTestId('ContactPhone').fill(contactFormMessages[0].contactPhone);
        await page.getByTestId('ContactDescription').fill(contactFormMessages[0].contactDescription);
        await page.getByRole('button', { name: 'Submit' }).click();

        // Check that the error is shown
        await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='Name may not be blank']`)).toBeVisible();
    });

    badEmails.forEach(({email, error}) => {
        test(`Negative Test - email test with: ${email}`, async ({ page }) => {
            await loadHomepage(page);

            // Fill and submit form
            await page.getByTestId('ContactEmail').fill(email);
            await page.getByRole('button', { name: 'Submit' }).click();

            // Check that the error is shown
            await expect(page.locator(`//div[@class="alert alert-danger"]/p[text()='${error}']`)).toBeVisible();

        });
    });
});