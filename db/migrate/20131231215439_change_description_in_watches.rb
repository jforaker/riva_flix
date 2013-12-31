class ChangeDescriptionInWatches < ActiveRecord::Migration
  def change
    change_column :watches, :description, :text, :limit => nil
  end
end
