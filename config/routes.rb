Rails.application.routes.draw do
  get 'tamuber/index'

  root 'tamuber#index'
  
  resources :trips
  
  get 'trips/pickup'
  get 'trips/transit'
  get 'trips/arrived'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
