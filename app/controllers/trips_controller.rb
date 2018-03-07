class TripsController < ApplicationController
    def new
        @cartRoutes = CartRoute.all
    end
    
    def create
    end
end