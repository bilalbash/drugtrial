class TrialsController < ApplicationController
	before_filter :authenticate_user!

	def index
    @trials = Trial.all
	end

	def new
		@trial = Trial.new
	end

	def create
		@trial = Trial.new(params[:trial])
		respond_to do |format|
			if @trial.save
				format.html { redirect_to @trial, notice: 'Trial was successfully created.' }
				format.json { render json: @trial, status: :created, location: @trial }
			else
				format.html { render action: "new" }
				format.json { render json: @trial.errors, status: :unprocessable_entity }
			end
		end
	end

	def show
		@trial = Trial.find params[:id]
	end

	def destroy
		@trial = Trial.find params[:id]
		@trial.destroy
		redirect_to trials_path
	end
end