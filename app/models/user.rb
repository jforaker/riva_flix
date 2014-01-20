class User < ActiveRecord::Base
  #attr_accessible :provider, :uid, :name, :email
  validates_presence_of :name

  acts_as_follower
  acts_as_followable
  acts_as_liker

  has_many :watches

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
        user.name = auth['info']['name'] || ""
        user.email = auth['info']['email'] || ""
        user.image = auth['info']['image'] || ""
      end
    end
  end

  private

  def user_params
    params.require('user').permit(:provider, :uid, :name, :email, :user, :image)
  end

end
