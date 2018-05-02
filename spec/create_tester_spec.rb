require "create_tester"

describe CreateTester do

	describe ".create" do
		context "when creating route" do
			it "creates correct route" do
				@trip = Trip.new
				expect(@trip).not_to eql(nil)
			end
		end
	end
end

