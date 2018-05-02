require "pickup_tester"

describe PickupTester do

	describe ".pickup" do
		context "when on pickup screen" do
			it "starts from correct point" do
				Trip.new
				expect(@coordinates).to eql(nil)
			end
		end
	end
end

