class Trial < ActiveRecord::Base
	validates_presence_of :start_time, :end_time, :trial_period
	attr_accessible :start_time, :end_time, :trial_period, :questions_attributes

	has_many :questions, :dependent => :destroy
	accepts_nested_attributes_for :questions, :allow_destroy => true

	def self.execute_trial params
		trial = find(params[:trial_id])
		if params[:q_num].blank?
			question_number = 1
		else
			if params[:q_next]
				question_number = params[:q_num].to_i + 1
			elsif params[:q_prev]
				question_number = params[:q_num].to_i - 1
			end
		end
		# required for results calculation
		params[:q_ans].inspect
		# required for making result sheet
		questions = trial.questions
		total_questions = questions.size
		if total_questions != 0
			question = questions[question_number - 1]
			answers = question.answer_options
			q_last = question_number == total_questions ? true : false
			q_first = question_number == 1 ? true : false
			{
					q_text: question.question_text,
					q_num: question_number,
					q_type: question.question_type,
					q_ans: AnswerOption.list_answer_options(answers),
					q_last: q_last,
					q_first: q_first,
			    trial_period: trial.trial_period
			}
		else
			{no_question: true}
		end
	end
end