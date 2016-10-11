class LandingController < ApplicationController
  def page
    render json: {
      wegot: 'page'
    }
  end
end
