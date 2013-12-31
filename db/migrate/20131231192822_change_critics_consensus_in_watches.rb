class ChangeCriticsConsensusInWatches < ActiveRecord::Migration
  def change
    change_column :watches, :critics_score, :integer

  end
end
