# Restful Booker Playwright Test Suite

## Overview
Playwright test suite for the Restful Booker Platform found at https://automationintesting.online/

The overall concept is for the testing to be data driven.  Test data is provided in json files which is iterated over by the tests.  Test code is orgnised so that common functionaluty is factored out into modules. This results in almost no code duplication and ease of adding new tests cases just by adding them to the json or adding/modifying test usign shared components.  Overall the tests can be run in parallel but the end-to-end test are serial as the tests are order dependant and the data is shared to an extent.  Because of the live nature of the target site the suite generates all of its own artefacts such as rooms/bookings/messages and deletes them afterwards.  This prevents it from messing up other peples tests and hopefully other people from messing up these tests.  It does not take any absolute unfiltered counts or attempt to delete anything that it hasn't created.  The focus has been on end-to-end testing.  These could be complemented by more isolated feature testing.  Such isolated tests would requre their own data which wouldn't be to hard to add using the existing mechanisms.  The suite has been tested against a local hosted version too but in exatly the same way as the live version.  Additional staging only tests could be added to test the site in a more comprehensive manner, for example deleting all known bookings/messages and ensuring that the assiciated lists are completely empty.  Performance testing has been touched on but reproduction detail is light and exact timings have not been given.  No load testing has been carried out.  Accessibility has been touched on.  Securty has not been tested other than admin pages re-directing to the login page when not logged in.

## Pre-requisites
- **Node.js** - tested with version 23.6.0
- **Playwright** - see https://playwright.dev/docs/intro#installing-playwright
- **Targer Web Site** - https://automationintesting.online/ available or a locally hosted version.  Source: https://github.com/mwinteringham/restful-booker-platform

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
├── restful-booker-platform-bugs.yaml
├── playwright.config.ts
└── package.json
</pre>

## Directory Content

- **test-data** - contains json files containing data for test that require different permeatations
- **test-data/types** - contain interfaces for each of the files
- **tests** - contains tests that test an isolates part of the site such as static items and navigation
- **tests/end-to-end** - contains tests that run through the system completely for partular aspect such as book rooms and check the admin details
- **utils/backend** - contains a module to directly test the rest api backend - just used for house keeping
- **utils/domain** - contains modules with re-usable functions that do not include any playwright calls such as date manipluation and formatting
- **utils/playwright** - contains modules with re-usable functions that include snippets of playwright code to carry out particular tasks such as read a list

## Feature Tests

**static-content-spec.ts** - These tests iterate through the pages provided in pages.json test to ensure they all have the footer and that the footer links work, one test deliberately fails on the copyright being shown as 24 and not 25.

**admin-navigation-spec.ts** - This test checks that the links on the admin page all work.  It also checks that if not logged in the admin links redirect to the login page.  It checks that you can naviate between the booking and admin page.

**calendar.spec.ts** - This checks that the month and year are correct and today is highlighted.  It checks that the month navigation buttons work correctly.

## End To End Tests

branding.spec.ts - This tests that the website can be rebranded with branding supplied in branding-alternate.json.  It reverts back to branding-default.json and checks that it has been applied.

contact-form.spec.ts - This iterates through contact-form-messaging.json entering them into the contact form.  It then checks to see if the messages have appeared correctly on the admin panel.  It also checks some bad input responses.  It deletes the messages afterwards.

room-booking.sec.ts - This creates rooms from rooms.json.  Makes bookings from bookings.json - some bad bookings are checked to.  Sucessful bookings are checked in the admin report, rooms, and messages pages.  The messages, bookings and rooms are deleted afterwards.

## Restful Booker Bugs

An example of bugs observed in the Restful Booker Platform can be found in restful-booker-platform-bugs.yaml.  Areas not addressed or addressed fully include securty, accessibility and detail on performance.


## Todo
- Admin credentials to be stored in a secure location
- booking-list.ts, message-list.ts, room-list.ts comonality should be refactored using templates/generics
- Some tests are a bit flakey due to react components not loading in a timeley manner
- Some of the playwright errors don't give useful information - see if this can be improved
- Switch between staging and production
- Get the github action working

## Known Missing Tests
- Check price for booking is correct
- Create room with negative price
- Update room details and check the changes are reflected
- Check that message has been read
- New message count
- Book directly on report calendar
- REST backend tests
- Cookie policy link on privacy policy page is broken (bug #15)
- Invalid credential for admin login
- More valid/invalid input tests for contact form
- More valid/invalid input tests for booking form

## Tests to add if bug fixed
- Cancel button on room edit (bug #9)
