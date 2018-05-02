Before do
    load "#{Rails.root}/db/seeds.rb"
end

# Given (/^I am at the select a route page$/) do
#   visit("/trips/new")
# end

When(/I specify the number of seats I need/) do
    select(1, :from => "seat_count")
    expect(page).to have_select('seat_count', selected: '1')
end

When (/I click Find a ride/) do
    # expect(find('#findRide')['id']).to has_match 'findRide'
    # click_button('Find a ride')
    #click_on('Find a ride')
    #expect(page).to have_content('Find a ride')
    #find('a#findRide.btn.btn-primary').click
    #find('#findRide').click
    click_button('Find a ride')
    #click_link('Find a ride')
    #expect(find('#findRide')).to be 5
    #expect(find('#findRide')['innerHTML']).to eq('Find a ride')
    # submit_form 'route_specs'
    #page.save_screenshot('findRideButtonClicked.png')
    # expect(page).to have_content('available')
    # current_path.should == '/trips/new'
end

Then (/I see the Cart Requirements selection/) do
    expect(page).to have_content('Cart Requirements')
end

Then(/it has a selection for seats/) do
    expect(page).to have_selector('select', :id => 'seat_count')
end

Then(/it has a selection for handicap access/) do
    expect(page).to have_selector('input', :id => 'handicap_access')
end