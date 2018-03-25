Rails.application.routes.draw do
  get 'tamuber/index'

  root 'tamuber#index'
  
  resources :trips
  
  get '/pickup', to: 'trips#pickup'
  get '/transit', to: 'trips#transit'
  get '/arrived', to: 'trips#arrived'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
