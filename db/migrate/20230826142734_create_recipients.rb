class CreateRecipients < ActiveRecord::Migration[7.0]
  def change
    create_table :recipients do |t|
      t.string :ein
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip_code
    end
  end
end
