class CreateTrips < ActiveRecord::Migration[5.1]
  def change
    create_table :trips do |t|
      t.integer :cart_id
      t.integer :cart_route_id
      t.references :cart_route, foreign_key: true
      t.references :cart, foreign_key: true
      t.timestamps
    end
  end
end
