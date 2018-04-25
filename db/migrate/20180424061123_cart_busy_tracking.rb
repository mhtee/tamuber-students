class CartBusyTracking < ActiveRecord::Migration[5.1]
  def change
    change_table :carts do |t|
      t.datetime :last_busy_check
    end
  end
end
