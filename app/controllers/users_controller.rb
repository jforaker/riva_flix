class UsersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :correct_user?, :except => [:index, :show, :follow, :unfollow]

  def index
    @users = User.all
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      redirect_to @user
    else
      render :edit
    end
  end


  def show
    @user = User.find(params[:id])
    @followers = @user.followers(User)
    @users = User.all
    response = {:user => @user, :followers => @followers, :users => @users}

    respond_to do |format|
      format.html  #followers.html.erb
      format.json {render :json => response}
    end
  end


  def follow
    @user = User.find(params[:user])
    current_user.follow!(@user)
  end

  def unfollow
    @user = User.find(params[:user])
    current_user.unfollow!(@user)
  end


end
