Given (/^I am at the select destination page$/) do
  visit("/trips/new")
end
  
Given (/^a TAMUber is\s?(not)? available$/) do |avail|
    if avail == " not"
        @available = false
    else
        @available = true
    end
end

When (/^I click (\w+)$/) do |clicked|
    click_link(clicked)
end

When (/^I select route number (\d+)$/) do |routeNum|
    @routeNum = routeNum
end

Then (/^I see all routes displayed on a map$/) do
    #at least one path is displayed on the map
    page.has_selector?("way")
end

Then(/^I should see the go to pickup point page for that route$/) do
    @route = CartRoute.find(@routeNum)
    expect(page).to_have_content @route[:pickup_name]
end

Then (/^I should see a message telling me no TAMUbers are available$/) do
   expect(page).to_have_content("No TAMUbers available") 
end
