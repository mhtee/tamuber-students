require "pickup_tester"

describe PickupTester do

	describe ".pickup" do
		context "when on pickup screen" do
			it "starts from correct point" do
				expect(@start).to eql(@route.coordinates[0])
			end
		end
	end
end

