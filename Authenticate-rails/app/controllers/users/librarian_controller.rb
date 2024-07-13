class Users::LibrarianController < ApplicationController
    before_action :authorize_admin!
      
    # GET /users/librarian
    def index
      librarians = User.where(role: :librarian)
      render json: librarians, status: :ok
    end
    
  # POST users/librarian
  def create
    librarian = User.new(librarian_params)
    librarian.role = 2 # Ensure role is set to librarian
    if librarian.save
      render json: librarian, status: :created
    else
      render json: { error: librarian.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end
    
    # GET /users/librarians/:id
    def show
      librarian = User.find(params[:id])
      render json: librarian, status: :ok
    end
    
    # PATCH/PUT /users/librarians/:id
    def update
      librarian = User.find(params[:id])
      if librarian.update(librarian_params)
        render json: librarian, status: :ok
      else
        render json: { error: librarian.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end
    
    # DELETE /users/librarians/:id
    def destroy
      librarian = User.find(params[:id])
      librarian.destroy
      head :no_content
    end
    
    private
    
    def librarian_params
      params.require(:librarian).permit(:name, :email, :password, :password_confirmation)
    end

    def authorize_admin!
        unless current_user.admin? 
          render json: { error: "Unauthorized access" }, status: :unauthorized
        end
      end
  end
  