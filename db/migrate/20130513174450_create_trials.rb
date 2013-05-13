class CreateTrials < ActiveRecord::Migration
  def up
	  create_table :trials do |t|
		  t.datetime :start_time
		  t.datetime :end_time
		  t.integer :trial_period

		  t.timestamps
	  end
  end

  def down
	  drop_table :trials
  end
end
