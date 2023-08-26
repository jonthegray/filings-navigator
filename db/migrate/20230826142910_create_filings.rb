class CreateFilings < ActiveRecord::Migration[7.0]
  def change
    create_table :filings do |t|
      t.datetime :filing_time
      t.date :tax_period_end
    end
    add_reference :filings, :filer, index: true, foreign_key: true, null: false
  end
end
