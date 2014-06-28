class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_action :set_xhr2_headers

  private
    def set_xhr2_headers
      response.headers["Access-Control-Allow-Origin"] = "*"
      response.headers["Access-Control-Allow-Headers"] = "Content-Type"
      response.headers["Access-Control-Allow-Methods"] = "GET,POST"
    end
end
