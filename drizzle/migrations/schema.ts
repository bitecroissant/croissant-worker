import { sqliteTable, AnySQLiteColumn, text, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const usersPin = sqliteTable("users_pin", {
	id: text().primaryKey().notNull(),
	gmtCreate: text("gmt_create"),
	gmtModified: text("gmt_modified"),
	deleteFlag: integer("delete_flag"),
	uid: text(),
	pin: text(),
	activeStatus: text("active_status"),
});

