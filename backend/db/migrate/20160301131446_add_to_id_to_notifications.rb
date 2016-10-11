class AddToIdToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :to_id, :integer
  end
end
