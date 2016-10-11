class CreateSuggestedTimes < ActiveRecord::Migration
  def change
    create_table :suggested_times do |t|
      t.integer :request_id
      t.integer :creator
      t.integer :type_of_suggestion
      t.string :suggested_times

      t.timestamps null: false
    end
  end
end
