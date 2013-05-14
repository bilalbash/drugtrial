class CreateQuestions < ActiveRecord::Migration
  def up
	  create_table :questions do |t|
		  t.text :question_text
		  t.string :question_type
		  t.integer :trial_id

		  t.timestamps
	  end
  end

  def down
	  drop_table :questions
  end
end
