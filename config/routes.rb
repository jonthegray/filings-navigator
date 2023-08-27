Rails.application.routes.draw do
  root to: "main#index"

  namespace :api do
    resources :awards, only: [:index, :show]
    resources :filers, only: [:index, :show]
    resources :filings, only: [:index, :show]
    resources :recipients, only: [:index, :show]
  end
end
