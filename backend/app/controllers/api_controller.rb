class ApiController < ApplicationController
  before_filter :authenticate

  private
  def authenticate
    api_key = request.headers['X-Auth-Token']
    @user = User.find_by api_key: api_key
    if @user.nil?
      raise ActionController::RoutingError.new('User not found')
    end
  end

end
