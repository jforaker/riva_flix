class MoviesController < ApplicationController

  @@bf = BadFruit.new("82dz4q87rndsb7v9t3wzt3x2")

  def index

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

  def search

    #get search results
    query = params[:query]
    @results = @@bf.movies.search_by_name(query)
    @results.each do |movie|
      @id = movie.id
      @movie_id = params[:movie_id]
      movie_method(movie)
    end

    #find similar results to search query
    @similars = @@bf.movies.similar_movies(@id)
    @similars.each do |movie|
      @id = movie.id
      @movie_id = params[:movie_id]

      movie_method(movie)
    end

  end

  def movie_method(movie)

    params[:poster] = movie.posters.profile
    params[:movie_id] = movie.id
    @movie_id = params[:movie_id]
    params[:description] = movie.synopsis

    # movie.reviews #[0].quote || nil #movie.reviews[0].quote.to_s || ""
    params[:title] = movie.name
    params[:critics_score] = movie.scores.critics_score
    params[:audience_score] = movie.scores.audience_score
    #@rev = movie.reviews.first.quote.blank? ? nil : movie.reviews.first.quote #= params[:movie_reviews]

    #params[:movie_reviews]

    mov_params = params.permit(:movie_id, :description, :title, :poster, :movie_reviews, :audience_score, :critics_score)
    create mov_params, @rev

  end

  def create mov_pars, rev
    if Movie.where(:movie_id => @movie_id).blank?
      # no movie record for this id

      @movie = Movie.new(mov_pars)
      @movie.movie_reviews = rev
      @movie.save
    else
      # at least 1 record for this movie
      return false
    end
  end

  def new
    @movie = Movie.new
  end

  def show
    @movie = Movie.find_by_movie_id(params[:id])  || Movie.find(params[:id])

  end

  def edit  #shows it
    @movie = Movie.find(params[:id])
  end

  def update
    @movie = Movie.find(params[:id])
    if @movie.update_attributes(movie_params)
      redirect_to @movie
      # redirect_to movie_path(@movie)
    else
      render :edit
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
