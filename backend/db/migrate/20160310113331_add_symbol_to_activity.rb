class AddSymbolToActivity < ActiveRecord::Migration
  def change
    add_column :activities, :symbol, :string
  end
end
