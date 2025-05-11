import { Context } from "hono";
import { time } from "../lib/time";
import { eq, and, desc, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import { usersPin } from "../../drizzle/migrations/schema";
import { eventDatesTable, eventsTable, solarTermsTable, usersPinTable } from "../db/schema";
import { CoolerError } from "../CustomerError";

export const greeting = async (c: Context) => {
  const pin = c.req.param('pin')
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const pinResults = await db.select().from(usersPinTable)
    .where(and(eq(usersPinTable.pin, pin), eq(usersPinTable.delete_flag, 0), eq(usersPinTable.is_active, 1)))
  if (pinResults.length < 1) { throw new CoolerError(401, '🌋 是不是有病？') }
  const user_id = pinResults[0].uid || ''
  // 事件 & 日期
  const sq = db.select().from(eventDatesTable)
    .where(and(eq(eventDatesTable.creator, user_id), eq(eventDatesTable.type, 'event'), eq(eventDatesTable.is_active, 1), eq(eventDatesTable.delete_flag, 0)))
    .as('event_dates')
  const eventWithDates = await db.select().from(eventsTable)
    .leftJoin(sq, eq(eventsTable.id, sq.events_id))
    .where(and(eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
    .orderBy(desc(eventsTable.is_pin), desc(eventsTable.is_loop), desc(eventsTable.is_active), desc(eventsTable.gmt_create))

  // 节气
  const startOfTodayDate = time().removeTime().date
  const todayTime = time(startOfTodayDate)
  const todayStr = todayTime.format()

  const sq2 = db.select().from(eventDatesTable)
    .where(and(eq(eventDatesTable.type, 'solar_term'),
      eq(eventDatesTable.is_active, 1), eq(eventDatesTable.delete_flag, 0),
      gte(eventDatesTable.happen_at, todayStr)
    ))
    .limit(1)
    .orderBy(eventDatesTable.happen_at)
    .as('solar_term_dates')
  const solarTermsWithDates = await db.select().from(solarTermsTable)
    .rightJoin(sq2, eq(solarTermsTable.id, sq2.events_id))
    .where(and(eq(solarTermsTable.delete_flag, 0)))
  
  const { solar_terms: s, solar_term_dates: d } = solarTermsWithDates[0] 

  if (!s || !d || !d.happen_at) { throw new CoolerError(401, '🌋 是不是有病？') }

  const response: any = {
    "severTime": todayStr,
    "下一个节气": todayTime.calcNaturalDaysBetween(time(d.happen_at)),
    "节气顺序": s.index,
    "emoji": s.emoji,
    "节气名": s.name,
    "节气英文名": s.en_name,
    "节气含义": s.meaning,
    "节气气象表现": s.meteorological_changes,
    "节气相关诗句": s.related_verses,
    "节气风俗习惯": s.custom,
    "节气美食": s.recommended_foods, 
    "节气补充说明": s.addition,
  }
  eventWithDates.forEach(({ events, event_dates }) => {
    (events.name && event_dates?.happen_at) 
      && (response[events.name] = todayTime.calcNaturalDaysBetween(time(event_dates?.happen_at)))
  })

  return c.json(response)
}