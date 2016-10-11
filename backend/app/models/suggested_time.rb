class SuggestedTime < ActiveRecord::Base
  serialize :suggested_times
  belongs_to :request
end
