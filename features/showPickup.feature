
Feature: Show pickup point on a map
  As a passenger
  So that I can see where I need to go to be picked up by my TAMUber
  I want to see where to meet my TAMUber
  
  not @javascript
  Scenario: User selects a route
    Given I am at the Cart Requirements page
        And there is at least one cart available
    When I click Find a ride 
      And I click view on route 1
      And I click 'Start Trip'
    Then I see the name of the pickup point
        And I see the name of my destination
        And I see my cart number 
        And I see the cart's estimated time to arrival
      