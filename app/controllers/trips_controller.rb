class TripsController < ApplicationController
    
    def cart_not_found
        @cartRoutes = CartRoute.all
    end
    
    def new
        @cartRoutes = CartRoute.all
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
