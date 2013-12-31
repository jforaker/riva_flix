class ChangeCriticsConsensusInMovies < ActiveRecord::Migration
  def change
    change_column :movies, :critics_score, :integer

  end
end
