class AddNameToTrials < ActiveRecord::Migration
  def self.up
	  add_column :trials, :name, :string
  end

	def self.down
		remove_column :trials, :name
	end
end
