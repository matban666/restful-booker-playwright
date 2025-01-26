# Restful Booker Playwright Test

## Overview
Plawright test suite for the Restfuk Booker Platform found at https://automationintesting.online/

## Pre-requisites
Node.js - tested with version 23.6.0
Playright - see https://playwright.dev/docs/intro#installing-playwright

## Directory Structure

<pre>
├── tests
│   ├── end-to-end
│   │   ├──branding.spec.ts
│   │   ├──contact-form.spec.ts
│   │   └──room-booking.spec.ts
│   ├── admin-navigation.spec.ts
│   ├── calendar.spec.ts
│   └── static-content.spec.ts
├── playwright.config.ts
└── package.json
</pre>


## Todo
Admin credentials to be stored in a secure location
Tidy room-booking.spec.ts
Room booking is also a bit flaky
Make sure there is enoug info in the errors


## Bugs
You can create multiple rooms with the same name
You can book a room in the past
Room number can be a name or number but UI suggests it is a number
Can't book beyond the current visible calendar dates
Multiple room booking calendars are visible at once
Can't book a single night
Contact errors are not consistent in terms of capitalisation and full stops
Branding does not allow apostrophes or dashes
Copyright date is not up to date
Enter does not submit the login form 
Cookie and Privacy pages do not have navigation links back to the home page
Hotel Name is not displayed as text on the home page - accessibilty
/images/rbp-logo.jpg is not accepted for branding
No cancel on room detalis page
List edit icon inconsistency
Booking message does not say which room, althoug it can be looked up via the room pages or the report
On the room page if you edit a room, then click delete, you cannot delete it

## Tests to do
Check price for booking is correct
Create room with negative price
Check todays date is correct when entering the page, then again if we navigate away and back in the calendar
Valid and invalid email addresses
Update room details and check the changes are reflected
See that admin pages redirect to login page if accessed when logged out https://automationintesting.online/#/admin/report
Check that message has been read
New mwssage count
Book directly on report calendar
What about the REST backend tests?

## Untested
Cancel button on room edit
