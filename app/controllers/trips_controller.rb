class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        @cartRoutes = CartRoute.all
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
