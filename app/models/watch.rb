class Watch < ActiveRecord::Base
  belongs_to :user
  acts_as_likeable
end
