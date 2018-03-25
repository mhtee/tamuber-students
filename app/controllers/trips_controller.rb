class TripsController < ApplicationController
    def new
        @cartRoutes = CartRoute.all
        @cartRoutes.inspect
        #Rails.logger.debug @cartRoutes.inspect
        @trip = Trip.new
        @trip.save
    end
    
    def create
        #logger.debug "#{params}"
        @trip = Trip.find(params[:trip][:trip_id])
        @trip.cart_route = CartRoute.find(params[:trip][:cart_route_id])
        session[:trip_id] = @trip.id
        redirect_to '/pickup'
    end
    
    def pickup
        logger.debug '#{params}'
        @route = Trip.find(session[:trip_id]).cart_route
        #first coordinate is the start point
        @start = @route.coordinates[0]
        Rails.logger.debug @start.inspect
        
    end
end