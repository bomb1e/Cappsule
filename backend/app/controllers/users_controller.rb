class UsersController < ApiController
  def update
    @user.name = params[:name]
    @user.avatar = params[:avatar]
    @user.save

    result = {
      error: false,
      data: {
        user: @user
      }
    }
    render json: result
  end

  def me
    result = {
      error: false,
      flag: 301,
      data: {
        me: @user
      }
    }
    render json: result
  end

  def friends
    ## users with whom you share a request
    friends = []
    requests = Request.where('sender_id = ? OR receiver_id = ?', @user.id, @user.id)

    requests.each do |request|
      friends.push(who(request))
    end

    friends.uniq!
    result = {
      error: false,
      flag: 302,
      data: {
        friends: friends
      }
    }
    render json: result
  end

  def friend

  end

  private
  def who(request)
    if request.sender_id == @user.id
      partner = User.find(request.receiver_id)
      return {
        id: partner.id,
        name: partner.name,
        phone_number: partner.phone_number,
        avatar: partner.avatar
      }
    else
      partner = User.find(request.sender_id)
      return {
        id: partner.id,
        name: partner.name,
        phone_number: partner.phone_number,
        avatar: partner.avatar
      }
    end
  end
end
