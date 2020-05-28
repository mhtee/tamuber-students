class UsersController < ApplicationController
  skip_before_action :check_token
  
  def show
    @user = User.find(params[:id])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = "Welcome to TamUber!"
      #redirect_to @user
      redirect_to specify_path
    else
      render 'new'
    end
  end

  private

    def user_params
      params.require(:user).permit(:firstname, :lastname, :email, :password,
                                   :password_confirmation)
    end
    
   
end
