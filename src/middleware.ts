import { MiddlewareHandler } from "hono";
import { CoolerError } from "./CustomerError";

export const authenticateUser: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) throw new CoolerError(403, "🛂 You don't have your ticket!")
  const jwt = authorization.split(' ')[1];
  if (!jwt) throw new CoolerError(403, "🛂 You don't have your ticket!")

  c.set('jwt', jwt)
  c.set('user_id', jwt)
  await next()
}