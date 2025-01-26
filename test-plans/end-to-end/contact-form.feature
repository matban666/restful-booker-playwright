Feature: Contact Form Functionality
  As a user
  I want to use the contact form to send messages
  So that I can communicate with the admin and verify form validations

  Background:
    Given I am on the homepage

  @positive
  Scenario Outline: Submit Contact Form Successfully
    When I fill in the contact form with:
      | Name          | <contactName>      |
      | Email         | <contactEmail>     |
      | Subject       | <contactSubject>   |
      | Phone         | <contactPhone>     |
      | Description   | <contactDescription> |
    And I click the "Submit" button
    Then I should see the confirmation message:
      """
      Thanks for getting in touch
      """
    And I should see the following details:
      | <contactName>       |
      | We'll get back to you about <contactSubject> as soon as possible. |

    Examples:
      | contactName | contactEmail           | contactSubject     | contactPhone     | contactDescription    |
      | John Doe    | john@example.com       | Inquiry            | +12345678901     | I have a question.    |
      | Jane Smith  | jane.smith@example.com | Feedback           | +19876543210     | Here's my feedback.   |

  @admin
  Scenario Outline: Verify Admin Received the Message
    Given I log in as an admin
    When I check for messages from "<contactName>" with subject "<contactSubject>"
    Then I should see exactly one message in the admin panel

    Examples:
      | contactName | contactSubject |
      | John Doe    | Inquiry        |
      | Jane Smith  | Feedback       |

  @admin
  Scenario Outline: Verify Message Content
    Given I log in as an admin
    When I open the message from "<contactName>" with subject "<contactSubject>"
    Then I should see the message details:
      | From      | <contactName>       |
      | Phone     | <contactPhone>      |
      | Email     | <contactEmail>      |
      | Subject   | <contactSubject>    |
      | Message   | <contactDescription> |

    Examples:
      | contactName | contactEmail           | contactSubject | contactPhone     | contactDescription    |
      | John Doe    | john@example.com       | Inquiry        | +12345678901     | I have a question.    |
      | Jane Smith  | jane.smith@example.com | Feedback       | +19876543210     | Here's my feedback.   |

  @admin
  Scenario Outline: Delete Message
    Given I log in as an admin
    When I delete the message from "<contactName>" with subject "<contactSubject>"
    Then the message should no longer appear in the admin panel

    Examples:
      | contactName | contactSubject |
      | John Doe    | Inquiry        |
      | Jane Smith  | Feedback       |

  @negative
  Scenario: Submit Blank Contact Form
    When I click the "Submit" button
    Then I should see the following error messages:
      | Message must be between 20 and 2000 characters. |
      | Phone may not be blank                          |
      | Subject may not be blank                        |
      | Name may not be blank                           |
      | Message may not be blank                        |
      | Phone must be between 11 and 21 characters.     |
      | Subject must be between 5 and 100 characters.   |
      | Email may not be blank                          |

  @negative
  Scenario: Submit Form Without Name
    When I fill in the contact form with:
      | Name          | ""                        |
      | Email         | john@example.com          |
      | Subject       | Inquiry                   |
      | Phone         | +12345678901              |
      | Description   | I have a question.        |
    And I click the "Submit" button
    Then I should see the error message:
      """
      Name may not be blank
      """

  @negative
  Scenario Outline: Submit Form With Invalid Email
    When I fill in the contact form with:
      | Email         | <invalidEmail>            |
    And I click the "Submit" button
    Then I should see the error message:
      """
      <errorMessage>
      """

    Examples:
      | invalidEmail       | errorMessage                                 |
      | invalid-email.com  | Invalid email address                        |
      | @example.com       | Invalid email address                        |
      | user@              | Invalid email address                        |
      | ""                 | Email may not be blank                       |
