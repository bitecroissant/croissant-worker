import {sqliteTable, text, int } from 'drizzle-orm/sqlite-core'

// table 用户的免登录口令
export const usersPin = sqliteTable('users_pin', {
  id: text().primaryKey(),
  gmt_create: text(),
  gmt_modified: text(),
  delete_flag: int(),
  uid: text(),
  pin: text(),
  active_status: text(),
})