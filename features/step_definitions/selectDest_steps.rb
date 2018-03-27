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

# When (/^I select route number (\d+)$/) do |routeNum|
#     @routeNum = routeNum
# end

Then(/^I see a map$/) do
    #expect(page).to have_selector("div", id: "mapid");
    page.should have_xpath "//script[contains(.,'new google.maps.Map')]"
end

Then(/^ I should see the screen titled (\w+)/) do |title|
    expect(page).to have_selector("h1", :innerHTML => title)
end

Then (/^I see all routes displayed on the map$/) do
    #self.set_fixture_class cart_routes: CartRoute
    @pass = true
    @exp = expect(page).to have_xpath("//script[contains(.,'new google.maps.Map')]", count: CartRoute.count)
    #the correct routes are displayed on the map
    CartRoute.all.each { |route|
        if !expect(page).to have_selector("input",  :text => "complete nonsense")
            @pass = false;
            break;
        end
    }
    #expect(page).to have_selector("input",  :text => "test")
    expect(@exp).to be true
end

Then(/^I should see the go to pickup point page for that route$/) do
    @route = CartRoute.find(@routeNum)
    #page.should have_content @route[:pickup_name]
    expect(page).to have_content @route[:pickup_name]
end

Then (/^I should see a message telling me no TAMUbers are available$/) do
   #page.has_content?("No TAMUbers available") 
   #page.should have_content 'No TAMUbers available'
   expect(page).to have_content 'No TAMUbers available'
end