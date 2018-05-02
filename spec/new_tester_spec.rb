require "new_tester"

describe NewTester do

	describe ".new" do
		context "given new trip" do
			it "creates correct trip" do
				expect(NewTester.new).to eql(Trip.new)
			end
		end
	end
end

