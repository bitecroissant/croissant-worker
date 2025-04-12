import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { v7 as uuidv7 } from 'uuid'
import { time } from './lib/time'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { assert, boolean, object, optional, string, StructError } from 'superstruct'
import { authenticateUser } from './middleware'
import { CoolerError } from './CustomerError'
import { cors } from 'hono/cors'

type Context = {
  Variables: {
    jwt: string
    user_id: string
  }
}
const app = new Hono<Context>()

// 异常处理
app.onError((error, c) => {
  let status: ContentfulStatusCode = 500
  if (error instanceof CoolerError) {
    status = error.status
  } else if (error instanceof StructError) {
    status = 400
  }
  return c.json({ error: error.message }, status)
})

// 允许跨域
app.use('*', cors({ origin: '*', maxAge: 3600 * 6, credentials: true }))

type EventType = {
  name: string
  // 循环
  isLoop: boolean
  // 置顶
  isPin: boolean
}

const eventSchema = object({
  name: string(),
  isLoop: optional(boolean()),
  isPin: optional(boolean()),
})

/**
 * 创建 event
 */
app.post('/events', authenticateUser, async (c) => {
  const userId = c.get('user_id')
  const createForm = await c.req.json<EventType>()
  assert(createForm, eventSchema)

  const { name, isLoop, isPin } = createForm
  const eventId = uuidv7()
  const timestampStr = time().format('yyyy-MM-dd HH:mm:ss fff')
  const newEvent = { id: eventId, name, isLoop, isPin, gmt_create: timestampStr, gmt_modified: timestampStr, userId }
  await env.kv_for_croissant.put(`${userId}_${eventId}`, JSON.stringify(newEvent))

  return c.json(newEvent)
})

/**
 * 获取 event
 */
app.get('/events', authenticateUser, async (c) => {
  const userId = c.get('user_id')
  const userKeys = await env.kv_for_croissant.list({ prefix: `${userId}` })
  const userEvents = await Promise.all(userKeys.keys.map(({ name }) => env.kv_for_croissant.get(name)))
  return c.json(userEvents)
})

// Only for preview
app.get('/', authenticateUser,(c) => {
  const jwt = c.get('jwt')
  const userId = c.get('user_id')
  console.log(jwt)
  console.log(userId)
  return c.text("hello gua, " + jwt + " " + userId)
})

app.get('/error', (c) => {
  throw new CoolerError(401, "I got an arrow on my kneee.")
})

app.get('/error2', (c) => {
  throw new CoolerError(500, "I am sad :( ")
})

export default app
