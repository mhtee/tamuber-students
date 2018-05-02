require "create_tester"

describe CreateTester do

	describe ".create" do
		context "when creating route" do
			it "creates correct route" do
				expect(@trip).to eql(Trip.new)
			end
		end
	end
end

