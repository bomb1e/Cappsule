class LoginController < ApplicationController
  def login
    phone_number = params[:phone_number]
    if phone_number.nil?
      raise ActionController::RoutingError.new('invalid request')
    end
    user = User.find_by phone_number: phone_number
    if user.nil?
      # new user
      user = User.new
      user.phone_number = phone_number
      user.api_key = generate_api_key
      user.save
      data = {
        user: user,
        status: 'New user created successfully'
      }
      result = {
        error: false,
        flag: 300,
        data: data
      }
      render json: result
    else
      user.api_key = generate_api_key
      user.save
      data = {
        user: user,
        status: "Welcome #{user.name}"
      }
      result = {
        error: false,
        flag: 301,
        data: data
      }
      render json: result
    end
      end

  private
    def generate_api_key
      SecureRandom.urlsafe_base64(24)
    end
end
