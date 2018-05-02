When(/I click 'Start Trip'/) do
    click_button('Start Trip')
end

Then(/I see the name of the pickup point/) do
    expect(page).to have_content('Pickup location')
end

Then(/I see the name of my destination/) do
    expect(page).to have_content('Destination')
end

Then(/I see my cart number/) do
    expect(page).to have_content('Cart Number')
end

Then(/I see the cart's estimated time to arrival/) do
    expect(page).to have_content('ETA')
end

Then("I should see {string}") do |string|
    expect(page).to have_content(string)
end