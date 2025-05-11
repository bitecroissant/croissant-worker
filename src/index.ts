import { Hono } from 'hono'
import { authenticateUser } from './middleware'
import { cors } from 'hono/cors'
import { createSolarTermsDates, createSolarTerm, getNextSolarTerm, listSolarTerms, listSolarTermsDatesByYear, updateSolarTerm, deleteSolarTerm, destroySolarTerm, deleteSolarTermDate, destroySolarTermDate, batchCreateSolarTerm, getSolarTermById } from './module/solarTermsFacade'
import { createEvent, createEventDate, deleteEvent, deleteEventDate, getEventById, listEventDates, listEvents, updateEvent, updateEventDate } from './module/eventsFacade'
import { createPoetryLine, deltePoetryLine, destroyPoetryLine, getNextPoetryLine, listPoetryLines, updatePoetryLine } from './module/poetryLinesFacade'
import { greeting } from './module/greetingFacade'
import { batchCreateHolidaysDates, createHoliday, deleteHoliday, deleteHolidayDate, destroyHoliday, destroyHolidayDate, getNextHoliday, listHolidays, listHolidaysDates, updateHoliday } from './module/holidayFacade'
import { errorHandler } from './exception/errorHandler'

type Context = {
  Variables: {
    user_id: string
  }
}

const app = new Hono<Context>()

// 允许跨域
app.use('/v1/*', cors())

/**
 * 事件
 */
app.post('/v1/event', authenticateUser, createEvent)
app.get('/v1/events', authenticateUser, listEvents)
app.get('/v1/event/:id', authenticateUser, getEventById)
app.put('/v1/event/:id', authenticateUser, updateEvent)
app.post('/v1/event_date', authenticateUser, createEventDate)
app.get('/v1/event_dates/:event_id', authenticateUser, listEventDates)
app.delete('/v1/event_date/:id', authenticateUser, deleteEventDate)
app.put('/v1/event_date/:id', authenticateUser, updateEventDate)
app.delete('/v1/event/:id', authenticateUser, deleteEvent)

/**
 * 24节气
 */
app.post('/v1/solar_term', authenticateUser, createSolarTerm)
app.post('/v1/solar_terms', authenticateUser, batchCreateSolarTerm)
app.get('/v1/solar_terms', authenticateUser, listSolarTerms)
app.get('/v1/solar_term/:id', authenticateUser, getSolarTermById)
app.put('/v1/solar_term/:id', authenticateUser, updateSolarTerm)
app.delete('/v1/solar_term/:id', authenticateUser, deleteSolarTerm)
app.put('/v1/solar_terms_dates', authenticateUser, createSolarTermsDates)

app.patch('/v1/solarTerm', authenticateUser, updateSolarTerm)
app.get('/v1/nextSolarTerm', authenticateUser, getNextSolarTerm)
app.put('/v1/solarTermDate', authenticateUser, deleteSolarTermDate)
app.delete('/v1/solarTermDate', authenticateUser, destroySolarTermDate)

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


