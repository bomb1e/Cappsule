class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.integer :user_id
      t.integer :request_id
      t.string :summary
      t.boolean :checked
      t.timestamps null: false
    end
  end
end
