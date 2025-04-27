import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

// table 用户的免登录口令
export const usersPinTable = sqliteTable('users_pin', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  is_active: int(),
  uid: text(),
  pin: text(),
  creator: text(),
})

export const eventsTable = sqliteTable('events', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  is_active: int(),
  name: text(),
  is_loop: int(),
  is_pin: int(),
  creator: text(),
  emoji: text(),
  icon_name: text(),
  icon_color: text(),
})

export const eventDatesTable = sqliteTable('event_dates', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  is_active: int(),
  // event, solarTerm, holiday
  type: text(),
  events_id: text(),
  happen_at: text(),
  creator: text(),
})

export const solarTermsTable = sqliteTable('solar_terms', {
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

export const holidaysTable = sqliteTable('holidays', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  is_active: int(),
  name: text(),
  creator: text(),
})

export const poetryLinesTable = sqliteTable('poetry_lines', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  is_active: int(),
  line: text(),
  author: text(),
  dynasty: text(),
  title: text(),
  show_date: text(),
  creator: text(),
})