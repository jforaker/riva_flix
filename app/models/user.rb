class User < ActiveRecord::Base
  #attr_accessible :provider, :uid, :name, :email
  validates_presence_of :name

  has_many :watches

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
         user.name = auth['info']['name'] || ""
         user.email = auth['info']['email'] || ""
      end
    end
  end

  private

  def user_params
    params.require('user').permit(:provider, :uid, :name, :email, :user, :permalink)
  end

end
