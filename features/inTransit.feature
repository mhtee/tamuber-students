Feature: View route information while in transit
  As a user
  So that I can see my route information and progress
  I want to be able to see cart and route information while in transit
  
  #@javascript
  Scenario: The user has been picked up
    Given I am at the Cart Requirements page
        And there is at least one cart available
    When I click Find a ride 
      And I click view on route 1
      And I click 'Start Trip'
    Then I should see 'in transit'
        And I see the name of the pickup point
        And I see the name of my destination
        And I see my cart number 
        And I see the cart's estimated time to arrival
  