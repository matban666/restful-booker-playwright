import { test, expect } from '@playwright/test';
import { loadHomepage } from '../../utils/playwright/home';
import { loadJsonTestConfig } from '../../utils/domain/json-loader';
import { getRooms } from '../../utils/playwright/room-list';
import { bookRoom } from '../../utils/playwright/booking';
import { newAdminSession, resumeAdminSession } from '../../utils/playwright/admin-session';
import { getMessages } from '../../utils/playwright/message-list';
import { getBookings } from '../../utils/playwright/booking-list';
import { getExpectedMessages } from '../../utils/domain/booking-messages';
import { type Room } from '../../test-data/types/room';
import { type Booking } from '../../test-data/types/booking';
import { changeMonth } from '../../utils/playwright/calendar';
import { Calendar } from '../../utils/domain/calendar';


//Booking tests are serial because they depend on each other
test.describe.serial('Booking Tests', () => {
  const bookings: Booking[] = loadJsonTestConfig('bookings.json');
  const rooms: Room[] = loadJsonTestConfig('rooms.json');

  rooms.forEach((room) => {
    test(`Create Room: ${room.roomName}`, async ({ page, baseURL }) => {
      await newAdminSession(page, baseURL);

      // Confirm we are on the rooms page, rooms is the deault admin page
      await expect(page.getByRole('link', { name: 'Rooms' })).toBeVisible();

      // Create the room
      await page.getByTestId('roomName').fill(room.roomName);
      await page.locator('#roomPrice').fill(String(room.roomPrice));
      await page.getByRole('button', { name: 'Create' }).click();

      // Check the room is now in the list
      const roomListItem = await getRooms(page, room.roomName, 10, 1, true);

      expect(roomListItem).not.toBeNull();

      if (roomListItem !== null) {
        // Click on the room and fill in the extra details
        await roomListItem[0].row.click();
        await page.getByRole('button', { name: 'Edit' }).click();
        await page.getByLabel('Description').fill(room.description);
        await page.getByLabel('Image:').fill(room.image);
        await page.getByRole('button', { name: 'Update' }).click();
      }
    });
  });

  bookings.forEach((booking) => {
    if (!booking.fixMe) {
      test(`Book: ${booking.description}`, async ({ page }) => {
        await loadHomepage(page);
        await bookRoom(page, booking);
      });
    }
  });

  bookings.forEach((booking) => {
    if (booking.expectedSuccess && !booking.fixMe) {
      const { checkInString, checkOutString } = Calendar.getCheckInAndCheckOutStrings(booking.monthOffset, booking.checkIn, booking.checkOut);
      const expectedFullName = `${booking.firstname} ${booking.lastname}`;

      test(`Check Report for: ${booking.email} ${expectedFullName} ${booking.roomName} ${checkInString} ${checkOutString} `, async ({ page, baseURL }) => {
        await newAdminSession(page, baseURL);

        await expect(page.getByRole('link', { name: 'Report' })).toBeVisible();
        await page.getByRole('link', { name: 'Report' }).click();

        await expect(page.getByRole('link', { name: 'B&B Booking Management' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Today' })).toBeVisible();

        const calendarSelector = `//div[@class="rbc-calendar"]`;

        const calendarLocator = page.locator(calendarSelector)

        await page.waitForSelector(calendarSelector, { timeout: 10000 });

        await expect(calendarLocator).toBeVisible();

        await changeMonth(calendarLocator, booking.monthOffset);

        const expectedRoom = booking.roomName;

        const bookingSelector = `${calendarSelector}//div[@class="rbc-event-content" and @title="${expectedFullName} - Room: ${expectedRoom}"]`;

        console.log(`Selector: ${bookingSelector}`);

        // The calendar may take a while to load
        await page.waitForSelector(bookingSelector, { timeout: 1000, state: 'attached' });

        // There may be more than one if there are multiple bookings of a room under the same name, or the booking straddles multiple rows
        const elements = page.locator(bookingSelector);

        // Loop through the elements and check their visibility
        const count = await elements.count();

        let visibleCount = 0;

        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          // Assert that the current element is visible
          await expect(element).toBeVisible();

          if (await element.isVisible()) {
            visibleCount++;
          }
        }

        expect(visibleCount >= 1).toBeTruthy();

        //TODO: Tie down exatly how many of each booking we expect to see and if they are over the correct dates

      });
    }
  });

  test.describe.serial('Booking Messages', () => {
    // This get the messges we expect to see based on the bookings
    const expectedBookigMessages = getExpectedMessages(bookings);

    // Loop through expected messages by sender
    for (const sender in expectedBookigMessages) {

      // Access the array for the current key
      const expectedMessages = expectedBookigMessages[sender];

      const messageCount = expectedMessages.length;

      const subject = 'You have a new booking!';

      test(`Looking for ${messageCount} messages from ${sender}`, async ({ page, baseURL }) => {
        await newAdminSession(page, baseURL);

        const matchingMessages = await getMessages(page, sender, subject, 10, messageCount);

        expect(matchingMessages).not.toBe(null);

        let count = 0;

        if (matchingMessages !== null && matchingMessages.length > 0) {

          console.log(`Found ${matchingMessages.length} messages for ${subject}`);

          for (const message of matchingMessages) {
            await message.row.click();

            // Check that a message is visible
            const messageLocator = page.getByTestId('message');
            await expect(messageLocator).toBeVisible();

            // Extract the message details from the page
            // I don't like using indexes but there is very little else to go on
            const currentMessageFrom = (await messageLocator.locator(`//div[1]/div[1]/p`).innerText()).slice(6);
            const currentMessagePhone = (await messageLocator.locator(`//div[1]/div[2]/p`).innerText()).slice(7);
            const currentMessageEmail = (await messageLocator.locator(`//div[2]/div[1]/p`).innerText()).slice(7);
            const currentMessageSubject = await messageLocator.locator(`//div[3]//span`).textContent();
            const currentMessageMessage = await messageLocator.locator(`//div[4]//p`).textContent();

            // Is the the message we are expecting?
            for (const expectedMessageIndex in expectedMessages) {
              //TODO: This is a bit clumsy and not effecient - We could perpahs use sets or hashs
              const expectedMessage = expectedMessages[expectedMessageIndex];
              if (currentMessageFrom === sender && currentMessagePhone === expectedMessage.phone && currentMessageEmail === expectedMessage.email && currentMessageSubject === subject && currentMessageMessage === expectedMessage.expectedMessage) {
                count++;
                break;
              }
            }
            await page.getByRole('button', { name: 'Close' }).click();
          }
        }

        // The room name is not shown in the message or message list so we can't check it without referencing the booking on the room/report page
        // So if the same user books different rooms on the same dates we will not be able to distinguish them
        // if we were aware of the room then we could check that the count below is exactly 1, or we could count duplicates in expectedMessages 
        // but all solutions seem a bit involved for this simple test
        console.log(`Found ${count} messages out of ${messageCount} for ${sender}`);
        expect(count >= messageCount).toBe(true);

      });
    }
  });

  bookings.forEach((booking) => {
    if (booking.expectedSuccess && !booking.fixMe) {
      test(`Booking is in room page: ${booking.description}`, async ({ page }) => {
        await resumeAdminSession(page);

        // Get the room
        const roomListItems = await getRooms(page, booking.roomName);

        expect(roomListItems).not.toBeNull();

        if (roomListItems !== null && roomListItems.length > 0) {
          // Click on the room
          await roomListItems[0].row.click();

          // Find the booking
          const { checkInString, checkOutString } = Calendar.getCheckInAndCheckOutStrings(booking.monthOffset, booking.checkIn, booking.checkOut);
          const bookingList = await getBookings(page, booking.firstname, booking.lastname, checkInString, checkOutString);

          expect(bookingList).not.toBeNull();

          if (bookingList !== null && bookingList.length > 0) {
            // Edit the booking
            await bookingList[0].editIcon.click();

            //TODO: Actually edit the booking, this would requre subsequent tests to check the changes so it needs some thought

            await page.locator('//span[contains(@class, "confirmBookingEdit")]').click();
          }
        }
      });
    }
  });


  // TODO: Add a booking on the room page


  // TODO: Edit booking and check changes


  bookings.forEach((booking) => {
    if (booking.expectedSuccess && !booking.fixMe) {
      test(`Delete booking: ${booking.description}`, async ({ page, baseURL }) => {
        await newAdminSession(page, baseURL);

        // Get the room
        const roomListItems = await getRooms(page, booking.roomName);

        expect(roomListItems).not.toBeNull();

        if (roomListItems !== null && roomListItems.length > 0) {
          await roomListItems[0].row.click();

          const { checkInString, checkOutString } = Calendar.getCheckInAndCheckOutStrings(booking.monthOffset, booking.checkIn, booking.checkOut);

          console.log(`Booking: ${booking.firstname} ${booking.lastname} ${checkInString} ${checkOutString}`);

          const bookingList = await getBookings(page, booking.firstname, booking.lastname, checkInString, checkOutString);

          expect(bookingList).not.toBeNull();

          if (bookingList !== null && bookingList.length > 0) {
            await bookingList[0].deleteIcon.click();

            //Arbitraty sleeps should be avoided.  There seems to be some asychronous between the delete 
            //button being pressed and the rest call being sent.  See if we can determine a way
            //to detect this without the need for a sleep
            await page.waitForTimeout(100);
          }

          //TODO: Check the booking is gone
        }
      });
    }
  });

  test.describe.serial('Delete Booking Messages', () => {
    // This get the messges we expect to see based on the bookings
    const expectedBookigMessages = getExpectedMessages(bookings);

    // Loop through expected messages by sender
    for (const sender in expectedBookigMessages) {

      // Access the array for the current key
      const expectedMessages = expectedBookigMessages[sender];

      const messageCount = expectedMessages.length;

      const subject = 'You have a new booking!';

      test(`Deleting ${messageCount} messages from ${sender}`, async ({ page, baseURL }) => {
        await newAdminSession(page, baseURL);

        //TODO: This is a bit of a cheat. We should be checking the message content
        // We are arbitrarily selecting the message to delete, it just happens that there
        // will be the correct number of messages deleted but each deleton does not 
        // correspond to a specific booking
        for (const expectedMessageIndex in expectedMessages) {

          const messageList = await getMessages(page, sender, subject, 10, 1, false);

          expect(messageList).not.toBeNull();

          if (messageList !== null && messageList.length > 0) {
            console.log(`Found ${messageList.length} messages from ${sender} for ${subject}`);
            await messageList[0].deleteIcon.click();

            //Arbitraty sleeps should be avoided.  There seems to be some asychronous between the delete 
            //button being pressed and the rest call being sent.  See if we can determine a way
            //to detect this without the need for a sleep
            await page.waitForTimeout(100);
          }
        }

        // The room name is not shown in the message or message list so we can't check it without referencing the booking on the room/report page
        // So if the same user books different rooms on the same dates we will not be able to distinguish them
        // if we were aware of the room then we could check that the count below is exactly 1, or we could count duplicates in expectedMessages 
        // but all solutions seem a bit involved for this simple test
      });
    }
  });

  rooms.forEach((room) => {
    test(`Delete Room: ${room.roomName}`, async ({ page, baseURL }) => {
      await newAdminSession(page, baseURL);

      // Confirm we are on the rooms page, rooms is the deault admin page
      await expect(page.getByRole('link', { name: 'Rooms' })).toBeVisible();

      // Get the room from the list
      const roomsInList = await getRooms(page, room.roomName);

      expect(roomsInList).not.toBeNull();

      if (roomsInList !== null) {
        console.log(`Room Count: ${roomsInList.length}`);

        if (roomsInList.length > 0) {
          // Delete the room
          console.log(`Delete item: ${room.roomName}`);
          await roomsInList[0].deleteIcon.click();

          //Arbitraty sleeps should be avoided.  There seems to be some asychronous between the delete 
          //button being pressed and the rest call being sent.  See if we can determine a way
          //to detect this without the need for a sleep
          await page.waitForTimeout(100);
        }
      }
    });
  });
});


