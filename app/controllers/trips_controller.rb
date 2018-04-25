class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        #abort params[:routeData].inspect
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
            #abort routesWithAvailCarts.inspect
            @routeData = routesWithAvailCarts.uniq{ |s| s.values_at('startPoint', 'endPoint') }
            #puts( @routeData )
            
            @trip = Trip.new
            @trip.save
        else
            redirect_to '/specify'
        end
       
       
    end
    
    def specify
        #Dummy ips for testing the ros functions to get route data
        @cartIPs = Cart.all.select(:IP)
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
    
end
