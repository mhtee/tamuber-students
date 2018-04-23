class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        #filter routes by seat number and availability
        seatcount = params[:seat_count].to_i
        carts = Cart.where('seat_count >= ?', seatcount).where(inUse: false).as_json
        
        
        #filter by handicap access
        if (params[:handicap_access]) 
            carts = carts.keep_if{ |h| h['handicap_access'] == true}
        end
        
        routeDataHash = JSON.parse params[:routeData]
        #abort routeDataHash.inspect
        routesWithAvailCarts = routeDataHash.keep_if do |el|
            cartAvail = false
            carts.each do |cart|
              #abort cart[:id].inspect
              if el['cartID'].to_i == cart['id']
                  cartAvail = true
                  break
              end 
            end
            cartAvail 
        end
         
        @routeData = routesWithAvailCarts.uniq{ |s| s.values_at('startPoint', 'endPoint') }
        
        @trip = Trip.new
        @trip.save
       
    end
    
    def specify
        #Dummy ips for testing the ros functions to get route data
        #@cartIPs = [ '192.168.1.1:9090', '10.265.43.62:9090', '165.193.43.23:9090' ]
        @cartIPs = Cart.all.select(:IP)
    end
    
    
    def create
        @trip = Trip.find(params[:trip][:trip_id])
        @trip.cart_route = CartRoute.find(params[:trip][:cart_route_id])
        #put trip id in session in case user accidently closes tab
        session[:trip_id] = @trip.id
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
