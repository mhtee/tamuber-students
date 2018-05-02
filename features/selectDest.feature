
Feature: Select route on a map
  As a user
  So that I can select where to be picked up and where to be dropped off
  I want to be able to chose my route
  
  not @javascript
  Scenario: User enters the select a route page
    Given I am at the Cart Requirements page
    Given there is at least one cart available
    When I specify the number of seats I need 
      And I click Find a ride
    Then I see a table with the start and end points of some routes
    
  Scenario: User enters the select a route page and no carts are available
    Given I am at the Cart Requirements page
    Given a TAMUber is not available
    When I click Find a ride
    Then I should see a message telling me no TAMUbers are available 
    
  not @javascript
  Scenario: User clicks view on a route 
    Given I am at the Cart Requirements page
      And there is at least one cart available
    When I click Find a ride
      And I click view on route 1
    Then The route is highlighted 