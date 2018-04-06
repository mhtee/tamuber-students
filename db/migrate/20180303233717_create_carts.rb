class CreateCarts < ActiveRecord::Migration[5.1]
  def change
    create_table :carts do |t|
      t.string :IP, null: false, limit: 15
      t.boolean :inUse, null: false
      
      #t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end