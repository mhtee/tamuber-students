class TamuberController < ApplicationController
  skip_before_action :check_token
  
  
  def index
  end
end
