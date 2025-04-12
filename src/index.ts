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

/**
 * 24节气
 */
app.post('/solarTerm', authenticateUser, createSolarTerm)
app.post('/solarTermsDates', authenticateUser, batchCreateSolarTermsDates)
app.patch('/solarTerm', authenticateUser, updateSolarTerm)
app.get('/solarTerms', authenticateUser, listSolarTerms)
app.get('/solarTermsDates', authenticateUser, listSolarTermsDates)
app.get('/nextSolarTerm', authenticateUser, getNextSolarTerm)
app.put('/solarTerm', authenticateUser, deleteSolarTerm)
app.delete('/solarTerm', authenticateUser, destroySolarTerm)
app.put('/solarTermDate', authenticateUser, deleteSolarTermDate)
app.delete('/solarTermDate', authenticateUser, destroySolarTermDate)

/**
 * 事件
 */
app.post('/event', authenticateUser, createEvent)
app.post('/eventDate', authenticateUser, createEventDate)
app.patch('/event', authenticateUser, updateEvent)
app.get('/events', authenticateUser, listEvents)
app.get('/activeEventDates', authenticateUser, listActiveEventsDates)
app.put('/event', authenticateUser, deleteEvent)
app.delete('/event', authenticateUser, destroyEvent)
app.put('/invalidEventDate', authenticateUser, invalidEventDate)
app.put('/eventDate', authenticateUser, deleteEventDate)
app.delete('/eventDate', authenticateUser, destroyEventDate)

/**
 * 诗句
 */
app.post('/poetryLine', authenticateUser, createPoetryLine)
app.patch('/poetryLine', authenticateUser, updatePoetryLine)
app.get('/poetryLine/:status', authenticateUser, listPoetryLines)
app.get('/poetryLine/next', authenticateUser, getNextPoetryLine)
app.put('/poetryLine', authenticateUser, deltePoetryLine)
app.delete('/event', authenticateUser, destroyPoetryLine)

/**
 * 假期
 */
app.post('/holiday', authenticateUser, createHoliday)
app.post('/holidaysDates', authenticateUser, batchCreateHolidaysDates)
app.patch('/holiday', authenticateUser, updateHoliday)
app.get('/holidays', authenticateUser, listHolidays)
app.get('/holidaysDates', authenticateUser, listHolidaysDates)
app.get('/nextHoliday', authenticateUser, getNextHoliday)
app.put('/holiday', authenticateUser, deleteHoliday)
app.delete('/holiday', authenticateUser, destroyHoliday)
app.put('/holidayDate', authenticateUser, deleteHolidayDate)
app.delete('/holidayDate', authenticateUser, destroyHolidayDate)

/**
 * Greeting
 */
app.get('/greeting/:pin', greeting)

// 异常处理
app.onError(errorHandler)

// 允许跨域
app.use('*', cors({ origin: '*', maxAge: 3600 * 6, credentials: true }))

export default app


