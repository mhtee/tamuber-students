class CartRouteMap < ActiveRecord::Migration[5.1]
  def change
    change_table :cart_routes do |t|
      t.integer :cart_id, foreign_key: true
    end
  end
end
