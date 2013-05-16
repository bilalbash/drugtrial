class CreateResults < ActiveRecord::Migration
  def self.up
    create_table :results do |t|
      t.boolean :correct_answer
      t.integer :question_number
      t.integer :user_id
      t.integer :trial_id

      t.timestamps
    end
  end

	def self.down
		drop_table :results
	end
end
