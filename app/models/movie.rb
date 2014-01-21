class Movie < ActiveRecord::Base
  acts_as_likeable
  has_many :likes
end
