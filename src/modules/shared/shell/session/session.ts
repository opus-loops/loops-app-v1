import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server"
import { SignJWT, jwtVerify } from "jose"

export type Session = {
  accessToken: string
  refreshToken: string
}

const secretKey = import.meta.env.VITE_SESSION_SECRET_KEY
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encodedKey)

  setCookie("session", session, {
    expires: expiredAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  })
}

export function deleteSession() {
  deleteCookie("session")
}

export async function getSession() {
  const cookie = getCookie("session")
  if (!cookie) return null

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    })

    return payload as Session
  } catch (err) {
    return null
  }
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) {
  const cookie = getCookie("session")
  if (!cookie) return null

  const { payload } = await jwtVerify<Session>(cookie, encodedKey)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!payload) throw new Error("Session not found")

  const newPayload: Session = {
    accessToken,
    refreshToken,
  }

  await createSession(newPayload)
}
