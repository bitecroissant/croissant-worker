import { MiddlewareHandler } from "hono";
import { CoolerError } from "./CustomerError";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const authenticateUser: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('Authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) throw new CoolerError(403, "🛂 You don't have your ticket!")
  const accessToken = authorization.split(' ')[1];
  if (!accessToken) throw new CoolerError(403, "🛂 You don't have your ticket!")

  const url = new URL('https://bitecroissant.jp.auth0.com/.well-known/jwks.json')
  const JWKS = createRemoteJWKSet(url)
  console.log(accessToken)
  const result = await jwtVerify(accessToken, JWKS, {
    audience: ['https://bitecroissant.jp.auth0.com/userinfo', 'https://croissant.jellybyte.uno',],
    issuer: 'https://bitecroissant.jp.auth0.com/'
  })
  if (!result) { throw new CoolerError(422, '🙈 你的门票过不了闸机(初检)') }
  const { key, payload, protectedHeader } = result 
  if (!payload) { throw new CoolerError(422, '🙈 你的门票过不了闸机(内容不合法）') }
  const { sub } = payload
  if (!sub) { throw new CoolerError(422, '🙈 你的门票过不了闸机(用户信息不对)') }
  c.set('userId', sub)
  await next()
}