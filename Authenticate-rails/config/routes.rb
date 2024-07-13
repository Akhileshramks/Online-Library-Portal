Rails.application.routes.draw do
  get 'validate_token',to: 'authenticate#validate_token'
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  namespace :users do
    resources :librarian, only: [:index, :create, :show, :update, :destroy]
  end
end