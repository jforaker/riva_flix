class MoviesController < ApplicationController

  @@bf = BadFruit.new("82dz4q87rndsb7v9t3wzt3x2")
  Tmdb::Api.key("fc0e47838eaa8d1af428c2da1ba55976")
  #Tmdb.api_key = "fc0e47838eaa8d1af428c2da1ba55976"
  #Tmdb.default_language = "en"


  def index

    @opening_movies = @@bf.lists.opening_movies
    @opening_movies.each do |movie|

      movie_method(movie)
    end

    @upcoming_movies = @@bf.lists.upcoming_movies
    @upcoming_movies.each do |movie|
      movie_method(movie)
    end

    @current_dvds = @@bf.lists.current_dvd_releases
    @current_dvds.each do |movie|
      movie_method(movie)
    end

    @new_dvds =  @@bf.lists.new_dvd_releases
    @new_dvds.each do |movie|
      movie_method(movie)
    end

    @upcoming_dvds = @@bf.lists.upcoming_dvd_releases
    @upcoming_dvds.each do |movie|
      movie_method(movie)
    end
  end

  def chart_method(movie)
    @chart = LazyHighCharts::HighChart.new('graph', :class => movie.id, :style => "min-width: 350px; height: 200px; margin: 0 auto") do |f|
      f.xAxis(:categories => ["RottenScore"])
      f.series(:name => "Audience", :yAxis => 0, :data => [movie.audience_score.to_i || movie.scores.audience_score.to_i])
      f.series(:name => "Critics", :yAxis => 0, :data => [movie.critics_score.to_i || movie.scores.critics_score.to_i])
      f.yAxis [
                  {:title => {:text => "", :margin => 30} },
                  {:title => {:text => ""},  :opposite => true},
              ]
      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"bar"})
    end
  end

  def search

    #get search results
    query = params[:query]
    @results = @@bf.movies.search_by_name(query)
    @results.each do |movie|
      @id = movie.id
      @movie_id = params[:movie_id]
      movie_method(movie)
      chart_method(movie)
    end

    #find similar results to search query
    if @results != nil  && @results != []
      @similars = @@bf.movies.similar_movies(@id)
      @similars.each do |movie|
        @id = movie.id
        @movie_id = params[:movie_id]
        chart_method(movie)
        movie_method(movie)
      end
    else
      redirect_to root_path, :alert => "try again"
    end
  end

  def movie_method(movie)
    params[:poster] = movie.posters.profile
    params[:movie_id] = movie.id
    @movie_id = params[:movie_id]
    params[:description] = movie.synopsis
    params[:title] = movie.name
    params[:critics_score] = movie.scores.critics_score
    params[:audience_score] = movie.scores.audience_score
    mov_params = params.permit(:movie_id, :description, :title, :poster, :movie_reviews, :audience_score, :critics_score)
    create mov_params
  end

  def create mov_pars
    if Movie.where(:movie_id => @movie_id).blank?
      # no movie record for this id
      @movie = Movie.new(mov_pars)
      @movie.save
    else
      # at least 1 record for this movie
      return false
    end
  end


  def show
    #search idd
    @movie = Movie.find_by_movie_id(params[:id])  || Movie.find(params[:id])
    idd =   "#{@movie.movie_id.to_i}"

    tmdbmov = Tmdb::Movie.find(@movie.title)[0].id
    tmd =  Tmdb::Movie.trailers(tmdbmov)
    @youtube_id = !tmd["youtube"][0].blank? ? tmd["youtube"][0]["source"] : ""


    chart_method(@movie)

    #find similar results to search query
    @similars = @@bf.movies.similar_movies(idd)
    @similars.each do |movie|
      @id = movie.id
      @movie_id = params[:movie_id]
      movie_method(movie)
    end
  end

  def destroy
    Movie.find(params[:id]).destroy
    flash[:success] = "movie deleted."
    redirect_to movies_path
  end

  private

  def movie_params
    params.require('movie').permit(:title, :description, :year_released, :movie_poster, :movie_reviews)
  end
end


#home tab
#tab for each section > scroll
#      trailer
#      save what i've watched
#rate as "watch again"  or "would not watch again" (suggest it to a friend)
#send a list to a friend
#categorize list
