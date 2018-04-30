Feature: Select route on a map
  As a user
  So that I can select where to be picked up and where to be dropped off
  I want to be able to chose my route
  
  Scenario: User enters the select a route page
    Given I am at the Cart Requirements page
    Given there is at least one cart available
    When I specify the number of seats I need 
      And I click Find a ride
    Then I see a table with the start and end points of some routes
    
#   @ignore
#   Scenario: User selects a route and a TAMUber is available
#     Given I am at the select destination page
#       And a TAMUber is available
#     When I select route number 5
#     Then I should see the go to pickup point page for that route
    
# @ignore
#   Scenario: User selects a route and a TAMUber is not available
#     Given I am at the select destination page
#       And a TAMUber is not available
#     When I select route number 4
#     Then I should see a message telling me no TAMUbers are available