class Cart < ApplicationRecord
    has_many :cart_route, dependent: :destroy
end
