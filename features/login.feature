Feature: Display a login form on the index page
  As a user of TAMUber
  I want to log in to the site
  So that I can verify my identity
  
  Scenario: Logging in
    Given I am at the home page
    When I click "Log In"
    Then I should see the screen titled "Select Destination"
    