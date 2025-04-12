import { ContentfulStatusCode } from "hono/utils/http-status"

export class CoolerError extends Error {
  constructor(public status: ContentfulStatusCode, public message: string) {
    super(message)
    this.name = 'CoolerError'
  }
}