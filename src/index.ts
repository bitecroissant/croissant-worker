import { Hono } from 'hono'

const app = new Hono()

// SolarTerms
const solarTerms = [
  { name: '立春', emoji: '🌱', index: 1 },
  { name: '雨水', emoji: '💦', index: 2 },
  { name: '惊蛰', emoji: '🐛', index: 3 },
  { name: '春分', emoji: '🌧️', index: 4 },

  { name: '清明', emoji: '🌸', index: 5 },
  { name: '谷雨', emoji: '🌾', index: 6 },
  { name: '立夏', emoji: '🍉', index: 7 },
  { name: '小满', emoji: '🌻', index: 8 },

  { name: '芒种', emoji: '👨‍🌾', index: 9 },
  { name: '夏至', emoji: '☀️', index: 10 },
  { name: '小暑', emoji: '🌡️', index: 11 },
  { name: '大暑', emoji: '🥵', index: 12 },

  { name: '立秋', emoji: '🍂', index: 13 },
  { name: '处暑', emoji: '🌥️', index: 14 },
  { name: '白露', emoji: '💧', index: 15 },
  { name: '秋分', emoji: '🌕', index: 16 },

  { name: '寒露', emoji: '🌫️', index: 17 },
  { name: '霜降', emoji: '❄️', index: 18},
  { name: '立冬', emoji: '⛄', index: 19 },
  { name: '小雪', emoji: '🌨️', index: 20 },

  { name: '大雪', emoji: '🏔️', index: 21 },
  { name: '冬至', emoji: '☃️', index: 22 },
  { name: '小寒', emoji: '🧤', index: 23 },
  { name: '大寒', emoji: '🌬️', index: 24 },

]

app.get('/', (c) => {
  return c.json({ msg: 'Hello Hono! 中文' })
})

app.get('/x', (c) => {
  return c.json(solarTerms)
})

export default app
