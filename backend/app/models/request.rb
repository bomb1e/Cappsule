class Request < ActiveRecord::Base
  has_many :suggested_times
  belongs_to :user
end
