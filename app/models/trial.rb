class Trial < ActiveRecord::Base
	validates_presence_of :start_time, :end_time, :trial_period
	attr_accessible :start_time, :end_time, :trial_period, :questions_attributes

	has_many :questions, :dependent => :destroy
	accepts_nested_attributes_for :questions, :allow_destroy => true
end