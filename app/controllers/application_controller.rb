class ApplicationController < ActionController::Base
  protect_from_forgery

	def t_results
		puts
		puts
		puts
		puts params.inspect
		puts
		puts
		render json: params
	end
end
