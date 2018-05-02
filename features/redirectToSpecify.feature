Feature: Show me the 'Cart Reqirements' page if I haven't started a trip yet
  As a user
  So that I can't view a pickup point or cart location that doesn't exist
  I want to see the 'Cart Requirements' page if I haven't started a trip yet
  
  Scenario: User tries to enter /pickup
    Given I try to visit the /pickup page
    Then I should see 'Cart Requirements'
    
  Scenario: User tries to enter /transit
    Given I try to visit the /transit page 
    Then I should see 'Cart Requirements'
      
  Scenario: User tries to enter /end 
    Given I try to visit the /end page 
     Then I should see 'Cart Requirements'