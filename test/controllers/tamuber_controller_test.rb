require 'test_helper'

class TamuberControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get tamuber_index_url
    assert_response :success
  end

end
