Feature: Branding Functionality
  As an admin
  I want to apply and verify branding settings
  So that I can ensure the branding updates are applied correctly

  Background:
    Given I load the test configuration from "branding-alternate.json"

  @branding
  Scenario Outline: Apply and verify alternate branding
    Given I start a new admin session
    When I apply branding with the following details:
      | Name         | <name>         |
      | Logo URL     | <logoUrl>      |
      | Description  | <description>  |
      | Latitude     | <latitude>     |
      | Longitude    | <longitude>    |
      | Contact Name | <contactName>  |
      | Address      | <address>      |
      | Phone        | <phone>        |
      | Email        | <email>        |
    Then the branding settings should be visible on the homepage:
      | Name         | <name>         |
      | Logo URL     | <logoUrl>      |
      | Description  | <description>  |
      | Contact Name | <contactName>  |
      | Address      | <address>      |
      | Phone        | <phone>        |
      | Email        | <email>        |

    Examples:
      | name           | logoUrl             | description       | latitude | longitude | contactName | address              | phone       | email                 |
      | Branding 1     | /logo1.png          | "Description 1"   | 40.7128  | -74.0060  | Admin One   | 123 Main St, City 1 | 123-456-7890 | admin1@example.com    |
      | Branding 2     | /logo2.png          | "Description 2"   | 34.0522  | -118.2437 | Admin Two   | 456 Elm St, City 2  | 987-654-3210 | admin2@example.com    |

  @default_branding
  Scenario: Apply and verify default branding
    Given I resume an admin session
    When I apply the default branding
    Then the default branding settings should be visible on the homepage
