class CreateAwards < ActiveRecord::Migration[7.0]
  def change
    create_table :awards do |t|
      t.decimal :amount
      t.string :purpose
    end
    add_reference :awards, :filing, index: true, foreign_key: true, null: false
    add_reference :awards, :recipient, index: true, foreign_key: true, null: false
  end
end
