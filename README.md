# Restful Booker Playwright Test

## Overview
Plawright test suite for the Restfuk Booker Platform found at https://automationintesting.online/

The overall concept is for the testing to be data driven.  Test data is provided in json files which is iterated over by the tests.  Test code is orgnised so that common functionaluty is factored out into modules. This results in almost no code duplication and ease of adding new tests cases just by adding them to the json or adding/modifying test usign shared components. 

## Pre-requisites
Node.js - tested with version 23.6.0
Playwright - see https://playwright.dev/docs/intro#installing-playwright

## Directory Structure

<pre>
├── tests-data
│   ├── types
│   │   ├── bad-email.ts
│   │   └── ...
│   ├──bad-emails.ts
│   │   └── ...
├── tests
│   ├── end-to-end
│   │   ├──branding.spec.ts
│   │   ├──contact-form.spec.ts
│   │   └──room-booking.spec.ts
│   ├── admin-navigation.spec.ts
│   ├── calendar.spec.ts
│   └── static-content.spec.ts
├── utils
│   ├── backend
│   │   └── rest-api.ts
│   ├── domain
│   │   ├── booking-messages.ts
│   │   ├── calendar.ts
│   │   └── ...
│   └── playwright
│       ├── admin-session.ts
│       ├── booking-list.ts
│       └── ...
├── playwright.config.ts
└── package.json
</pre>

- **test-data** - contains json files containing data for test that require different permeatations
- **test-data/types** - contain interfaces for each of the files
- **tests** - contains tests that test an isolates part of the site such as static items and navigation
- **tests/end-to-end** - contains tests that run through the system completely for partular aspect such as book rooms and check the admin details
- **utils/backend** - contains a module to directly test the rest api backend - just used for house keeping
- **utils/domain** - contains modules with re-usable functions that do not include any playwright calls such as date manipluation and formatting
- **utils/playwright** - contains modules with re-usable functions that include snippets of playwright code to carry out particular tasks such as read a list

### Tests

**static-content-spec.ts** - These tests iterate through the pages provided in pages.json test to ensure they all have the footer and that the footer links work, one test deliberately fails on the copyright being shown as 24 and not 25.

**admin-navigation-spec.ts** - This test checks that the links on the admin page all work.  It also checks that if not logged in the admin links redirect to the login page.  It checks that you can naviate between the booking and admin page.

**calendar.spec.ts** - This checks that the month and year are correct and today is highlighted.  It checks that the month navigation buttons work correctly.

### End To End Tests

branding.spec.ts - This tests that the website can be rebranded with branding supplied in branding-alternate.json.  It reverts back to branding-default.json and checks that it has been applied.

contact-form.spec.ts - This iterates through contact-form-messaging.json entering them into the contact form.  It then checks to see if the messages have appeared correctly on the admin panel.  It also checks some bad input responses.  It deletes the messages afterwards.

room-booking.sec.ts - This creates rooms from rooms.json.  Makes bookings from bookings.json - some bad bookings are checked to.  Sucessful bookings are checked in the admin report, rooms, and messages pages.  The messages, bookings and rooms are deleted afterwards.


## Todo
Admin credentials to be stored in a secure location
Tidy room-booking.spec.ts
Room booking is also a bit flaky
Make sure there is enoug info in the errors
Switch between staging and production


## Restful Booker Bugs
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
Update room details and check the changes are reflected
Check that message has been read
New message count
Book directly on report calendar
What about the REST backend tests?

## Untested
Cancel button on room edit
