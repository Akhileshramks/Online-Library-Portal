class AuthenticateController < ApplicationController
    def validate_token
        if request.headers['Authorization'].present?
          token = request.headers['Authorization'].split(' ').last
          begin
            jwt_payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key!).first
            current_user = User.find(jwt_payload['sub'])
            render json: current_user , status: :ok
          rescue JWT::ExpiredSignature
            render json: { valid: false, error: 'Token has expired' }, status: :unauthorized
          rescue JWT::DecodeError
            render json: { valid: false, error: 'Invalid token' }, status: :unauthorized
          end
        else
          render json: { valid: false, error: 'No Authorization header present' }, status: :unauthorized
      end
    end
end
