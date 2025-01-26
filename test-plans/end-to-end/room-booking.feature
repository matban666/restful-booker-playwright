Feature: Room and Booking Management
  To ensure proper functionality of the room and booking management system,
  admin users and customers should be able to manage rooms, bookings, reports, and messages as expected.

  Background:
    Given the application is running
    And valid room and booking data is loaded from "rooms.json" and "bookings.json"

  Scenario Outline: Admin creates a new room
    Given I log in as an admin
    And I navigate to the "Rooms" page
    When I create a room with the name "<roomName>" and price "<roomPrice>"
    And I update the room with description "<description>" and image "<image>"
    Then the room "<roomName>" should appear in the list

    Examples:
      | roomName  | roomPrice | description       | image          |
      | Room A    | 100       | Deluxe Room       | image1.png     |
      | Room B    | 150       | Luxury Suite      | image2.png     |

  Scenario Outline: Customer books a room
    Given I am on the homepage
    When I book the room "<roomName>" with the following details:
      | Check-In Date | Check-Out Date | First Name | Last Name | Email          |
      | <checkIn>     | <checkOut>     | <firstName> | <lastName> | <email>       |
    Then the booking confirmation should display for "<roomName>"

    Examples:
      | roomName | checkIn     | checkOut     | firstName | lastName | email             |
      | Room A   | 2025-02-01  | 2025-02-05  | John      | Doe      | john.doe@test.com |
      | Room B   | 2025-03-01  | 2025-03-10  | Jane      | Smith    | jane.smith@test.com |

  Scenario Outline: Admin verifies a booking in the report
    Given I log in as an admin
    And I navigate to the "Report" page
    When I filter bookings for "<email>" between "<checkIn>" and "<checkOut>"
    Then I should see the booking for "<roomName>" under the name "<fullName>"

    Examples:
      | email               | checkIn     | checkOut     | roomName | fullName       |
      | john.doe@test.com   | 2025-02-01  | 2025-02-05  | Room A   | John Doe       |
      | jane.smith@test.com | 2025-03-01  | 2025-03-10  | Room B   | Jane Smith     |

  Scenario Outline: Admin checks for booking messages
    Given I log in as an admin
    When I search for messages from "<sender>" with the subject "You have a new booking!"
    Then I should find "<messageCount>" messages matching the expected booking details

    Examples:
      | sender            | messageCount |
      | system@test.com   | 1            |
      | notifications@bb.com | 2          |

  Scenario Outline: Admin deletes a room
    Given I log in as an admin
    And I navigate to the "Rooms" page
    When I delete the room "<roomName>"
    Then the room "<roomName>" should no longer appear in the list

    Examples:
      | roomName  |
      | Room A    |
      | Room B    |

  Scenario Outline: Admin deletes a booking
    Given I log in as an admin
    And I navigate to the "Rooms" page
    When I delete the booking for "<fullName>" in "<roomName>"
    Then the booking should no longer appear under "<roomName>"

    Examples:
      | fullName  | roomName  |
      | John Doe  | Room A    |
      | Jane Smith | Room B   |
