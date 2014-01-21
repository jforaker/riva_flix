class AddFromWatcherToWatches < ActiveRecord::Migration
  def change
    add_column :watches, :from_watcher, :string
  end
end
