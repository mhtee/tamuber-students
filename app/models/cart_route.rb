class CartRoute < ApplicationRecord
    has_many :coordinates
    belongs_to :cart, optional: true
end
