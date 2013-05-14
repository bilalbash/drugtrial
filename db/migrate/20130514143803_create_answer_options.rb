class CreateAnswerOptions < ActiveRecord::Migration
  def change
    create_table :answer_options do |t|
      t.text :description
      t.boolean :correct_option
      t.integer :question_id

      t.timestamps
    end
  end
end
