class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from ActionController::RoutingError, with: :routing_error
  rescue_from StandardError, with: :standard_error

  protected

  def routing_error(exception)
    respond_with({ error_message: exception.message }, status: :not_found)
  end

  def standard_error(exception)
    respond_with({ error_message: exception.message }, status: :internal_server_error)
  end
end
