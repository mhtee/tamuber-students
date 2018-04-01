Feature: Select route on a map
  As a user
  So that I can see where I choose to be picked up and where I choose to be dropped off
  I want to be able to chose my route on a map
  
  Scenario: User enters the select destination page
    Given I am at the home page
    When I click enter
    #Then I see a map
    Then I see all routes displayed on the map
    
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