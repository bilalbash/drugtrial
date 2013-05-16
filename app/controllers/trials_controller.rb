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

	def edit
		redirect_to trials_path, notice: 'not required yet'
		@trial = Trial.find params[:id]
	end

	def update
		@trial = Trial.find params[:id]
    respond_to do |format|
      if @trial.update_attributes(params[:trial])
        format.html { redirect_to @trial, notice: 'Trial was successfully updated.' }
        format.json { render json: @trial, status: :created, location: @trial }
      else
        format.html { render action: "new" }
        format.json { render json: @trial.errors, status: :unprocessable_entity }
      end
    end
	end

	def start_trial
		if params[:trial_id]
		  params.merge!({current_user_id: current_user.id})
			payload = {success: true}.merge(Trial.execute_trial(params))
			render json: payload
		else
			@trials = Trial.all
			@trial = Trial.last
		end
	end

	def results
		@trials = Trial.all
	end
end
