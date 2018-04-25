class CartIPsToString < ActiveRecord::Migration[5.1]
  def up
      change_column :carts, :IP, :string
  end
  def down
      change_column :carts, :IP, :integer
  end 
end
