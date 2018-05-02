require 'selenium-webdriver'
driver = Selenium::WebDriver.for :firefox

Before do
    load "#{Rails.root}/db/seeds.rb"
    Capybara.javascript_driver = :webkit
end