RivaFlix::Application.routes.draw do
  root :to => "movies#index"
  resources :users, :only => [:index, :show, :edit, :update ]
  match '/search' => 'movies#search', :via => :post

  resources :movies


  resources :watches
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'
end
