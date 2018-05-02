require "new_tester"

describe NewTester do

	describe ".new" do
		context "given new trip" do
			it "creates correct trip" do
				expect(Trip.new).not_to eql(nil)
			end
		end
	end
end

