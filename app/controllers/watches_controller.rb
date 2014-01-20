class WatchesController < ApplicationController
  def index
    @watches = current_user.watches
   # @likes = current_user.watches.likes
  end

  def create
    if user_signed_in?
      @movie = Movie.find_by_movie_id(params[:movie_id]) || Movie.new(:audience_score => params[:audience_score], :critics_score => params[:critics_score], :poster => params[:poster], :movie_id => params[:movie_id], :title => params[:title])
      params[:movie_id] = @movie.movie_id
      params[:description] = @movie.description
      params[:title] = @movie.title
      params[:poster] = @movie.poster
      params[:critics_score] = @movie.critics_score
      params[:audience_score] = @movie.audience_score
      params[:user_id] =  current_user.id
      current_user.like!(@movie)
      new_watch_movie = params.permit(:user_id, :movie_id, :description, :title, :poster, :critics_score, :audience_score)
      save new_watch_movie

    else
      session[:return_to] = request.fullpath
      m_id = request.filtered_parameters['movie_id']
      redirect_to signin_path(m_id), :alert => 'You need to sign in to create a watch list.'

      #redirect_to root_path, :alert => 'You need to sign in to create a watch list.'
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
    @watch = Watch.find(params[:id])
    @watch.destroy

    redirect_to watches_path,
                :alert => "Would you watch #{@watch.title} again? Yes / No "
  end

  def like
      @likeable = Watch.find(params[:likeable_id])
      current_user.like!(@likeable)
  end
  def unlike
      @likeable = Watch.find(params[:likeable_id])
      current_user.unlike!(@likeable)
  end

end

