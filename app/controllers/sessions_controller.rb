class SessionsController < ApplicationController

  def new
    redirect_to '/auth/facebook'
  end


  def create
    auth = request.env["omniauth.auth"]
    user = User.where(:provider => auth['provider'], 
                      :uid => auth['uid'].to_s).first || User.create_with_omniauth(auth)

    reset_session
    session[:user_id] = user.id
    #if request.filtered_parameters['action'] === "create"
    #  watch_id = 1
    #  login_and_return_to_watches
    #
    #else
      redirect_to request.env['omniauth.origin'] || '/default'

      #redirect_to root_url, :notice => 'Signed in!'
    #end

  end

  def login_and_return_to_watches
    auth = request.env["omniauth.auth"]
    user = User.where(:provider => auth['provider'],
                      :uid => auth['uid'].to_s).first || User.create_with_omniauth(auth)
    reset_session
    session[:user_id] = user.id
    redirect_to watches_path(771362179), :notice => "signed in"
  end

  def destroy
    reset_session
    redirect_to root_url, :notice => 'Signed out!'
  end

  def failure
    redirect_to root_url, :alert => "Authentication error: #{params[:message].humanize}"
  end

end
