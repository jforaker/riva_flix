class AddFromWatcherIdToWatches < ActiveRecord::Migration
  def change
    add_column :watches, :from_watcher_id, :integer
  end
end
