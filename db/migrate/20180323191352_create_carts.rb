class CreateCarts < ActiveRecord::Migration[5.1]
  def change
    create_table :carts do |t|
      t.integer :IP
      t.boolean :inUse
      
      t.references :trip #, foreign_key: true

      t.timestamps
    end
  end
end
