Feature: Enter the site
  As a user
  So that I can read about what TAMUber is before I book one
  I want to see information about TAMUber before I enter the site
  
  Scenario: User visits the home page
    Given I am at the home page 
    Then I should see 'TAMUber is a service'
        And I should see 'Get A Ride'
        
  Scenario: User enters the site 
    Given I am at the home page 
    When I click Get A Ride 
    Then I should see 'Cart Requirements'