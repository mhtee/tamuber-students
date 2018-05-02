require "end_tester"

describe EndTester do

	describe ".end" do
		context "when on end screen" do
			it "starts from correct point" do
				@route = Trip.new
				expect(@coordinates).to eql(nil)
			end
		end
	end
end

