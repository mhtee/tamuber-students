# require 'selenium-webdriver'
# driver = Selenium::WebDriver.for :firefox


# Before do
#     load "#{Rails.root}/db/seeds.rb"
#     Capybara.javascript_driver = :webkit
# end

# Given (/^I am at the select a route page$/) do
#   visit("/trips/new")
# end

When(/I specify the number of seats I need/) do
    select(1, :from => "seat_count")
    expect(page).to have_select('seat_count', selected: '1')
end

When (/I click Find a ride/) do
    click_button('Find a ride')
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