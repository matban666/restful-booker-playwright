Feature: Calendar Functionality
  As a tester
  I want to verify the calendar's functionality
  So that I can ensure the correct dates and buttons are working as expected

  Background:
    Given I load the homepage
    And I click the "Book this room" button

  @initial_date
  Scenario: Initial Date is displayed correctly
    Given I open the calendar
    Then the calendar header should display the current month and year
    And the current day should be highlighted in the calendar

  @today_button
  Scenario: Today button navigates to the current date
    Given I open the calendar
    When I click the "Today" button
    Then the calendar header should display the current month and year
    And the current day should be highlighted in the calendar
