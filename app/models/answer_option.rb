class AnswerOption < ActiveRecord::Base
	belongs_to :question

	def self.list_answer_options answer_options
		answer_options.inject([]) {|results, answer| results << [answer.description, answer.id]}
	end
end
