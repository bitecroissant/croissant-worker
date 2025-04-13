import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

// table 用户的免登录口令
export const usersPin = sqliteTable('users_pin', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  uid: text(),
  pin: text(),
  creator: text(),
})

export const events = sqliteTable('events', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  name: text(),
  is_loop: int(),
  is_pin: int(),
  creator: text(),
  emoji: text(),
  icon_name: text(),
  icon_color: text(),
})

export const eventDates = sqliteTable('event_dates', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  // event, solarTerm, holiday
  type: text(),
  events_id: text(),
  happen_at: text(),
  creator: text(),
})

export const solarTerms = sqliteTable('solar_terms', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  index: int(),
  emoji: text(),
  name: text(),
  en_name: text(),
  meaning: text(),
  meteorological_changes: text(),
  related_verses: text(),
  custom: text(),
  recommended_foods: text(),
  addition: text(),
  creator: text(),
})

export const holidays = sqliteTable('holidays', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  name: text(),
  creator: text(),
})

export const poetryLines = sqliteTable('poetry_lines', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  line: text(),
  author: text(),
  dynasty: text(),
  title: text(),
  show_date: text(),
  creator: text(),
})