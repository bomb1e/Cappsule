class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :phone_number
      t.string :api_key
      t.string :avatar

      t.timestamps null: false
    end
  end
end