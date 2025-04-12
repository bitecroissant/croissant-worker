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
  isLoop: int(),
  isPin: int(),
  creator: text(),
  emoji: text(),
  iconName: text(),
  iconColor: text(),
})

export const eventDates = sqliteTable('eventDates', {
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

export const solarTerms = sqliteTable('solarTerms', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  index: int(),
  emoji: text(),
  name: text(),
  enName: text(),
  meaning: text(),
  meteorologicalChanges: text(),
  relatedVerses: text(),
  custom: text(),
  recommendedFoods: text(),
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

export const poetryLines = sqliteTable('poetryLines', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  active_status: text(),
  line: text(),
  author: text(),
  dynasty: text(),
  title: text(),
  showDate: text(),
  creator: text(),
})