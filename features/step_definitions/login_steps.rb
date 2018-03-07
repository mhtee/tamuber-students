Given("I am at the home page") do
  visit "/"
end

When("I click {string}") do |page_name|
  click_link page_name
end

Then("I should see the screen titled {string}") do |title|
  response.should have_selector('h1', text: title)
end
