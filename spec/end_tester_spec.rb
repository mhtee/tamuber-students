require "end_tester"

describe EndTester do

	describe ".end" do
		context "when on end screen" do
			it "starts from correct point" do
				expect(@start).to eql(@route.coordinates[0])
			end
		end
	end
end

