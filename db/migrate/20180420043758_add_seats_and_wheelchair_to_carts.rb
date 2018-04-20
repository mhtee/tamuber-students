class AddSeatsAndWheelchairToCarts < ActiveRecord::Migration[5.1]
  def change
    change_table :carts do |t|
      t.integer :seat_count
      t.boolean :handicap_access
    end
  end
end
