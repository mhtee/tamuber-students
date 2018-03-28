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

When (/^I click (\D+)$/) do |clicked|
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
    @pass = true
    #the correct routes are displayed on the map
    CartRoute.all.each do |route|
        if !(expect(page).to have_selector("//input", :text => route.startPoint + " to " + route.endPoint))
            @pass = false
            break
        end
    end
    expect(@pass).to be true
    expect(page).to have_selector("//div[@id => 'markers']") #a marker is here
    #expect(page).to have_selector("//img[@src => 'https://maps.gstatic.com/mapfiles/undo_poly.png']", ) #a route is here
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