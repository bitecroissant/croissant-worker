import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { v7 as uuidv7 } from 'uuid'
import { solarTerms } from '../seeds/solarTerms'
import { time } from './lib/time'

const app = new Hono()

type EventType = {
  name: string
  // 循环
  isLoop: boolean
  // 置顶
  isPin: boolean
}

app.post('/events/:user_id', async (c) => {
  const userId = c.req.param('user_id')
  if (!userId) {
    throw new Error('Missing user id.')
  }
  const createForm = await c.req.json<EventType>()
  const { name, isLoop, isPin } = createForm 
  if (!name) {
    throw new Error('Missing event name.')
  }
  const eventId = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss fff')
  const newEvent = { id: eventId, name, isLoop, isPin, gmt_create: timestampStr, gmt_modified: timestampStr, userId }
  await env.kv_for_croissant.put(`${userId}_${eventId}`, JSON.stringify(newEvent))

  return c.json(newEvent)
})

app.get('/events/:user_id', async (c) => {
  const userId = c.req.param('user_id')
  const userKeys = await env.kv_for_croissant.list({ prefix: `${userId}` })
  const userEvents = await Promise.all(userKeys.keys.map(({ name }) => env.kv_for_croissant.get(name)))
  return c.json(userEvents)
})

app.get('/', (c) => {
  return c.json({ msg: 'Hello Hono! 中文' })
})

app.get('/q', (c) => {
  return c.json(solarTerms)
})

app.get('/w', async (c) => {
  // Get time
  const randomStr = new Date().getTime().toString().slice(-4)
  console.log(`randomStr=${randomStr}`)
  await env.kv_for_croissant.put(`k${randomStr}`, `v${randomStr}`)
  const kList = await env.kv_for_croissant.list()
  return c.json(kList.keys)
})

export default app
