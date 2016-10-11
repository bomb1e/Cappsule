# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160310113331) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "symbol"
  end

  create_table "notifications", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "request_id"
    t.string   "summary"
    t.boolean  "checked"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "to_id"
  end

  create_table "requests", force: :cascade do |t|
    t.integer  "sender_id"
    t.integer  "receiver_id"
    t.integer  "activity_id"
    t.integer  "status"
    t.datetime "accepted_time"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "suggested_times", force: :cascade do |t|
    t.integer  "request_id"
    t.integer  "creator"
    t.integer  "type_of_suggestion"
    t.string   "suggested_times"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "phone_number"
    t.string   "api_key"
    t.string   "avatar"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

end
