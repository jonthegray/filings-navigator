# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_26_142910) do
  create_table "awards", force: :cascade do |t|
    t.decimal "amount"
    t.string "purpose"
    t.date "tax_period_start"
    t.date "tax_period_end"
    t.integer "filer_id", null: false
    t.integer "recipient_id", null: false
    t.index ["filer_id"], name: "index_awards_on_filer_id"
    t.index ["recipient_id"], name: "index_awards_on_recipient_id"
  end

  create_table "filers", force: :cascade do |t|
    t.string "ein"
    t.string "name"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip_code"
  end

  create_table "recipients", force: :cascade do |t|
    t.string "ein"
    t.string "name"
    t.string "address"
    t.string "city"
    t.string "state"
    t.string "zip_code"
  end

  add_foreign_key "awards", "filers"
  add_foreign_key "awards", "recipients"
end
