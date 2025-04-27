import { Context } from "hono";
import { assert, boolean, object, optional, string } from "superstruct";
import { v7 as uuidv7 } from 'uuid'
import { time } from '../lib/time'
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import { eventDatesTable, eventsTable } from "../db/schema";
import { b2N } from "../lib/transfer";
import { eq, desc, and } from "drizzle-orm";
import { CoolerError } from "../CustomerError";

interface Event {
  id: string
  gmt_create: string
  gmt_modified: string
  delete_flag: number
  is_active: boolean
  name: string
  is_loop: boolean
  is_pin: boolean
  creator: string
  emoji?: string
  icon_name?: string
  icon_color?: string
}

interface EventDate {
  id: string
  gmt_create: string
  gmt_modified: string
  delete_flag: number
  is_active: boolean
  creator: string
  events_id: string
  happen_at: string
  // event, solarTerm, holiday
  type: string
}

const eventSchema = object({
  id: optional(string()),
  name: string(),
  is_loop: optional(boolean()),
  is_pin: optional(boolean()),
  emoji: optional(string()),
  icon_name: optional(string()),
  icon_color: optional(string()),
  is_active: optional(boolean()),
})

const eventDateSchema = object({
  events_id: string(),
  happen_at: string()
})

export const createEvent = async (c: Context) => {
  const user_id = c.get('user_id')
  const createForm = await c.req.json<Event>()
  assert(createForm, eventSchema)

  const { name, is_loop, is_pin, emoji, icon_name, icon_color, is_active, } = createForm
  const eventId = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const newEvent = { id: eventId, name, is_loop: b2N(is_loop), is_pin: b2N(is_pin), emoji, icon_name, icon_color, is_active: b2N(is_active), gmt_create: timestampStr, gmt_modified: timestampStr, creator: user_id, delete_flag: 0 }
  const db = drizzle(env.db_for_croissant)
  await db.insert(eventsTable).values(newEvent)
  return c.json({ rources: newEvent })
}

// paged query demo
// export const listEvents = async (c: Context) => {
//   const user_id = c.get('user_id')
//   const { page_no = '1', per_page = '5' } = c.req.query();
//   const pageNo = Number(page_no)
//   const perPage = Number(per_page)

//   const offset = (pageNo - 1) * perPage;
//   const db = drizzle(env.db_for_croissant)
//   const total = await db.select({ value: count(eventsTable.id) }).from(eventsTable).where(and(eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)));
//   const events = await db.select().from(eventsTable).where(and(eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0))).orderBy(desc(eventsTable.gmt_create)).limit(perPage).offset(Number(offset))
//   return c.json({
//     resources: events,
//     pager: {
//       page_no: pageNo,
//       per_page: perPage,
//       total: total[0].value
//     }
//   })
// }

export const listEvents = async (c: Context) => {
  const user_id = c.get('user_id')

  const db = drizzle(env.db_for_croissant)
  const sq = db.select().from(eventDatesTable).where(and(eq(eventDatesTable.creator, user_id), eq(eventDatesTable.is_active, 1), eq(eventDatesTable.delete_flag, 0))).as('event_dates')
  const eventWithDates = await db.select().from(eventsTable)
    .leftJoin(sq, eq(eventsTable.id, sq.events_id))
    .where(and(eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
    .orderBy(desc(eventsTable.is_pin), desc(eventsTable.is_loop), desc(eventsTable.is_active), desc(eventsTable.gmt_create))
  return c.json({
    resources: eventWithDates,
  })
}

export const getEventById = async (c: Context) => {
  const user_id = c.get('user_id')
  const eventId = c.req.param('id')
  const db = drizzle(env.db_for_croissant)
  const event = await db.select().from(eventsTable).where(and(eq(eventsTable.id, eventId), eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
  return c.json({
    resource: event[0]
  })
}

export const updateEvent = async (c: Context) => {
  const user_id = c.get('user_id')
  const eventId = c.req.param('id')
  const updateForm = await c.req.json<Event>()
  console.log(JSON.stringify(updateForm))
  assert(updateForm, eventSchema)
  console.log('2222')
  const { name, is_loop, is_pin, emoji, icon_name, icon_color, is_active, } = updateForm
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const x = await db.update(eventsTable).set({
    name, is_loop: b2N(is_loop), is_pin: b2N(is_pin), emoji, icon_name, icon_color, is_active: b2N(is_active), gmt_modified: timestampStr,
  }).where(and(eq(eventsTable.id, eventId), eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
  return c.json({ rources: x })
}

export const createEventDate = async (c: Context) => {
  const user_id = c.get('user_id')
  const createForm = await c.req.json<EventDate>()
  assert(createForm, eventDateSchema)

  const { events_id, happen_at } = createForm
  const event_date_id = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const newEventDate = { id: event_date_id, happen_at, events_id, type: 'event', is_active: 1, gmt_create: timestampStr, gmt_modified: timestampStr, creator: user_id, delete_flag: 0 }
  const db = drizzle(env.db_for_croissant)
  // 将过往记录变为失效
  const x = await db.update(eventDatesTable).set({ is_active: 0 }).where(and(eq(eventDatesTable.events_id, events_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  await db.insert(eventDatesTable).values(newEventDate)
  return c.json({ rources: newEventDate })
}

export const listEventDates = async (c: Context) => {
  const user_id = c.get('user_id')
  const event_id = c.req.param('event_id')

  const db = drizzle(env.db_for_croissant)
  const event_dates = await db.select().from(eventDatesTable).where(and(eq(eventDatesTable.events_id, event_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0))).orderBy(desc(eventDatesTable.happen_at))
  return c.json({
    resources: event_dates,
    pager: {
      page_no: 1,
      per_page: 9999,
      total: event_dates.length
    }
  })
}

export const deleteEventDate = async (c: Context) => {
  const user_id = c.get('user_id')
  const event_date_id = c.req.param('id')

  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const event_dates = await db.select().from(eventDatesTable).where(and(eq(eventDatesTable.id, event_date_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  if (event_dates.length < 1) { throw new CoolerError(401, '™️ 不可能给你删除!') }
  const x = await db.update(eventDatesTable).set({ delete_flag: 1, gmt_modified: timestampStr, }).where(and(eq(eventDatesTable.id, event_date_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  return c.json({ resource: x })
}

export const updateEventDate = async (c: Context) => {
  const user_id = c.get('user_id')
  const event_date_id = c.req.param('id')
  const createForm = await c.req.json<EventDate>()
  assert(createForm, eventDateSchema)

  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const event_dates = await db.select().from(eventDatesTable).where(and(eq(eventDatesTable.id, event_date_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  if (event_dates.length < 1) { throw new CoolerError(401, '™️ 不可能给你删除!') }
  const x = await db.update(eventDatesTable).set({ happen_at: createForm.happen_at, gmt_modified: timestampStr, }).where(and(eq(eventDatesTable.id, event_date_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  return c.json({ resource: x })
}

export const deleteEvent = async (c: Context) => {
  const user_id = c.get('user_id')
  const event_id = c.req.param('id')

  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const event = await db.select().from(eventsTable).where(and(eq(eventsTable.id, event_id), eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
  if (event.length < 1) { throw new CoolerError(401, '™️ 不可能给你删除!') }
  const x = await db.update(eventsTable).set({ delete_flag: 1, gmt_modified: timestampStr, }).where(and(eq(eventsTable.id, event_id), eq(eventsTable.creator, user_id), eq(eventsTable.delete_flag, 0)))
  return c.json({ resource: x })
}
