class Question < ActiveRecord::Base
	MULTI_CHOICE = "Multi Choice"
	EXACT_ANSWER = "Exact Answer"
	DESCRIPTIVE = "Descriptive"
	TYPES = [[MULTI_CHOICE, MULTI_CHOICE], [EXACT_ANSWER, EXACT_ANSWER], [DESCRIPTIVE, DESCRIPTIVE]]
	attr_accessible :question_text, :question_type, :answer_options_attributes

	belongs_to :trial
	has_many :answer_options, :dependent => :destroy
	accepts_nested_attributes_for :answer_options, :allow_destroy => true
end