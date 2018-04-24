class CartBusyTracking < ActiveRecord::Migration[5.1]
  def change
    change_table :carts do |t|
      t.datetime :last_busy_check
      t.integer :cart_id
    end
  end
end
