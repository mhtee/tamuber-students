Rails.application.routes.draw do
  get 'tamuber/index'

  root 'tamuber#index'
  
  resources :trips
  
  get '/pickup', to: 'trips#pickup'
  get '/transit', to: 'trips#transit'
  get '/arrived', to: 'trips#arrived'
  post '/trips/new', to: 'trips#new'
	get '/end', to: 'trips#end'
  get '/cart_not_found', to: 'trips#cart_not_found'
  get '/specify', to: 'trips#specify'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # Added the following for signup and logging
  # Edit Manish start
  get    '/signup',  to: 'users#new'
  post '/signup',  to: 'users#create'
  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'

  #match 'users/show',   to: "trips#specify",      via: :get
  # Edit end
  resources :users
end
