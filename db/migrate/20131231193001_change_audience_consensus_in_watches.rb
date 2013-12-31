class ChangeAudienceConsensusInWatches < ActiveRecord::Migration
  def change
    change_column :watches, :audience_score, :integer

  end
end
