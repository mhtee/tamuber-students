class Cart < ApplicationRecord
    has_one :cart_route
    has_one :trip
end
