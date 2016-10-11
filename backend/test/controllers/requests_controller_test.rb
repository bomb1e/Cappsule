require 'test_helper'

class RequestsControllerTest < ActionController::TestCase
  test "should get all" do
    get :all
    assert_response :success
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get a" do
    get :a
    assert_response :success
  end

end
