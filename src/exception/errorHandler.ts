import { Context, ErrorHandler } from "hono"
import { ContentfulStatusCode } from "hono/utils/http-status"
import { StructError } from "superstruct"
import { CoolerError } from "../CustomerError"

export const errorHandler: ErrorHandler = (error, c) => {
  let status: ContentfulStatusCode = 500
  if (error instanceof CoolerError) {
    status = error.status
  } else if (error instanceof StructError) {
    status = 400
  }
  return c.json({ error: error.message }, status)
}