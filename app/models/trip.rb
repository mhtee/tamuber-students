class Trip < ApplicationRecord
    has_one :cart_route
    has_one :cart
end
