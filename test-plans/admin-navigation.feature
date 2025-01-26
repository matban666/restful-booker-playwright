Feature: Admin Page Navigation
  As an admin user
  I want to navigate through the admin panel and verify functionality
  So that I can ensure all links and features are working correctly

  Background:
    Given I load the homepage

  @home_to_admin
  Scenario: Navigate from Home Page to Admin Panel
    When I click on the "Admin panel" link
    Then I should see the "B&B Booking Management" link

  @login
  Scenario: Log In to Admin Panel
    Given I start a new admin session
    Then I should see the "Logout" link

  @rooms
  Scenario: Navigate to Rooms Page
    Given I resume an admin session
    When I click on the "Rooms" link
    Then I should see the "B&B Booking Management" link
    And I should see the "Room #" text

  @report
  Scenario: Navigate to Report Page
    Given I resume an admin session
    When I click on the "Report" link
    Then I should see the "B&B Booking Management" link
    And I should see the "Today" button

  @branding
  Scenario: Navigate to Branding Page
    Given I resume an admin session
    When I click on the "Branding" link
    Then I should see the "B&B Booking Management" link
    And I should see the "B&B details" heading

  @messages
  Scenario: Navigate to Messages Page
    Given I resume an admin session
    When I click on the "Messages" link
    Then I should see the "B&B Booking Management" link
    And I should see the "Name" text
    And I should see the "Subject" text

  @visit_home
  Scenario: Visit Home Page from Admin Panel
    Given I resume an admin session
    When I click on the "Front Page" link
    Then I should be redirected to the homepage
    When I click on the "Admin panel" link
    Then I should see the "B&B Booking Management" link

  @footer
  Scenario: Verify Footer
    Given I resume an admin session
    Then the footer should contain the text "restful-booker-platform"

  @cookie_policy
  Scenario: Verify Cookie Policy Link
    Given I resume an admin session
    Then the footer should contain a "Cookie-Policy" link

  @privacy_policy
  Scenario: Verify Privacy Policy Link
    Given I resume an admin session
    Then the footer should contain a "Privacy-Policy" link

  @logout
  Scenario: Log Out from Admin Panel
    Given I resume an admin session
    When I click on the "Logout" link
    Then I should be redirected to the admin login page

  @redirects
  Scenario Outline: Redirects to Login When Not Logged In
    Given I navigate to "<page>"
    Then I should see the login header

    Examples:
      | page              |
      | /admin/report     |
      | /admin/branding   |
      | /admin/messages   |
