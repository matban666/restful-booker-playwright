# Restful Booker Playwright Test Suite

## Description
Playwright test suite for the Restful Booker Platform found at [Restful Booker Platform](https://automationintesting.online/)

The Restful Booker Platform is a React front end served by a Java REST API.

The overall concept is for the testing to be data driven.  Test data is provided in json files which is iterated over by the tests.  Test code is orgnised so that common functionaluty is factored out into modules. This results in almost no code duplication and ease of adding new tests cases just by adding them to the json or adding/modifying test usign shared components.  

At a top level the tests can be run in parallel as can some of the less dynamic tests.  The end-to-end test are serial as they are order dependant and the data is shared to an extent (such ass across browser).  Because of the live nature of the target site the suite generates all of its own artefacts such as rooms/bookings/messages and deletes them afterwards.  This prevents it from messing up other users tests and hopefully other users from messing up these tests.  It does not take any absolute unfiltered counts or attempt to delete anything that it hasn't created.  

The focus has been on end-to-end testing to quickly identify if the sites function is complete from customer and admin user perspectives. Basic navigation, static content and feature testing has been provided.  These could be complemented by more isolated feature testing.  Such isolated tests would requre their own data which would be trivial to add using the provided mechanisms.  The isolated feature/integration testing would give quicker test/dev turnaround for feature development.

The suite has also been tested against a locally hosted version of the target site but in exatly the same way as the live version.  Additional staging only tests could be added to test the site in a more comprehensive manner, for example deleting all known bookings/messages and ensuring that the assiciated lists are completely empty.  

Performance testing has been touched on but reproduction detail is light and exact timings have not been given.  No load testing has been carried out.  Accessibility has been touched on.  Securty has not been tested other than admin pages re-directing to the login page when not logged in.

## Pre-requisites
- **Node.js** - tested with version 23.6.0
- **NVM** - optional, 0.39.1 was used 
- **Playwright** - see [Installing Playwright](https://playwright.dev/docs/intro#installing-playwright) 
- **Target Web Site** - [Restful Booker Platform](https://automationintesting.online/) available or a locally hosted version.  Source: [Github Repo](https://github.com/mwinteringham/restful-booker-platform) 

## Running Locally

### First time configuration

1. git clone https://github.com/matban666/restful-booker-playwright.git
2. cd restful-booker-playwright
3. nvm install 23.6.0
4. nvm use 23.6.0
5. npm install
6. Create a .env file and set values ([shown in the banner](https://automationintesting.online/)) for ADMIN_USERNAME and ADMIN_PASSWORD
7. To run against an different site you can also set BASE_URL in .env

### Every time

1. npx playwright test

### Expected Output

Currently 71 tests shoul run.  69 should pass and 2 should fail (Expected copyright date checks).

If the test fail midway it may be necessary to delete any leftover messages and rooms from the admin page.  I had intended to write a global teardown using the rest API to clean up completely but didn't have time.

## Running gitlab action

### First time configuration

1. Fork the repo
2. Add ADMIN_USERNAME and ADMIN_PASSWORD (values shown in the banner) as environment repository secrets

### Every time

1. Push a change to run the pipeline

## Directory Structure

<pre>
├── .gtihub
│   └── workflows
│       └── playwright.yml
├── tests-data
│   ├── types
│   │   ├── bad-email.ts
│   │   └── ...
│   ├──bad-emails.ts
│   │   └── ...
├── tests-plans
│   ├── end-to-end
│   │   ├──branding.feature
│   │   ├──contact-form.feature
│   │   └──room-booking.feature
│   ├── admin-navigation.feature
│   ├── calendar.feature
│   └── static-content.feature
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
├── package.json
└── .env
</pre>

## Directory Content

- **test-data** - contains json files containing data for test that require different permeatations
- **test-data/types** - contain interfaces for each of the files
- **tests-plans** - contains tests test plans for the associated tests
- **tests** - contains tests that test an isolated part of the site such as static items and navigation
- **tests/end-to-end** - contains tests that run through the system completely for partular aspect such as book rooms and check the admin details
- **utils/backend** - contains a module to directly test the rest api backend - just used for house keeping during the suite development an not part of the current testing
- **utils/domain** - contains modules with re-usable functions that do not include any playwright calls such as date manipluation and formatting
- **utils/playwright** - contains modules with re-usable functions that include snippets of playwright code to carry out particular tasks such as read a list
- **gtihub/workflows** - contans the github actions playwright.yml file

## Test Plans

[Test Plans](https://github.com/matban666/restful-booker-playwright/tree/main/test-plans) 

## Feature Tests

**static-content-spec.ts** - These tests iterate through the pages provided in pages.json to ensure they all have the footer and that the footer links work, one test deliberately fails on the copyright being shown as 24 and not 25.

**admin-navigation-spec.ts** - This test checks that the links on the admin page all work.  It also checks that if not logged in the admin links redirect to the login page.  It checks that you can naviate between the booking and admin page.

**calendar.spec.ts** - This checks that the month and year are correct and today is highlighted.  It checks that the month navigation buttons work correctly.

## End To End Tests

branding.spec.ts - This tests that the website can be rebranded with branding supplied in branding-alternate.json.  It reverts back to branding-default.json and checks that it has been applied.

contact-form.spec.ts - This iterates through contact-form-messaging.json entering them into the contact form.  It then checks to see if the messages have appeared correctly on the admin panel.  It also checks some bad input responses.  It deletes the messages afterwards.

room-booking.sec.ts - This creates rooms from rooms.json.  Makes bookings from bookings.json - some bad bookings are checked to.  Sucessful bookings are checked in the admin report, rooms, and messages pages.  The messages, bookings and rooms are deleted afterwards.

## Restful Booker Bugs

An example of bugs observed in the Restful Booker Platform can be found in [restful-booker-platform-bugs.yaml](https://github.com/matban666/restful-booker-playwright/blob/main/restful-booker-platform-bugs.yaml).  Areas not addressed or addressed fully include securty, accessibility and detail on performance.

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
- Room features are not selected when adding a room
- Location map is not tested

## Tests to add if bug fixed
- Cancel button on room edit (bug #9)

## Additional Work
- "TODO" comments within the test code document further checks and work
- Test on more browsers, might need per browser data sets
- booking-list.ts, message-list.ts, room-list.ts commonality should be refactored using templates/generics
- booking-list.ts, message-list.ts, room-list.ts also use the any type, these should be strogly types as part of the above work
- Create a global teardown to clear out any remaining rooms/messages/bookings in the case of test failures
- Some tests are a bit flakey I think due to react components not loading in a timely manner
- Some of the playwright errors don't give useful information - see if this can be improved
- github action works but all the tests rarely pass - why
- Get Playwright to use Gherkin?
