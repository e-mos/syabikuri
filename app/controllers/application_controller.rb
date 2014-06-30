class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # after_action :set_xhr2_headers

  after_filter :allow_cross_domain_access

  private
    def allow_cross_domain_access
      puts "*** START ****"
      response.headers["Access-Control-Allow-Origin"] = "*"
      response.headers["Access-Control-Allow-Headers"] = "Content-Type"
      response.headers["Access-Control-Allow-Methods"] = "PUT,DELETE,POST,GET,OPTIONS"
      puts "***  END  ****"
    end
end
