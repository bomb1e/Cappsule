class CapsulesController < RequestsController
  ## A capsule has all accepted requests, ((requests.accepted_time).present?)
  ## the user with whom you have that request, who?(request))
  ## the request's activity, (request.activity)
  ## the date and time of that request, ()
  ## and the summary of that request

  def all
    all_capsules = []
    all_friends = []
    requests = []
    # requests = Request.where('sender_id = ? OR receiver_id = ? AND status = 2', @user.id, @user.id)
    all_requests = Request.where('sender_id = ? OR receiver_id = ?', @user.id, @user.id)

    # find requests with unique users
    all_requests.each do |request|
      all_friends.push(who(request))
    end

    all_friends.uniq!
    activities = []
    all_friends.each do |friend|
      all_requests.each do |request|
        activities.push(Activity.find(request.activity_id).symbol)
        if(friend[:id] === request.sender_id || friend[:id] === request.receiver_id )
          requests.push({
            request: request,
            summary: pretty(request)
            })
        end
      end
      if(friend[:id] != @user.id)
        all_capsules.push({
          partner: friend,
          requests: requests,
          activities: activities.uniq!
          })
      end
      requests = []
    end

    result = {
      error: false,
      flag: 401,
      data: {
        capsules: all_capsules
      }
    }
    render json: result
    return all_capsules
  end

  def our
    partner = User.find(params[:partner_id])
    capsules = all
    our_capsule = which(capsules, partner)
    render json: our_capsule
  end

  private

  def pretty(request)
    partner = who(request)
    activity = Activity.find(request.activity_id).title
    accepted_time = request.accepted_time
    return "#{activity}"
  end

    def which(capsules, partner)
      capsules.each do |capsule|
        if capsule.partner.id == partner.id
          return capsule
        end
      end
    end

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
