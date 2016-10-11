class RequestsController < ApiController
  # before_filter for request, receiver or sender exists
  # before_filter if receiver_id is me

  def new
    request = Request.new
    request.sender_id = @user.id
    request.receiver_id = params[:receiver_id]
    request.activity_id = params[:activity_id]
    suggested_times = SuggestedTime.new
    suggested_times.suggested_times = params[:suggested_times]
    suggested_times.type_of_suggestion = 1 # initial
    suggested_times.creator = @user.id

    data = {
      request: request,
      suggested_times: suggested_times
    }

    if User.exists? request.receiver_id # find recepient
      recepient = User.find(request.receiver_id)
      request.status = 1
      response = {
        error: false,
        flag: 100,
        data: data
      }

      if request.save
        suggested_times.request_id = request.id
        suggested_times.save
        notify(recepient, request) ## Tell recepient that he has a new request
      end
    else #
      response = {
        error: true,
        flag: 100,
        message: 'User not found'
      }
    end
    render json: response
  end

  def accept
    request = Request.find(params[:request_id])
    request.accepted_time = params[:accepted_time]
    request.status = 2 # accepted
    if @user.id == request.sender_id
      if request.save
        notify(receiver, request)
      end
    else
      if request.save
        sender = User.find(request.sender_id)
        notify(sender, request)
      end
    end
  end

  def reschedule
    request = Request.find(params[:request_id])
    suggested_times = SuggestedTime.create(params[:suggested_times])
    suggested_times.creator = @user.id
    suggested_times.type_of_suggestion = 2 # reschedule type
    request.status = 3 #rescheduled

    ## Review this hack to notify reschedulee
    if @user.id == request.sender_id
      if suggested_times.save
        notify(request.receiver_id, request)
      end
    else
      if suggested_times.save
        notify(request.sender_id, request)
      end
    end

    render json: {request: request, suggested_times: suggested_times}
  end


  def deny
    request = Request.find(params[:request_id])
    request.status = 4
    if request.save
      notify(request.sender_id, request)
    end
  end

  def a
    request = Request.find(params[:request_id])
    result = {
      error: false,
      data: request
    }
    render json: result
  end

  def notifications
    all_notifications = Notification.where('to_id = ?', @user.id)
    notifications = []
    all_notifications.each do |notification|
      if(!notification.checked)
        from = who(notification.user_id)
        request = Request.find(notification.request_id)
        activity = Activity.find(request.activity_id)
        suggested_times = SuggestedTime.find_by(request_id: request.id).suggested_times
        notifications.push({
          notification: notification,
          user: from,
          request: {
            request: request,
            suggested_times: suggested_times,
            activity: activity
          }

          })
      end
    end
    result = {
      error: false,
      flag: 501,
      data: {
        notifications: notifications
      }
    }
    all_notifications.each do |notification|
      notification.checked = true
    end
    render json: result
  end

  def activities
    activities = Activity.all
    result = {
      error: false,
      flag: 502,
      data: {
        activities: activities
      }
    }
    render json: result
  end

  private
    def notify(user, request)
      notification = Notification.new
      notification.user_id = @user.id
      notification.to_id = user.id
      notification.request_id = request.id
      case request.status
      when 1
        notification.summary = "New request from #{User.find(request.sender_id).name}"
      when 2
        notification.summary = "#{User.find(request.sender_id).name} has accepted #{Activity.find(request.activity_id).title}"
      when 3
        notification.summary = "#{User.find(request.sender_id).name} has rescheduled the request"
      when 4
        notification.summary = "#{User.find(request.sender_id).name} has accepted the request"
      end
      notification.save
      # Send push notification
    end

    def all
      return Request.find_by(@user.id)
    end

    def who(id)
      partner = User.find(id)
      return {
        id: partner.id,
        name: partner.name,
        phone_number: partner.phone_number,
        avatar: partner.avatar
      }
    end
end
