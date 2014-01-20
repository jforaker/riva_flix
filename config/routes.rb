RivaFlix::Application.routes.draw do
  root :to => "movies#index"
  resources :users, :only => [:index, :show, :edit, :update ]

  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'


  match '/search' => 'movies#search', :via => :post

  resources :movies


  resources :watches
  post 'watches/new(:id)' => 'watches#create'

  post 'follow' => 'users#follow'
  post 'unfollow' => 'users#unfollow'
  get 'like' => 'watches#like'
  get 'unlike' => 'watches#unlike'
end
