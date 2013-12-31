class ChangeAudienceConsensusInMovies < ActiveRecord::Migration
  def change
    change_column :movies, :audience_score, :integer

  end
end
