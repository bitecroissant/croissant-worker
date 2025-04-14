import { Hono } from 'hono'
import { authenticateUser } from './middleware'
import { cors } from 'hono/cors'
import { batchCreateSolarTermsDates, createSolarTerm, getNextSolarTerm, listSolarTerms, listSolarTermsDates, updateSolarTerm, deleteSolarTerm, destroySolarTerm, deleteSolarTermDate, destroySolarTermDate } from './module/solarTermsFacade'
import { createEvent, createEventDate, deleteEvent, deleteEventDate, destroyEvent, destroyEventDate, invalidEventDate, listActiveEventsDates, listEvents, updateEvent } from './module/eventsFacade'
import { createPoetryLine, deltePoetryLine, destroyPoetryLine, getNextPoetryLine, listPoetryLines, updatePoetryLine } from './module/poetryLinesFacade'
import { greeting } from './module/greetingFacade'
import { batchCreateHolidaysDates, createHoliday, deleteHoliday, deleteHolidayDate, destroyHoliday, destroyHolidayDate, getNextHoliday, listHolidays, listHolidaysDates, updateHoliday } from './module/holidayFacade'
import { errorHandler } from './exception/errorHandler'

type Context = {
  Variables: {
    userId: string
  }
}

const app = new Hono<Context>()

// 允许跨域
app.use('*', cors({ origin: '*', allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"], maxAge: 3600 * 6, credentials: true }))

/**
 * 24节气
 */
app.post('/v1/solarTerm', authenticateUser, createSolarTerm)
app.post('/v1/solarTermsDates', authenticateUser, batchCreateSolarTermsDates)
app.patch('/v1/solarTerm', authenticateUser, updateSolarTerm)
app.get('/v1/solarTerms', authenticateUser, listSolarTerms)
app.get('/v1/solarTermsDates', authenticateUser, listSolarTermsDates)
app.get('/v1/nextSolarTerm', authenticateUser, getNextSolarTerm)
app.put('/v1/solarTerm', authenticateUser, deleteSolarTerm)
app.delete('/v1/solarTerm', authenticateUser, destroySolarTerm)
app.put('/v1/solarTermDate', authenticateUser, deleteSolarTermDate)
app.delete('/v1/solarTermDate', authenticateUser, destroySolarTermDate)

/**
 * 事件
 */
app.post('/v1/event', authenticateUser, createEvent)
app.post('/v1/eventDate', authenticateUser, createEventDate)
app.patch('/v1/event', authenticateUser, updateEvent)
app.get('/v1/events', authenticateUser, listEvents)
app.get('/v1/activeEventDates', authenticateUser, listActiveEventsDates)
app.put('/v1/event', authenticateUser, deleteEvent)
app.delete('/v1/event', authenticateUser, destroyEvent)
app.put('/v1/invalidEventDate', authenticateUser, invalidEventDate)
app.put('/v1/eventDate', authenticateUser, deleteEventDate)
app.delete('/v1/eventDate', authenticateUser, destroyEventDate)

/**
 * 诗句
 */
app.post('/v1/poetryLine', authenticateUser, createPoetryLine)
app.patch('/v1/poetryLine', authenticateUser, updatePoetryLine)
app.get('/v1/poetryLine/:status', authenticateUser, listPoetryLines)
app.get('/v1/poetryLine/next', authenticateUser, getNextPoetryLine)
app.put('/v1/poetryLine', authenticateUser, deltePoetryLine)
app.delete('/v1/event', authenticateUser, destroyPoetryLine)

/**
 * 假期
 */
app.post('/v1/holiday', authenticateUser, createHoliday)
app.post('/v1/holidaysDates', authenticateUser, batchCreateHolidaysDates)
app.patch('/v1/holiday', authenticateUser, updateHoliday)
app.get('/v1/holidays', authenticateUser, listHolidays)
app.get('/v1/holidaysDates', authenticateUser, listHolidaysDates)
app.get('/v1/nextHoliday', authenticateUser, getNextHoliday)
app.put('/v1/holiday', authenticateUser, deleteHoliday)
app.delete('/v1/holiday', authenticateUser, destroyHoliday)
app.put('/v1/holidayDate', authenticateUser, deleteHolidayDate)
app.delete('/v1/holidayDate', authenticateUser, destroyHolidayDate)

/**
 * Greeting
 */
app.get('/v1/greeting/:pin', greeting)

// 异常处理
app.onError(errorHandler)

export default app


