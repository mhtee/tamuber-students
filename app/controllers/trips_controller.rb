class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        #cutoff = DateTime.current - 5.minutes
        cutoff = DateTime.current - 1.seconds
        Cart.all.each do |cart|
            if (cart.inUse)
                if(cart.last_busy_check)
                    if (cart.last_busy_check < cutoff)
                        cart.inUse = false
                        cart.save
                    end
                else
                    cart.inUse = false
                    cart.save
                end
            end
        end
        
        max_seats = 6
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
            carts = Cart.where('seat_count >= ?', seatcount).where(:inUse => false).as_json
            
            #filter by handicap access
            if (params[:handicap_access]) 
                carts = carts.keep_if{ |h| h['handicap_access'] == true}
            end
            
            
            #filter routes by available carts
            if(params[:routeData] != "") 
                routeDataHash = JSON.parse params[:routeData]
            else 
                routeDataHash = Array.new
            end
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
            if @routeData.length == 0
                flash[:alert] = 'No carts available with those specifications'
                redirect_to '/specify'
            end
            
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
        @message = flash[:alert]
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
       
        #@trip.cart.inUse = true;
        #@trip.save
        #put trip id in session in case user accidently closes tab
        session[:trip_id] = @trip.id
        
        #Mark the cart as busy with a timestamp
        
        currentCart = @trip.cart
        
        if currentCart.inUse == false
            currentCart.inUse = true
            currentCart.last_busy_check = DateTime.current
            currentCart.save
            redirect_to '/pickup'
        else
            flash[:alert] = 'Route is no longer available'
            redirect_to '/specify'
        end
        
        
    end
    
    def pickup
        if(session[:trip_id])
            @route = Trip.find(session[:trip_id]).cart_route
            #first coordinate is the start point
            @start = @route.coordinates[0]
            @cartNum = Trip.find(session[:trip_id]).cart.id
        else
            redirect_to '/specify'
        end
    end

    def transit
        if(session[:trip_id])
            @route = Trip.find(session[:trip_id]).cart_route
            #first coordinate is the start point
            @start = @route.coordinates[0]
            @cartNum = Trip.find(session[:trip_id]).cart.id
        else
            redirect_to '/specify'
        end
    end
    
    def arrived
        if(session[:trip_id])
            @route = Trip.find(session[:trip_id]).cart_route
            #first coordinate is the start point
            @end = @route.coordinates[@route.coordinates.length - 1]
            currentCart = @trip.cart
            currentCart.last_busy_check = DateTime.current
            currentCart.save
        else
            redirect_to '/specify'
        end
    end
    
    def end
        if(session[:trip_id])
            @route = Trip.find(session[:trip_id]).cart_route
            #first coordinate is the start point
            @end = @route.coordinates[@route.coordinates.length - 1]
        else
            redirect_to '/specify'
        end
    end
    
end
