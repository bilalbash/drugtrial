class Trial < ActiveRecord::Base
	validates_presence_of :start_time, :end_time, :trial_period

	has_many :questions
end