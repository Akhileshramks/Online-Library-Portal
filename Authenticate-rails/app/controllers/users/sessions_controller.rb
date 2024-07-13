class Users::SessionsController < Devise::SessionsController
  
  include RackSessionsFix
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    role = current_user.role 

    case role
    when 'student'
      render json: {
        status: { 
          code: 200,
          message: 'Student logged in successfully.',
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
        }
      }, status: :ok
    when 'admin'
      render json: {
        status: { 
          code: 200,
          message: 'Admin logged in successfully.',
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
        }
      }, status: :ok
    when 'librarian'
      render json: {
        status: { 
          code: 200,
          message: 'Librarian logged in successfully.',
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
        }
      }, status: :ok
    else
      render json: {
        status: { 
          code: 400,
          message: 'Unknown user role.',
        }
      }, status: :bad_request
    end
  end



  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(request.headers['Authorization'].split(' ').last, Rails.application.credentials.devise_jwt_secret_key!).first
      current_user = User.find(jwt_payload['sub'])
    end

    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
