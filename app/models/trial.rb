class Trial < ActiveRecord::Base
	validates_presence_of :start_time, :end_time, :trial_period
	attr_accessible :start_time, :end_time, :trial_period, :questions_attributes

	has_many :results, :dependent => :destroy

	has_many :questions, :dependent => :destroy
	accepts_nested_attributes_for :questions, :allow_destroy => true

	def self.execute_trial params
		trial = find(params[:trial_id])
		question_number = 0
		q_start = false

		if params[:q_num].blank?
			question_number = 1
			q_start = true
		else
			evaluate_result(params, trial, params[:q_num].to_i)
			if params[:q_next]
				question_number = params[:q_num].to_i + 1
			elsif params[:q_prev]
				question_number = params[:q_num].to_i - 1
			elsif params[:q_submit]
				question_number = params[:q_num].to_i
			end
		end

		questions = trial.questions
		total_questions = questions.size
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
		    trial_period: trial.trial_period,
		    q_start: q_start,
		    q_stop: params[:q_submit] ? true : false
		}
	end

	def self.evaluate_result(params, trial, question_number)
		correct_answers = trial.questions[question_number - 1].answer_options.where(correct_option: true)
		user_answers = params[:q_ans]
		correct_answer = false
		if user_answers.split(",").size > 1 || correct_answers.size > 1
			correct_answer = (user_answers.split(",").inject([]) {|array, value| array << value.to_i}).sort == correct_answers.map(&:id).sort
		else
			if params[:q_type] == Question::DESCRIPTIVE
				correct_answer = user_answers == correct_answers.first.description unless correct_answers.first.blank?
			else
				correct_answer = user_answers.to_i == correct_answers.first.id
			end
		end
		if result = trial.results.where(user_id: params[:current_user_id], question_number: question_number).first
			result.correct_answer = correct_answer
			result.save!
		else
			trial.results.create! user_id: params[:current_user_id], question_number: question_number, correct_answer: correct_answer
		end
	end
end