class CreateMovies < ActiveRecord::Migration
  def change
    create_table :movies do |t|
      t.string :title
      t.string :description
      t.integer :movie_id
      t.string :poster
      t.string :critics_score
      t.string :audience_score
      t.string :movie_reviews

      t.timestamps
    end
  end
end
