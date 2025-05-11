import { env } from "cloudflare:workers";
import { v7 as uuidv7 } from 'uuid'
import { time } from "../lib/time"
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { array, assert, number, object, optional, string } from "superstruct";
import { eventDatesTable, eventsTable, solarTermsTable } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { CoolerError } from "../CustomerError";
import { eventDateSchema } from "./eventsFacade";

interface SolarTerm {
  id: string
  gmt_create: string
  gmt_modified: string
  delete_flag: number
  creator: string
  index: number
  name: string
  en_name: string
  emoji: string
  meaning: string,
  meteorological_changes: string
  related_verses: string
  custom: string
  recommended_foods: string
  addition: string
}

interface CreateEventDate {
  events_id: string
  happen_at: string
}

const solarTermSchema = object({
  id: optional(string()),
  index: number(),
  name: string(),
  en_name: string(),
  emoji: string(),
  meaning: string(),
  meteorological_changes: string(),
  related_verses: string(),
  custom: string(),
  recommended_foods: string(),
  addition: string(),
})

const solarTermsSchema = array(solarTermSchema)

export const createSolarTerm = async (c: Context) => {
  const user_id = c.get('user_id')
  const createForm = await c.req.json<SolarTerm>()
  assert(createForm, solarTermSchema)

  const { index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, } = createForm
  const id = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const newSolarTerm = { id, index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, gmt_create: timestampStr, gmt_modified: timestampStr, creator: user_id, delete_flag: 0 }
  const db = drizzle(env.db_for_croissant)
  await db.insert(solarTermsTable).values(newSolarTerm)
  return c.json({ rource: newSolarTerm })
}

export const batchCreateSolarTerm = async (c: Context) => {
  const user_id = c.get('user_id')
  const batchCreateForm = await c.req.json<SolarTerm[]>()
  assert(batchCreateForm, solarTermsSchema)

  const db = drizzle(env.db_for_croissant)
  const result: SolarTerm[] = []
  for (let i = 0; i < batchCreateForm.length; i++) {
    const item = batchCreateForm[i]
    const { index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, } = item
    const id = uuidv7()
    const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
    const newSolarTerm = { id, index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, gmt_create: timestampStr, gmt_modified: timestampStr, creator: user_id, delete_flag: 0 }
    await db.insert(solarTermsTable).values(newSolarTerm)
    result.push(newSolarTerm)
  }
  return c.json({ rources: result })
}

export const listSolarTerms = async (c: Context) => {
  const db = drizzle(env.db_for_croissant)
  const sq = db.select().from(eventDatesTable).where(and(eq(eventDatesTable.type, 'solar_term'), eq(eventDatesTable.is_active, 1), eq(eventDatesTable.delete_flag, 0))).as('event_dates')
  const solarTermsWithDates = await db.select().from(solarTermsTable)
    .leftJoin(sq, eq(solarTermsTable.id, sq.events_id))
    .where(eq(solarTermsTable.delete_flag, 0))
    .orderBy(solarTermsTable.index)
  return c.json({
    resources: solarTermsWithDates,
  })
}

export const getSolarTermById = async (c: Context) => {
  const id = c.req.param('id')
  const db = drizzle(env.db_for_croissant)
  const results = await db.select().from(solarTermsTable).where(and(eq(solarTermsTable.id, id), eq(solarTermsTable.delete_flag, 0)))
  return c.json({ resource: results[0] })
}

export const updateSolarTerm = async (c: Context) => {
  const id = c.req.param('id')
  const updateForm = await c.req.json<SolarTerm>()
  assert(updateForm, solarTermSchema)
  const { index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, } = updateForm
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const x = await db.update(solarTermsTable)
    .set({ index, name, en_name, emoji, meaning, meteorological_changes, related_verses, custom, recommended_foods, addition, })
    .where(and(eq(solarTermsTable.id, id), eq(solarTermsTable.delete_flag, 0)))
  return c.json({ rources: x })
}

export const deleteSolarTerm = async (c: Context) => {
  const id = c.req.param('id')
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const db = drizzle(env.db_for_croissant)
  const solar_terms = await db.select().from(solarTermsTable).where(and(eq(solarTermsTable.id, id), eq(solarTermsTable.delete_flag, 0)))
  if (solar_terms.length < 1) { throw new CoolerError(401, '☄️ 没找到遥控器，删除失败') }
  const x = await db.update(solarTermsTable).set({ delete_flag: 1, gmt_modified: timestampStr, }).where(and(eq(solarTermsTable.id, id), eq(solarTermsTable.delete_flag, 0)))
  return c.json({ resource: x })
}

export const createSolarTermsDates = async (c: Context) => {
  const user_id = c.get('user_id')
  const createForm = await c.req.json<CreateEventDate>()
  assert(createForm, eventDateSchema)

  const { events_id, happen_at } = createForm
  const event_date_id = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss')
  const newEventDate = { id: event_date_id, happen_at, events_id, type: 'solar_term', is_active: 1, gmt_create: timestampStr, gmt_modified: timestampStr, creator: user_id, delete_flag: 0 }
  const db = drizzle(env.db_for_croissant)
  // 将过往记录变为失效
  const x = await db.update(eventDatesTable).set({ is_active: 0 }).where(and(eq(eventDatesTable.events_id, events_id), eq(eventDatesTable.creator, user_id), eq(eventDatesTable.delete_flag, 0)))
  await db.insert(eventDatesTable).values(newEventDate)
  return c.json({ rources: newEventDate })
}

export const destroySolarTerm = async (c: Context) => {
}

export const getNextSolarTerm = async (c: Context) => {
}





export const deleteSolarTermDate = async (c: Context) => {
}

export const destroySolarTermDate = async (c: Context) => {
}
