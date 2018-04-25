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
        routeDataStr = params[:routeData].to_s
        start = routeDataStr.split('startPoint')
        
        #redirect to specify if we don't have route data, otherwise act normally
        if (params[:routeData].class == 'string'.class)
            
            #filter routes by seat number and availability
            seatcount = params[:seat_count].to_i
            carts = Cart.where('seat_count >= ?', seatcount).where(inUse: false).as_json
            
            #abort carts.inspect
            
            #filter by handicap access
            if (params[:handicap_access]) 
                carts = carts.keep_if{ |h| h['handicap_access'] == true}
            end
            
            #filter routes by available carts
            routeDataHash = JSON.parse params[:routeData]
            routesWithAvailCarts = routeDataHash.keep_if do |el|
                cartAvail = false
                carts.each do |cart|
                  if el['cartID'].to_i == cart['id']
                      cartAvail = true
                      break
                  end 
                end
                cartAvail 
            end
             
            #remove duplicate routes
            @routeData = routesWithAvailCarts.uniq{ |s| s.values_at('startPoint', 'endPoint') }
            @trip = Trip.new
            @trip.save
        else
            redirect_to '/specify'
        end
    end
    
    def specify
        #Dummy ips for testing the ros functions to get route data
        @cartIPs = Cart.all.select(:IP)
        @cartIDs = Cart.all.select(:id)
    end
    
    def create
        #load in trip info
        @trip = Trip.find(params[:trip][:trip_id])
        @trip.cart = Cart.find(params[:trip][:cart_id])
        @route = CartRoute.new
        @route.startPoint = params[:startPoint]
        @route.endPoint = params[:endPoint]
        
        #put waypoints into the route
        coordArray = params[:wayPoints].split(';')
        coordArray.each do |coord| 
            latlng = coord.split(',')
            @route.coordinates << Coordinate.create({:lat => latlng[0], :lng => latlng[1]})
        end
        @route.save
        @trip.cart_route = @route
       
        @trip.cart.inUse = true;
        @trip.save
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
        @cartNum = Trip.find(session[:trip_id]).cart.id
    end

    def transit
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
        @cartNum = Trip.find(session[:trip_id]).cart.id
    end
    
    def end
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
    end
end
