# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180305190521) do

  create_table "cart_routes", force: :cascade do |t|
    t.decimal "length"
    t.string "startPoint"
    t.string "endPoint"
    t.integer "trip_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_cart_routes_on_trip_id"
  end

  create_table "carts", force: :cascade do |t|
    t.integer "IP"
    t.boolean "inUse"
    t.integer "trip_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_carts_on_trip_id"
  end

  create_table "coordinates", force: :cascade do |t|
    t.decimal "lat"
    t.decimal "lng"
    t.integer "cart_route_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_route_id"], name: "index_coordinates_on_cart_route_id"
  end

  create_table "trips", force: :cascade do |t|
    t.integer "trip_id"
    t.integer "cart_id"
    t.integer "cart_route_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
