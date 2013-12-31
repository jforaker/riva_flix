class ChangeDescriptionInMovies < ActiveRecord::Migration
  def change
    change_column :movies, :description, :text, :limit => nil

  end
end
