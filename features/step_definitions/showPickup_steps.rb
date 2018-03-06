Given(/^I am at the select route page$/) do
    visit("/trips/new");
end

When(/^I select route number (\d+)$/) do |routeId|
    @route = CartRoute.find(routeId)
end

Then(/^Then I see a map$/) do
    expect(page).to have_selector("div", id: "mapid")
end

Then(/^The map has a pin at the pickup point for route number (\d+)$/) do |routeId|
    expect(page).to have_selector("node", lat: CartRoutes.find(routeId).coordinates[:lat], lon: CartRoutes.find(routeId).coordinates[:lng])
end

Then(/^I see the name of the pickup point for route number (\d+)$/) do |routeId|
    expect(page).to have_content(@route[:startPoint])
end