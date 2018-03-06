Feature: Show pickup point on a map
  As a passenger
  So that I can see where I need to go to be picked up by my TAMUber
  I want to see where to meet my TAMUber
  
  Scenario: User selects a route
    Given I am at the select route page
    When I select route number 3
    Then I see a map 
      And The map has a pin at the pickup point for route number 3
      And I see the name of the pickup point for route number 3
      