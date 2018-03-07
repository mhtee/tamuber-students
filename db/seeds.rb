# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
cart_routes = [{:length => 9.99, :startPoint => 'Cyclotron Institute', :endPoint => 'HRBB'}
  	 ]

cart_routes.each do |cart_route|
  CartRoute.create!(cart_route)
end

coordinates = [{:lat => 30.621284, :lng => -96.340388, :cart_route => CartRoute.find(1)},
                {:lat => 30.620071, :lng => -96.340747, :cart_route => CartRoute.find(1)},
                {:lat => 30.61998, :lng => -96.340193, :cart_route => CartRoute.find(1)},
                {:lat => 30.61998, :lng => -96.340193, :cart_route => CartRoute.find(1)},
                {:lat => 30.61998, :lng => -96.340193, :cart_route => CartRoute.find(1)}
]

coordinates.each do |coordinate|
  Coordinate.create!(coordinate)
end