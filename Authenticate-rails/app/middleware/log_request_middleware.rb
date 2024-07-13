require 'mongo'

class LogRequestMiddleware
  def initialize(app)
    @app = app
    @client = Mongo::Client.new(['127.0.0.1:27017'], database: 'library_logs')
    @collection = @client[:log_records]
  end

  def call(env)
    request = Rack::Request.new(env)
    response = @app.call(env)

    if loggable_action?(request.path, request.request_method)
      user = current_user(request)
      log_entry = {
        path: request.path,
        method: request.request_method,
        params: request.params,
        timestamp: Time.now,
        user_agent: request.user_agent,
        ip: request.ip,
        user: user,
        status: response[0]
      }
      @collection.insert_one(log_entry)
    end

    response
  end

  private

  def loggable_action?(path, method)
    path.match(/\/login|\/logout|\/signup/) && method.match(/POST|DELETE/)
  end

  def current_user(request)
    if request.env['warden'].user
      user = request.env['warden'].user
      { id: user.id, email: user.email, role: user.role }
    else
      nil
    end
  end
end
