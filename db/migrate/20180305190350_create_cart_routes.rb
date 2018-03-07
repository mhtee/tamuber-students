class CreateCartRoutes < ActiveRecord::Migration[5.1]
  def change
    create_table :cart_routes do |t|
      t.decimal :length
      t.string :startPoint
      t.string :endPoint
      
      t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end
