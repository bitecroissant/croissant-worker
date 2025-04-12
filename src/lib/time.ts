
type Parts = {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
  ms: number
  timestamp: number
}

type Unit =
  | 'year' | 'years' | 'month' | 'months' | 'day' | 'days'
  | 'hour' | 'hours' | 'minute' | 'minutes' | 'second' | 'seconds'
  | 'ms'

type WritableParts = Omit<Parts, 'timestamp'>

export const time = (t?: number | string | Date) => {
  return new Time(t)
}

export class Time {
  #date: Date

  constructor(t?: number | string | Date) {
    // // 北京时间是 UTC+8, 这里不传是服务器时间，手动设置为东八区时间，这里传入了，是业务时间，业务时间录入的都是东八区时间。
    // const timezoneOffset = 8 * 60; // 将小时转换为分钟
    // this.#date = t ? new Date(t) : new Date(new Date().getTime() + (timezoneOffset * 60000))
    // // this.#date = t ? new Date(t) : new Date()

    // this.#date = t ? new Date(t) : new Date()
    const date = t ? new Date(t) : new Date();
    // 获取当前时间的 UTC 时间
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    // 转换为北京时间（UTC+8）
    const beijingDate = new Date(utcDate.getTime() + 8 * 3600000);
    this.#date = beijingDate;
  }

  get date() {
    return new Date(this.#date)
  }

  // compare
  isBefore(d: string | number | Date) {
    return this.#date < new Date()
  }

  isAfter(d: string | number | Date) {
    return this.#date > new Date(d)
  }

  notBefore(d: string | number | Date) {
    return this.#date >= new Date(d)
  }

  // calc fields
  calcNaturalDaysBetween(otherDate: Time) {
    const diffMilliseconds = new Date(this.year, this.month - 1, this.day).getTime() - new Date(otherDate.year, otherDate.month - 1, otherDate.day).getTime()
    const diffNaturalDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24))
    return Math.abs(diffNaturalDays)
  }

  // parts
  get parts(): Parts {
    const year = this.#date.getFullYear()
    const month = this.#date.getMonth() + 1
    const day = this.#date.getDate()
    const hours = this.#date.getHours()
    const minutes = this.#date.getMinutes()
    const seconds = this.#date.getSeconds()
    const ms = this.#date.getMilliseconds()
    const timestamp = this.#date.getTime()
    return { year, month, day, hours, minutes, seconds, ms, timestamp }
  }

  set parts(t: Partial<WritableParts>) {
    const table = {
      year: 'setFullYear',
      month: 'setMonth',
      day: 'setDate',
      hours: 'setHours',
      minutes: 'setMinutes',
      seconds: 'setSeconds',
      ms: 'setMilliseconds',
    } as const
    Object.entries(t).forEach(([key, val]) => {
      const k = key as keyof typeof t
      const mehodName = table[k]
      val = (k === 'month' ? val - 1 : val)
      this.#date[mehodName](val)
    })
  }

  // helper setter
  set(parts: Partial<WritableParts>) {
    this.parts = parts
    return this
  }

  removeTime() {
    this.set({ hours: 0, minutes: 0, seconds: 0, ms: 0 })
    return this
  }

  add(n: number, unit: Unit) {
    const table = {
      year: 'year',
      years: 'year',
      month: 'month',
      months: 'month',
      day: 'day',
      days: 'day',
      hour: 'hours',
      hours: 'hours',
      minute: 'minutes',
      minutes: 'minutes',
      second: 'seconds',
      seconds: 'seconds',
      ms: 'ms',
    } as const
    this[table[unit]] += n
    return this
  }

  // output

  /**
   * 格式化输出, 默认值是 yyyy-MM-dd
   * @param pattern 目前仅支持 yyyy MM dd HH mm ss fff, ddd 是星期几的英文缩写， dddd 是具体的星期几
   */
  format(pattern = 'yyyy-MM-dd') {
    return pattern.replace(/yyyy/g, this.year.toString())
      .replace(/MM/g, this.month.toString().padStart(2, '0'))
      //   .replace(/dddd/g, this.weekdayStr)
      //   .replace(/ddd/g, this.weekdayShortStr)
      .replace(/dd/g, this.day.toString().padStart(2, '0'))
      .replace(/HH/g, this.hours.toString().padStart(2, '0'))
      .replace(/mm/g, this.minutes.toString().padStart(2, '0'))
      .replace(/ss/g, this.seconds.toString().padStart(2, '0'))
      .replace(/fff/g, this.ms.toString().padStart(3, '0'))
  }

  // fields
  get year() {
    return this.parts.year
  }
  set year(v) {
    this.parts = { year: v }
  }

  get month() {
    return this.parts.month
  }
  set month(v) {
    this.parts = { month: v }
  }

  get day() {
    return this.parts.day
  }
  set day(v) {
    this.parts = { day: v }
  }

  get hours() {
    return this.parts.hours
  }
  set hours(v) {
    this.parts = { hours: v }
  }

  get minutes() {
    return this.parts.minutes
  }
  set minutes(v) {
    this.parts = { minutes: v }
  }

  get seconds() {
    return this.parts.seconds
  }
  set seconds(v) {
    this.parts = { seconds: v }
  }

  get ms() {
    return this.parts.ms
  }
  set ms(v) {
    this.parts = { ms: v }
  }

  get timestamp() {
    return this.parts.timestamp
  }
}