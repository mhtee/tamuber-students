class TripsController < ApplicationController
    def new
        @cartRoutes = CartRoute.all
        @cartRoutes.inspect
        Rails.logger.debug @cartRoutes.inspect
        @trip = Trip.new
        @trip.save
    end
    
    def create
        #logger.debug "#{params}"
        @trip = Trip.find(params[:trip][:trip_id])
        @trip.cart_route = CartRoute.find(params[:trip][:cart_route_id])
        render trips_pickup_path
    end
    
    def pickup
        @route = Trip.find(params[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
        
    end
end