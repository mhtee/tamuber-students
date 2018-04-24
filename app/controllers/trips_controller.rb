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
        
        max_seats = 10
        if params.has_key?(:seat_count)
            min = params[:seat_count].to_i
            if (min < 1)
                min = 1
            end
           seats = [min .. max_seats] 
        else
            seats = [1..max_seats]
        end
        
        if params.has_key?(:handicap_access)
            needs_assist = params[:handicap_access].to_s == "on"
        else
            needs_assist = false
        end
        
        if needs_assist
            @cartRoutes = CartRoute.joins(:cart).where(:carts => {:inUse => false}).where(:carts => {:seat_count => seats}).where(:carts => {:handicap_access => true})
        else
            @cartRoutes = CartRoute.joins(:cart).where(:carts => {:inUse => false}).where(:carts => {:seat_count => seats})
        end
        
        
        @trip = Trip.new
        @trip.save

        @routeData = JSON.parse( params["routeData"], object_class: OpenStruct )
    end
    
    def specify
        #Dummy ips for testing the ros functions to get route data
        @cartIPs = [ '192.168.1.1:9090', '10.265.43.62:9090', '165.193.43.23:9090' ]
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
    
    def end
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
    end

end
