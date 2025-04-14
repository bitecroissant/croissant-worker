import { Context } from "hono";
import { assert, boolean, object, optional, string } from "superstruct";
import { v7 as uuidv7 } from 'uuid'
import { time } from '../lib/time'
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import { eventsTable } from "../db/schema";
import { b2N } from "../lib/transfer";
import { count, eq, desc } from "drizzle-orm";

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

const eventSchema = object({
  name: string(),
  is_loop: optional(boolean()),
  is_pin: optional(boolean()),
  emoji: optional(string()),
  icon_name: optional(string()),
  icon_color: optional(string()),
  is_active: optional(boolean()),
})



export const createEvent = async (c: Context) => {
  const userId = c.get('userId')
  const createForm = await c.req.json<Event>()
  assert(createForm, eventSchema)

  const { name, is_loop, is_pin, emoji, icon_name, icon_color, is_active, } = createForm
  const eventId = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss fff')
  const newEvent = { id: eventId, name, is_loop: b2N(is_loop), is_pin: b2N(is_pin), emoji, icon_name, icon_color, is_active: b2N(is_active), gmt_create: timestampStr, gmt_modified: timestampStr, creator: userId }
  const db = drizzle(env.db_for_croissant)
  await db.insert(eventsTable).values(newEvent)
  return c.json({ rources: newEvent })
}

export const createEventDate = async (c: Context) => {
}

export const updateEvent = async (c: Context) => {
}

export const listEvents = async (c: Context) => {
  const userId = c.get('userId')
  const { page_no = '1', per_page = '5' } = c.req.query();
  const pageNo = Number(page_no)
  const perPage = Number(per_page)

  const offset = (pageNo - 1) * perPage;

  const db = drizzle(env.db_for_croissant)
  const total = await db.select({ value: count(eventsTable.id) }).from(eventsTable);
  const events = await db.select().from(eventsTable).where(eq(eventsTable.creator, userId)).orderBy(desc(eventsTable.gmt_create)).limit(perPage).offset(Number(offset))
  return c.json({
    resources: events,
    pager: {
      page_no: pageNo,
      per_page: perPage,
      total
    }
  })
}

export const listActiveEventsDates = async (c: Context) => {
}

export const deleteEvent = async (c: Context) => {
}

export const destroyEvent = async (c: Context) => {
}

export const invalidEventDate = async (c: Context) => {
}

export const deleteEventDate = async (c: Context) => {
}

export const destroyEventDate = async (c: Context) => {
}
