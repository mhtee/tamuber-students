
Feature: Select cart requirements
  As a user
  So that I can get a cart that meets my requirements
  I want to be able to specify the number of seats and whether I need handicap access
  
Scenario: Specify number of seats and handicap requriements
    Given I am at the home page
    When I click Get A Ride
    Then I see the Cart Requirements selection
        And it has a selection for seats 
        And it has a selection for handicap access
