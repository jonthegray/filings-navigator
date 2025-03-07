class CreateFilers < ActiveRecord::Migration[7.0]
  def change
    create_table :filers do |t|
      t.string :ein, index: {unique: true}, null: false
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip_code
    end
  end
end
