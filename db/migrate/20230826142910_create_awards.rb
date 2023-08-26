class CreateAwards < ActiveRecord::Migration[7.0]
  def change
    create_table :awards do |t|
      t.decimal :amount
      t.string :purpose
      t.date :tax_period_end
    end
    add_reference :awards, :filer, index: true, foreign_key: true, null: false
    add_reference :awards, :recipient, index: true, foreign_key: true, null: false
  end
end
