class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        # print params
        warn_string = ""
        if params.has_key?(:source) and params.has_key?(:destination)
            @src = params[:source] #.to_i
            @dest = params[:destination] #.to_i
            fault = false
            if @src == ""
                fault = true
                warn_string = "Pickup not specified. Please select both pickup 
                and dropoff point"
            elsif @dest == ""
                fault = true
                warn_string = "Drop off not specified. Please select both pickup 
                and dropoff point"
            elsif @src == @dest
                fault = true
                warn_string = "pickup and drop off point are same. Please selec
                t again"
            end
            
            if fault == true
                flash[:notice] = warn_string
                redirect_to '/specify'
            end
            
        else
            if !params.has_key?(:source)
                flash[:notice] = "Please select a pickup point"
            elsif !params.has_key?(:destination)
                flash[:notice] = "Please select a drop off point"
            else
                flash[:notice] = "Please select a pickup and drop off point"
            end
            redirect_to '/specify'
        end
        
        if params.has_key?(:handicap_access)
            @needs_assist = params[:handicap_access].to_s == "on"
        else
            @needs_assist = false
        end
        
        # find source and destination dropoff
        @source = Location.find_by name: @src
        @destination = Location.find_by name: @dest
    end
    
    def specify
        # @places = ["ETB", "HRBB", "MSC", "Evans Library", "Kyle Field", "REC",
        # "EA", "EB", "EC", "ED"]
        @places = Location.all
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