class CreateCoordinates < ActiveRecord::Migration[5.1]
  def change
    create_table :coordinates do |t|
      t.decimal :lat
      t.decimal :lng
      
      t.references :cart_route, foreign_key: true

      t.timestamps
    end
  end
end
