class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.integer :sender_id
      t.integer :receiver_id
      t.integer :activity_id
      t.integer :status
      t.datetime :accepted_time

      t.timestamps null: false
    end
  end
end
