class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        cutoff = DateTime.current - 5.minutes
        Cart.all.each do |cart|
            if (cart.inUse)
                if (cart.last_busy_check < cutoff)
                    cart.inUse = false
                    cart.save
                end
            end
        end
        
        #@carts = Cart.where(inUse: false)
        @carts = Cart.all
        
        @cartRoutes = CartRoute.joins(:cart).where(:carts => {:inUse => false})
        
        @trip = Trip.new
        @trip.save
        
    end
    
    def specify
    end
    
    
    def create
        @trip = Trip.find(params[:trip][:trip_id])
        @trip.cart_route = CartRoute.find(params[:trip][:cart_route_id])
        #put trip id in session in case user accidently closes tab
        session[:trip_id] = @trip.id
        
        #Mark the cart as busy with a timestamp
        currentCart = Cart.where(cart_id: params[:trip][:cart_id])
        if currentCart.exists?
            currentCart = currentCart.first
            currentCart.inUse = true
            currentCart.last_busy_check = DateTime.current
            currentCart.save
        else
            redirect_to '/new'
        end
        
        redirect_to '/pickup'
    end
    
    def pickup
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
        
    end

    def transit
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
        
    end
    
end
