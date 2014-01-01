class WatchesController < ApplicationController
  def index
    @watches = current_user.watches
  end

  def create
    if user_signed_in?
      #new_params = params.permit[:movie_id, :description, :title, :poster]
      @movie = Movie.find_by_movie_id(params[:movie_id]) || Movie.new(:audience_score => params[:audience_score], :critics_score => params[:critics_score], :poster => params[:poster], :movie_id => params[:movie_id], :title => params[:title])
      params[:movie_id] = @movie.movie_id
      params[:description] = @movie.description
      params[:title] = @movie.title
      params[:poster] = @movie.poster
      params[:critics_score] = @movie.critics_score
      params[:audience_score] = @movie.audience_score
      params[:user_id] =  current_user.id
      new_watch_movie = params.permit(:user_id, :movie_id, :description, :title, :poster, :critics_score, :audience_score)
      save new_watch_movie

    else
      redirect_to signin_path, :alert => 'You need to sign in for access to this page.'
    end
  end

  def save pars
    #@watch = Watch.new(pars)
    @watch = current_user.watches.build(pars)

    if @watch.save

      redirect_to watches_path, :notice => "Watch created!"
    else
      render :new
    end
  end

  def destroy
    Watch.find(params[:id]).destroy
    redirect_to watches_path, :alert => "Movie Seen!"
  end

end

