 Rails.application.routes.draw do

  get "/", to: "landing#page", as: "landing_page"

  post "/", to: "landing#subscribe", as:"subscribe"

  get "/login/:phone_number", to: "login#login", as: "login"

  get "/me", to: 'users#me', as: "me"

  post "/me", to: 'users#update', as: 'update_user'

  get "/friends", to: 'users#friends', as: "all_friends"

  get "/friends/:id", to: 'users#friend', as: "my_friend"

  get "/capsules", to: 'capsules#all', as: "all_capsules"

  get "/capsules/:partner_id", to: 'capsules#our', as: "our_capsule"

  get "/reminders", to: 'reminders#all', as: "all_reminders"

  post "/requests", to: 'requests#new', as: "new_request"

  get "/requests/:id", to: 'requests#a', as: "a_request"

  post "/requests/:id", to: 'requests#accept', as: "accept_request"

  get "/notifications", to: 'requests#notifications', as: "all_notifications"

  get "/activities", to: 'requests#activities', as: "all_activities"
end
