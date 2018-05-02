# Before do
#     load "#{Rails.root}/db/seeds.rb"
# end

Given (/^I am at the select a route page$/) do
  visit("/trips/new")
end

Given (/I am at the Cart Requirements page/) do
    visit('/specify')
end
  
Given (/a TAMUber is not available/) do
    carts = Cart.all 
    carts.each do |cart|
        cart.inUse = true;
        cart.save
    end
end

Given(/there is at least one cart available/) do
    carts = Cart.all
    carts[0].inUse = false
    carts[0].save
    Rails.logger.info carts[0].inspect
end

When (/I click Get A Ride/) do
    click_link('Get A Ride')
end

When (/^I click view on route (\d+)$/) do |routeNum|
    @routeNum = routeNum
    find('#routebut_' + routeNum.to_s).click 
    
end

Then (/I see a table with the start and end points of some routes/) do
    expect(page).to have_content('Start')
    expect(page).to have_content('End')
end

Then(/^I see a map$/) do
    #expect(page).to have_selector("div", id: "mapid");
    page.should have_xpath "//script[contains(.,'new google.maps.Map')]"
end

Then(/^ I should see the screen titled (\w+)/) do |title|
    expect(page).to have_selector("h1", :innerHTML => title)
end

Then(/The route is highlighted/) do
    expect(find('#route_' + @routeNum)['background']).to eq('#FFFF87')
end

# Then(/^I should see the go to pickup point page for that route$/) do
#     @route = CartRoute.find(@routeNum)
#     #page.should have_content @route[:pickup_name]
#     expect(page).to have_content @route[:pickup_name]
# end

Then (/^I should see a message telling me no TAMUbers are available$/) do
   #page.has_content?("No TAMUbers available") 
   #page.should have_content 'No TAMUbers available'
   expect(page).to have_content 'No carts available'
end
