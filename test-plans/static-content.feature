Feature: Static Content Testing
  As a tester
  I want to verify the static content on each page
  So that I can ensure the application meets the expected standards

  Background:
    Given I load the test configuration from "pages.json"
    And I load the homepage if authentication is not required
    And I start an admin session if authentication is required

  @footer
  Scenario: Footer is visible
    Given I navigate to a page
    Then the footer should contain the text "restful-booker-platform"

  @copyright
  Scenario: Copyright notice is accurate
    Given I navigate to a page
    Then the copyright notice should display "© 2019-<current_year>"

  @cookie_policy
  Scenario: Cookie Policy link is functional
    Given I navigate to a page
    Then the footer should display a "Cookie-Policy" link
    When I click on the "Cookie-Policy" link
    Then I should be navigated to the Cookie Policy page
    And the page should display the heading "Cookie Policy"

  @privacy_policy
  Scenario: Privacy Policy link is functional
    Given I navigate to a page
    Then the footer should display a "Privacy-Policy" link
    When I click on the "Privacy-Policy" link
    Then I should be navigated to the Privacy Policy page
    And the page should display the heading "Privacy Policy Notice"
